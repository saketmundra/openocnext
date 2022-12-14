const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTmarket", function () {
  it("should create and execute market place",async function(){
     const Market =await ethers.getContractFactory("NFTmarket")
     const market= await Market.deploy()
     await market.deployed();
     const marketaddress=market.address;

     const NFT =await ethers.getContractFactory("NFT");
     const nft= await NFT.deploy(marketaddress);
     await nft.deployed();
     const nftContractAddress=nft.address;

     let listingprice= await market.getListingPrice()
     listingprice=listingprice.toString();

     const auctionPrice=ethers.utils.parseUnits('100','ether');

     await nft.createToken("https://www.mytokenlocation.com")
     await nft.createToken("https://www.mytokenlocation2.com")

     await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingprice })
     await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingprice })

     const [_,buyerAddress]=await ethers.getSigners();

     await market.connect(buyerAddress).createMarketSale(nftContractAddress,1,{value:auctionPrice})

     let items = await market.fetchMarketItems()
     items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items) 







  })
});
