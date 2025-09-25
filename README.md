# DropSafe

A smart contract for secure ETH funding with a live USD price threshold.

## ✨ Features

- Accepts ETH funding with a minimum value of 50 USD.
- Real-time ETH/USD conversion using Chainlink price feeds.
- Only the contract owner can withdraw collected funds.
- Automatically handles direct ETH transfers via `receive` and `fallback`.
- Gas optimized using `constant`, `immutable`, and custom errors.

## 📜 Contract Overview

| Function     | Purpose                                                   |
| ------------ | --------------------------------------------------------- |
| `fund()`     | Accepts funding if the ETH sent is worth at least 50 USD. |
| `withdraw()` | Allows only the owner to withdraw all funds.              |
| `receive()`  | Calls `fund()` when ETH is sent without calldata.         |
| `fallback()` | Calls `fund()` when unknown calldata is sent.             |

## 🏗️ Deployment

### Requirements

- Solidity `^0.8.8`
- Chainlink AggregatorV3Interface (for price feeds)
- `PriceConverter` library (local import)
- Ethereum-compatible network (Sepolia Testnet)

### Constructor Parameters

- `address priceFeedAddress`: Chainlink ETH/USD price feed address on Sepolia.

#### 📈 Example Sepolia Price Feed

- ETH/USD Aggregator Address:  
  `0x694AA1769357215DE4FAC081bf1f309aDC325306`  
  ([Chainlink Docs](https://docs.chain.link/data-feeds/price-feeds/addresses#sepolia-ethereum-testnet))

```solidity
// Example deployment (using Hardhat or Foundry)
deploy("DropSafe", [0x694AA1769357215DE4FAC081bf1f309aDC325306]);
```

## ⚡ Usage

### Fund the Contract

```solidity
dropSafe.fund{value: msg.value}();
```

Or simply send ETH directly to the contract address.

- Minimum funding: **$50 USD worth of ETH** (based on live Chainlink price).

### Withdraw Funds

```solidity
dropSafe.withdraw();
```

- Only callable by the contract owner.

## 🧩 Price Feed Integration

DropSafe uses Chainlink's decentralized oracles to convert ETH to USD during each funding transaction, ensuring accurate minimum value enforcement.

Ensure your network supports Chainlink feeds.

## 🛡️ Security Considerations

- Owner-only withdrawal (protected by `onlyOwner` modifier).
- Uses `.transfer()` to prevent reentrancy risks.
- Consider optimizing for gas if many funders accumulate (for future upgrades).

## 📢 Future Enhancements

- Add funding and withdrawal events for better tracking.
- Add funding limit per address (optional).
- Migrate to pull-over-push withdrawal pattern if scaling.

## 📃 License

This project is licensed under the [MIT License](LICENSE).

## 👤 Author

- Name: Jiya Etsugaie
- Security Contact: jiya_0xdao@outlook.com
- GitHub: Jiya (https://github.com/jiya-0x)

---

# Example Directory Structure

```
DropSafe/
├── contracts/
│   ├── DropSafe.sol
│   └── PriceConverter.sol
├── README.md
├── LICENSE
└── ...
```
