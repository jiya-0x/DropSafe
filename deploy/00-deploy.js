const { network } = require("hardhat");
const { decimals, initialAnswer } = require("../helper-hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (chainId == 31337) {
    log("local network detected! depolying mock.....");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      args: [decimals, initialAnswer],
      log: true,
    });
    log("Mock deployed");
    log("-----------------------------------------------");
  }
};
module.exports.tags = ["all", "mocks"];
