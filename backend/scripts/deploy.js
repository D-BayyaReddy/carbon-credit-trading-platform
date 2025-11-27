const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy CarbonCredit contract
  const CarbonCredit = await ethers.getContractFactory("CarbonCredit");
  const carbonCredit = await CarbonCredit.deploy();
  await carbonCredit.deployed();
  console.log("CarbonCredit deployed to:", carbonCredit.address);

  // Deploy CarbonMarket contract
  const CarbonMarket = await ethers.getContractFactory("CarbonMarket");
  const carbonMarket = await CarbonMarket.deploy(carbonCredit.address);
  await carbonMarket.deployed();
  console.log("CarbonMarket deployed to:", carbonMarket.address);

  // Deploy VerificationRegistry contract
  const VerificationRegistry = await ethers.getContractFactory("VerificationRegistry");
  const verificationRegistry = await VerificationRegistry.deploy();
  await verificationRegistry.deployed();
  console.log("VerificationRegistry deployed to:", verificationRegistry.address);

  // Save contract addresses
  const contractsDir = path.join(__dirname, "..", "src", "contracts");
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  const contractAddresses = {
    CarbonCredit: carbonCredit.address,
    CarbonMarket: carbonMarket.address,
    VerificationRegistry: verificationRegistry.address,
    network: "localhost"
  };

  fs.writeFileSync(
    path.join(contractsDir, "contract-addresses.json"),
    JSON.stringify(contractAddresses, null, 2)
  );

  // Save ABIs
  const carbonCreditArtifact = artifacts.readArtifactSync("CarbonCredit");
  const carbonMarketArtifact = artifacts.readArtifactSync("CarbonMarket");
  const verificationRegistryArtifact = artifacts.readArtifactSync("VerificationRegistry");

  fs.writeFileSync(
    path.join(contractsDir, "CarbonCredit.json"),
    JSON.stringify(carbonCreditArtifact, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "CarbonMarket.json"),
    JSON.stringify(carbonMarketArtifact, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "VerificationRegistry.json"),
    JSON.stringify(verificationRegistryArtifact, null, 2)
  );

  console.log("Contract artifacts saved successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });