// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CarbonCredit is ERC20, Ownable, ReentrancyGuard {
    struct CreditMetadata {
        string projectName;
        string projectLocation;
        uint256 vintageYear;
        string methodology;
        string verificationBody;
        string projectType;
        string uri;
        uint256 issuanceDate;
        address issuer;
    }
    
    struct Listing {
        address seller;
        uint256 amount;
        uint256 pricePerCredit;
        bool active;
        uint256 listingDate;
    }
    
    mapping(uint256 => CreditMetadata) public creditMetadata;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public userListings;
    
    uint256 public listingCounter;
    uint256 public totalCreditsIssued;
    uint256 public totalTransactions;
    
    event CreditsIssued(
        address indexed issuer,
        address[] recipients,
        uint256[] amounts,
        string projectName,
        uint256 issuanceDate
    );
    
    event CreditsListed(
        uint256 indexed listingId,
        address indexed seller,
        uint256 amount,
        uint256 pricePerCredit,
        uint256 listingDate
    );
    
    event CreditsPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 totalPrice,
        uint256 purchaseDate
    );
    
    event ListingCancelled(
        uint256 indexed listingId,
        address indexed seller,
        uint256 cancelDate
    );

    constructor() ERC20("CarbonCredit", "CCO2") {
        listingCounter = 1;
        totalCreditsIssued = 0;
        totalTransactions = 0;
    }

    function issueBulkCredits(
        address[] memory recipients,
        uint256[] memory amounts,
        string[] memory projectNames,
        string[] memory projectLocations,
        uint256[] memory vintageYears,
        string[] memory methodologies,
        string[] memory verificationBodies,
        string[] memory projectTypes,
        string[] memory uris
    ) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length == projectNames.length, "Project data mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
            
            creditMetadata[totalCreditsIssued + i] = CreditMetadata({
                projectName: projectNames[i],
                projectLocation: projectLocations[i],
                vintageYear: vintageYears[i],
                methodology: methodologies[i],
                verificationBody: verificationBodies[i],
                projectType: projectTypes[i],
                uri: uris[i],
                issuanceDate: block.timestamp,
                issuer: msg.sender
            });
        }
        
        totalCreditsIssued += recipients.length;
        
        emit CreditsIssued(
            msg.sender,
            recipients,
            amounts,
            projectNames[0],
            block.timestamp
        );
    }

    function listCredits(
        uint256 amount,
        uint256 pricePerCredit
    ) external returns (uint256) {
        require(balanceOf(msg.sender) >= amount, "Insufficient credits");
        require(pricePerCredit > 0, "Price must be greater than 0");
        
        _transfer(msg.sender, address(this), amount);
        
        uint256 listingId = listingCounter;
        listings[listingId] = Listing({
            seller: msg.sender,
            amount: amount,
            pricePerCredit: pricePerCredit,
            active: true,
            listingDate: block.timestamp
        });
        
        userListings[msg.sender].push(listingId);
        listingCounter++;
        
        emit CreditsListed(
            listingId,
            msg.sender,
            amount,
            pricePerCredit,
            block.timestamp
        );
        
        return listingId;
    }

    function purchaseCredits(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender != listing.seller, "Cannot purchase own listing");
        
        uint256 totalPrice = listing.amount * listing.pricePerCredit;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        _transfer(address(this), msg.sender, listing.amount);
        payable(listing.seller).transfer(totalPrice);
        
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        listing.active = false;
        totalTransactions++;
        
        emit CreditsPurchased(
            listingId,
            msg.sender,
            listing.seller,
            listing.amount,
            totalPrice,
            block.timestamp
        );
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not the seller");
        
        _transfer(address(this), msg.sender, listing.amount);
        listing.active = false;
        
        emit ListingCancelled(listingId, msg.sender, block.timestamp);
    }

    function getUserListings(address user) external view returns (uint256[] memory) {
        return userListings[user];
    }

    function getActiveListings() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i < listingCounter; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }
        
        uint256[] memory activeListings = new uint256[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i < listingCounter; i++) {
            if (listings[i].active) {
                activeListings[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return activeListings;
    }

    function getPlatformStats() external view returns (
        uint256 totalSupply,
        uint256 creditsIssued,
        uint256 transactions,
        uint256 activeListingsCount
    ) {
        totalSupply = totalSupply();
        creditsIssued = totalCreditsIssued;
        transactions = totalTransactions;
        
        for (uint256 i = 1; i < listingCounter; i++) {
            if (listings[i].active) {
                activeListingsCount++;
            }
        }
    }
}