require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26",
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: process.env.API_URL,
      accounts: [process.env.METAMASK_ACCOUNT_PRIVATE_KEY],
    }
  }
};
