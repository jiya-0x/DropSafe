const networkConfig = {
  31337: {
    name: "localhost",
    ethPriceFeed: "0x0000000000000000000000000000000000000000",
  },
  17000: {
    name: "holesky",
    ethPriceFeed: "0xF0d50568e3A7e8259E16663972b11910F89BD8e7",
  },
  11155111: {
    name: "sepolia",
    ethPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
  80002: {
    name: "amoy",
    ethPriceFeed: "0xF0d50568e3A7e8259E16663972b11910F89BD8e7",
  },
};

const developmentChains = ["hardhat", "localhost"];

const decimals = 8;
const initialAnswer = 180100000000;

module.exports = {
  networkConfig,
  developmentChains,
  decimals,
  initialAnswer,
};
