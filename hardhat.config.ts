import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/ZTXANrAN2uV6OeDKOhRfZNahE3dcEcfP",
      accounts: [`0x${"2fb76d17350947ea1a658742b5b5113cdc34b897f89f53f47160da3bd8d4d88c"}`]
    }
  }

};

export default config;
