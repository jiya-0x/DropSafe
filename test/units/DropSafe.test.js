const { deployments, ethers } = require("hardhat");
const { parseEther } = require("ethers");
const { assert, expect } = require("chai");

describe("DropSafe", () => {
  let DropSafe, deployer, deployerAddress, mockV3Aggregator;

  beforeEach(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    deployerAddress = await deployer.getAddress();

    await deployments.fixture(["all"]);
    DropSafe = await ethers.getContract("DropSafe", deployer);
    mockV3Aggregator = await deployments.get("MockV3Aggregator");
  });

  describe("constructor", () => {
    it("sets the aggregator address correctly", async () => {
      const response = await DropSafe.priceFeed();
      assert.equal(response, mockV3Aggregator.address);
    });
  });

  describe("fund", () => {
    it("reverts if not enough ETH is sent", async () => {
      await expect(DropSafe.fund({ value: 0 })).to.be.revertedWithCustomError(
        DropSafe,
        "DropSafe_notEnoughFund"
      );
    });

    it("funds successfully with at least 50 USD", async () => {
      const sendValue = parseEther("1");
      await expect(DropSafe.fund({ value: sendValue })).to.not.be.reverted;
    });
  });
  //receive
  describe("receive", () => {
    it("can fund using receive function", async () => {
      const sendValue = parseEther("1");
      const tx = await deployer.sendTransaction({
        to: DropSafe.target,
        value: sendValue,
      });
      await tx.wait();

      const funded = await DropSafe.addressToAmountFunded(deployerAddress);
      assert.equal(funded.toString(), sendValue.toString());
    });
  });
  // fallback
  describe("fallback", () => {
    it("can fund using fallback function", async () => {
      const sendValue = parseEther("1");

      const tx = await deployer.sendTransaction({
        to: DropSafe.target,
        data: "0x12345678", // fallback trigger
        value: sendValue,
      });
      await tx.wait();

      const funded = await DropSafe.addressToAmountFunded(deployerAddress);
      assert.equal(funded.toString(), sendValue.toString());
    });
  });

  describe("withdraw", () => {
    it("resets funder mapping after withdraw", async () => {
      const sendValue = parseEther("1");
      await DropSafe.fund({ value: sendValue });

      await DropSafe.withdraw();

      const amountAfter = await DropSafe.addressToAmountFunded(deployerAddress);
      assert.equal(amountAfter.toString(), "0");
    });

    it("only allows the owner to withdraw", async () => {
      const [, attacker] = await ethers.getSigners();
      const attackerDropSafe = DropSafe.connect(attacker);

      await expect(attackerDropSafe.withdraw()).to.be.revertedWithCustomError(
        DropSafe,
        "DropSafe_notOwner"
      );
    });

    it("withdraws funds and resets funders", async () => {
      const sendValue = parseEther("50");

      await DropSafe.fund({ value: sendValue });

      const beforeBalance = await ethers.provider.getBalance(DropSafe.target);
      assert.equal(beforeBalance.toString(), sendValue.toString());

      await DropSafe.withdraw();

      const afterBalance = await ethers.provider.getBalance(DropSafe.target);
      assert.equal(afterBalance.toString(), "0");

      const funded = await DropSafe.addressToAmountFunded(deployerAddress);
      assert.equal(funded.toString(), "0");
    });
  });
});
