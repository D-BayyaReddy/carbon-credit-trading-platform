const { getContract, getWeb3 } = require('../config/web3');
const { Transaction } = require('../models');
const logger = require('../utils/logger');

class BlockchainService {
  constructor() {
    this.contract = getContract();
    this.web3 = getWeb3().web3;
  }

  async getBalance(address) {
    try {
      const balance = await this.contract.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      logger.error('Error getting balance:', error);
      throw new Error('Failed to get balance from blockchain');
    }
  }

  async getActiveListings() {
    try {
      const listingIds = await this.contract.methods.getActiveListings().call();
      const listings = [];

      for (const id of listingIds) {
        const listing = await this.contract.methods.listings(id).call();
        if (listing.active) {
          listings.push({
            id: parseInt(id),
            seller: listing.seller,
            amount: this.web3.utils.fromWei(listing.amount, 'ether'),
            pricePerCredit: this.web3.utils.fromWei(listing.pricePerCredit, 'ether'),
            active: listing.active,
            listingDate: new Date(parseInt(listing.listingDate) * 1000)
          });
        }
      }

      return listings;
    } catch (error) {
      logger.error('Error getting active listings:', error);
      throw new Error('Failed to get listings from blockchain');
    }
  }

  async listCredits(sellerAddress, amount, pricePerCredit) {
    try {
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
      const priceWei = this.web3.utils.toWei(pricePerCredit.toString(), 'ether');

      const result = await this.contract.methods
        .listCredits(amountWei, priceWei)
        .send({ from: sellerAddress });

      // Record transaction in database
      await Transaction.create({
        transactionHash: result.transactionHash,
        fromAddress: sellerAddress,
        toAddress: this.contract.options.address, // Contract address holds listed credits
        amount: parseFloat(amount),
        price: parseFloat(pricePerCredit),
        transactionType: 'transfer', // Transfer to contract for listing
        status: 'completed',
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed
      });

      return {
        listingId: parseInt(result.events.CreditsListed.returnValues.listingId),
        transactionHash: result.transactionHash
      };
    } catch (error) {
      logger.error('Error listing credits:', error);
      throw new Error('Failed to list credits on blockchain');
    }
  }

  async purchaseCredits(buyerAddress, listingId, totalPrice) {
    try {
      const priceWei = this.web3.utils.toWei(totalPrice.toString(), 'ether');

      const result = await this.contract.methods
        .purchaseCredits(listingId)
        .send({ 
          from: buyerAddress, 
          value: priceWei 
        });

      const event = result.events.CreditsPurchased.returnValues;

      // Record transaction in database
      await Transaction.create({
        transactionHash: result.transactionHash,
        fromAddress: buyerAddress,
        toAddress: event.seller,
        amount: parseFloat(this.web3.utils.fromWei(event.amount, 'ether')),
        price: parseFloat(this.web3.utils.fromWei(event.totalPrice, 'ether')) / parseFloat(this.web3.utils.fromWei(event.amount, 'ether')),
        transactionType: 'purchase',
        status: 'completed',
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed
      });

      return {
        transactionHash: result.transactionHash,
        amount: this.web3.utils.fromWei(event.amount, 'ether'),
        totalPrice: this.web3.utils.fromWei(event.totalPrice, 'ether')
      };
    } catch (error) {
      logger.error('Error purchasing credits:', error);
      throw new Error('Failed to purchase credits on blockchain');
    }
  }

  async getPlatformStats() {
    try {
      const stats = await this.contract.methods.getPlatformStats().call();
      
      return {
        totalSupply: this.web3.utils.fromWei(stats.totalSupply, 'ether'),
        creditsIssued: parseInt(stats.creditsIssued),
        transactions: parseInt(stats.transactions),
        activeListingsCount: parseInt(stats.activeListingsCount)
      };
    } catch (error) {
      logger.error('Error getting platform stats:', error);
      throw new Error('Failed to get platform stats from blockchain');
    }
  }

  async getUserListings(userAddress) {
    try {
      const listingIds = await this.contract.methods.getUserListings(userAddress).call();
      const listings = [];

      for (const id of listingIds) {
        const listing = await this.contract.methods.listings(id).call();
        listings.push({
          id: parseInt(id),
          seller: listing.seller,
          amount: this.web3.utils.fromWei(listing.amount, 'ether'),
          pricePerCredit: this.web3.utils.fromWei(listing.pricePerCredit, 'ether'),
          active: listing.active,
          listingDate: new Date(parseInt(listing.listingDate) * 1000)
        });
      }

      return listings;
    } catch (error) {
      logger.error('Error getting user listings:', error);
      throw new Error('Failed to get user listings from blockchain');
    }
  }

  async cancelListing(sellerAddress, listingId) {
    try {
      const result = await this.contract.methods
        .cancelListing(listingId)
        .send({ from: sellerAddress });

      return {
        transactionHash: result.transactionHash,
        success: true
      };
    } catch (error) {
      logger.error('Error cancelling listing:', error);
      throw new Error('Failed to cancel listing on blockchain');
    }
  }
}

module.exports = new BlockchainService();