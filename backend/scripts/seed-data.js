const { ethers } = require("hardhat");
const carbonCreditArtifact = require("../artifacts/contracts/CarbonCredit.sol/CarbonCredit.json");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Seeding data with account:", deployer.address);

  const contractAddresses = require("../src/contracts/contract-addresses.json");
  const carbonCredit = new ethers.Contract(
    contractAddresses.CarbonCredit,
    carbonCreditArtifact.abi,
    deployer
  );

  // Sample project data
  const recipients = [
    deployer.address,
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  ];
  
  const amounts = [
    ethers.utils.parseEther("100000"),
    ethers.utils.parseEther("50000"),
    ethers.utils.parseEther("75000")
  ];

  const projectNames = [
    "Amazon Rainforest Conservation",
    "Mangrove Restoration Project", 
    "Solar Farm Initiative"
  ];

  const projectLocations = [
    "Brazil, Amazon Basin",
    "Southeast Asia",
    "India, Rajasthan"
  ];

  const vintageYears = [2024, 2024, 2024];
  
  const methodologies = [
    "REDD+",
    "VM0033", 
    "ACM0002"
  ];

  const verificationBodies = [
    "Verra",
    "Gold Standard",
    "UNFCCC"
  ];

  const projectTypes = [
    "reforestation",
    "mangrove_restoration",
    "renewable_energy"
  ];

  const uris = [
    "https://example.com/amazon",
    "https://example.com/mangrove",
    "https://example.com/solar"
  ];

  console.log("Issuing bulk credits...");
  const tx = await carbonCredit.issueBulkCredits(
    recipients,
    amounts,
    projectNames,
    projectLocations,
    vintageYears,
    methodologies,
    verificationBodies,
    projectTypes,
    uris
  );

  await tx.wait();
  console.log("Sample data seeded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });