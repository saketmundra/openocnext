const { log } = require("console");
const hre = require("hardhat");

async function main() {
  const NFTMarket = await hre.ethers.getContractFactory("NFTmarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.deployed();
  console.log(
    `deployed to ${nftMarket.address}`
  );

  const NFT=await hre.ethers.getContractFactory("NFT");
  const nft=await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("deployed to"+ nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
