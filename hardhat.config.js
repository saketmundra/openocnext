require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const fs=require("fs");
const privateKey=fs.readFileSync(".secret").toString();

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // Infura
      url: `https://polygon-mumbai.infura.io/v3/9bfe9e49134e463fabd6716463cf552f`,
      accounts:[privateKey]
    },
    matic: {
      // Infura
      url: `https://polygon-mainnet.infura.io/v3/9bfe9e49134e463fabd6716463cf552f`,
      accounts:[privateKey]

    }
  },
  solidity: "0.8.17",
};
