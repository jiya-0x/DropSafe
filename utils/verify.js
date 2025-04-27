const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("🔍 Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("✅ Contract verified successfully!");
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("ℹ️ Already Verified!");
    } else {
      console.error("❌ Verification failed:", e);
    }
  }
};

module.exports = { verify };
