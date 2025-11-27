import { carbonCreditAddress } from '../contracts/contract-addresses.json';
import CarbonCreditABI from '../contracts/CarbonCredit.json';

class ContractService {
  constructor(web3, account) {
    this.web3 = web3;
    this.account = account;
    this.contract = new web3.eth.Contract(CarbonCreditABI.abi, carbonCreditAddress);
  }

  async getBalance(address = this.account) {
    try {
      const balance = await this.contract.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get balance from contract');
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
            listingDate: new Date(parseInt(listing.listingDate) * 1000),
            totalPrice: (parseFloat(this.web3.utils.fromWei(listing.amount, 'ether')) * 
                        parseFloat(this.web3.utils.fromWei(listing.pricePerCredit, 'ether'))).toFixed(6)
          });
        }
      }

      return listings;
    } catch (error) {
      console.error('Error getting active listings:', error);
      throw new Error('Failed to get listings from contract');
    }
  }

  async listCredits(amount, pricePerCredit) {
    try {
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
      const priceWei = this.web3.utils.toWei(pricePerCredit.toString(), 'ether');

      const result = await this.contract.methods
        .listCredits(amountWei, priceWei)
        .send({ from: this.account });

      return {
        listingId: parseInt(result.events.CreditsListed.returnValues.listingId),
        transactionHash: result.transactionHash
      };
    } catch (error) {
      console.error('Error listing credits:', error);
      throw new Error('Failed to list credits on contract');
    }
  }

  async purchaseCredits(listingId, totalPrice) {
    try {
      const priceWei = this.web3.utils.toWei(totalPrice.toString(), 'ether');

      const result = await this.contract.methods
        .purchaseCredits(listingId)
        .send({ 
          from: this.account, 
          value: priceWei 
        });

      const event = result.events.CreditsPurchased.returnValues;

      return {
        transactionHash: result.transactionHash,
        amount: this.web3.utils.fromWei(event.amount, 'ether'),
        totalPrice: this.web3.utils.fromWei(event.totalPrice, 'ether'),
        seller: event.seller
      };
    } catch (error) {
      console.error('Error purchasing credits:', error);
      throw new Error('Failed to purchase credits on contract');
    }
  }

  async cancelListing(listingId) {
    try {
      const result = await this.contract.methods
        .cancelListing(listingId)
        .send({ from: this.account });

      return {
        transactionHash: result.transactionHash,
        success: true
      };
    } catch (error) {
      console.error('Error cancelling listing:', error);
      throw new Error('Failed to cancel listing on contract');
    }
  }

  async getUserListings(userAddress = this.account) {
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
      console.error('Error getting user listings:', error);
      throw new Error('Failed to get user listings from contract');
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
      console.error('Error getting platform stats:', error);
      throw new Error('Failed to get platform stats from contract');
    }
  }

  // Estimate gas for transactions
  async estimateListCredits(amount, pricePerCredit) {
    try {
      const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
      const priceWei = this.web3.utils.toWei(pricePerCredit.toString(), 'ether');

      const gasEstimate = await this.contract.methods
        .listCredits(amountWei, priceWei)
        .estimateGas({ from: this.account });

      return this.web3.utils.fromWei(
        (gasEstimate * await this.web3.eth.getGasPrice()).toString(),
        'ether'
      );
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '0';
    }
  }

  async estimatePurchaseCredits(listingId, totalPrice) {
    try {
      const priceWei = this.web3.utils.toWei(totalPrice.toString(), 'ether');

      const gasEstimate = await this.contract.methods
        .purchaseCredits(listingId)
        .estimateGas({ 
          from: this.account, 
          value: priceWei 
        });

      return this.web3.utils.fromWei(
        (gasEstimate * await this.web3.eth.getGasPrice()).toString(),
        'ether'
      );
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '0';
    }
  }
}

export default ContractService;