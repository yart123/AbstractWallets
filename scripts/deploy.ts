import { ethers } from "hardhat";

async function main() {
  // Deploy it
  const degen = await ethers.deployContract("DegenToken");
  await degen.waitForDeployment();

  // Display the contract address
  console.log(`Degen token deployed to ${await degen.getAddress()}`);
}

// Hardhat recommends this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
