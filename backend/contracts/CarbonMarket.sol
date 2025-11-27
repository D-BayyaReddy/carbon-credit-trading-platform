// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CarbonMarket is Ownable, ReentrancyGuard {
    address public carbonCreditToken;
    
    struct MarketStats {
        uint256 totalVolume;
        uint256 totalTrades;
        uint256 averagePrice;
    }
    
    MarketStats public marketStats;
    
    event TradeExecuted(
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 price,
        uint256 timestamp
    );
    
    constructor(address _carbonCreditToken) {
        carbonCreditToken = _carbonCreditToken;
    }
    
    function updateMarketStats(uint256 amount, uint256 price) external {
        require(msg.sender == carbonCreditToken, "Only token contract can update");
        marketStats.totalVolume += amount;
        marketStats.totalTrades++;
        marketStats.averagePrice = (marketStats.averagePrice * (marketStats.totalTrades - 1) + price) / marketStats.totalTrades;
        
        emit TradeExecuted(
            tx.origin,
            msg.sender,
            amount,
            price,
            block.timestamp
        );
    }
    
    function getMarketStats() external view returns (MarketStats memory) {
        return marketStats;
    }
}