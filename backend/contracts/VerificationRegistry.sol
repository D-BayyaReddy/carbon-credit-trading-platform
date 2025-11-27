// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VerificationRegistry is Ownable {
    struct Project {
        string name;
        string location;
        string methodology;
        string verificationBody;
        bool verified;
        uint256 verificationDate;
        address verifier;
    }
    
    mapping(string => Project) public projects;
    mapping(address => bool) public verifiers;
    
    event ProjectVerified(
        string indexed projectId,
        string name,
        address verifier,
        uint256 verificationDate
    );
    
    event VerifierAdded(address verifier);
    event VerifierRemoved(address verifier);
    
    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not authorized verifier");
        _;
    }
    
    function addVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = true;
        emit VerifierAdded(_verifier);
    }
    
    function removeVerifier(address _verifier) external onlyOwner {
        verifiers[_verifier] = false;
        emit VerifierRemoved(_verifier);
    }
    
    function verifyProject(
        string memory projectId,
        string memory name,
        string memory location,
        string memory methodology,
        string memory verificationBody
    ) external onlyVerifier {
        projects[projectId] = Project({
            name: name,
            location: location,
            methodology: methodology,
            verificationBody: verificationBody,
            verified: true,
            verificationDate: block.timestamp,
            verifier: msg.sender
        });
        
        emit ProjectVerified(projectId, name, msg.sender, block.timestamp);
    }
    
    function isProjectVerified(string memory projectId) external view returns (bool) {
        return projects[projectId].verified;
    }
    
    function getProject(string memory projectId) external view returns (Project memory) {
        return projects[projectId];
    }
}