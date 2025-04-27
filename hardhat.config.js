require("@nomicfoundation/hardhat-toolbox");
require("hardhat-coverage");
require("dotenv").config();
require("hardhat-deploy-ethers");
require("hardhat-deploy");
// require("hardhat-gas-reporter");
// require("@nomiclabs/hardhat-etherscan");

const HOLESKEY_RPC_URL = process.env.HOLESKEY_RPC_URL;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHSCAN = process.env.ETHSCAN;
const CMC_API_KEY = process.env.CMC_API_KEY;
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    // holesky: {
    //   url: HOLESKEY_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 17000,
    // },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
  },
  etherscan: {
    apiKey: ETHSCAN,
  },
  namedAccounts: {
    deployer: {
      default: 0,
      17000: 1,
    },
  },
  solidity: {
    compilers: [{ version: "0.8.0" }, { version: "0.8.8" }],
  },
  sourcify: {
    enabled: true,
  },
  // gasReporter: {
  //   enabled: process.env.TRUE === "true",
  //   outputFile: "gasReporter.txt",
  //   coinmarketcap: CMC_API_KEY,
  //   gasPrice: 20,
  //   currency: "USD",
  //   noColors: true,
  // },
};
