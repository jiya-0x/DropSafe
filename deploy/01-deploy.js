const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethusdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethusdaggregator = await get("MockV3Aggregator");
    ethusdPriceFeedAddress = ethusdaggregator.address;
  } else {
    ethusdPriceFeedAddress = networkConfig[chainId]["ethPriceFeed"];
  }

  const args = [ethusdPriceFeedAddress];

  const DropSafe = await deploy("DropSafe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && process.env.ETHSCAN) {
    await verify(DropSafe.address, args);
  }

  log("MockV3Aggregator deployed at:", (await get("MockV3Aggregator")).address);

  // console.log("Network name:", network.name);
  // console.log("Chain ID:", network.config.chainId);
  // console.log("networkConfig entry:", networkConfig[network.config.chainId]);
  log("-------------------------------------------------------");
};
module.exports.tags = ["all", "DropSafe"];
