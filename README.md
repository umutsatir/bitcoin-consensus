# Bitcoin Consensus Implementation

This project is a simplified implementation of Bitcoin's consensus mechanism using TypeScript. It simulates Proof of Work (PoW) algorithm, blockchain structure, and mining processes.

## 🚀 Features

-   **Blockchain Structure**: Linked block chain implementation
-   **Proof of Work**: SHA-256 based mining algorithm
-   **Multi-Miner Support**: Parallel mining simulation
-   **Race Condition Protection**: Thread-safe mining implementation
-   **Dynamic Difficulty**: Adjustable mining difficulty
-   **Reward System**: Mining reward system with halving mechanism

## 📁 Project Structure

```
src/
├── block.ts       # Block class and structure
├── blockchain.ts  # Blockchain logic and validation
├── crypto.ts      # SHA-256 hash functions
├── miner.ts       # Mining algorithm and miner class
├── index.ts       # Main execution file
└── worker.ts      # Worker thread implementation
```

## 🛠️ Installation

### Requirements

-   Node.js (v18 or higher)
-   npm or yarn

### Install Dependencies

```bash
npm install
```

### Compile TypeScript

```bash
npx tsc
```

### Run

```bash
node src/index.js
```

## 🔧 Usage

### Simple Mining Example

```typescript
import { Block } from "./block";
import { Blockchain } from "./blockchain";
import { Miner } from "./miner";

// Create blockchain (difficulty: 4)
const blockchain = new Blockchain(4);

// Create miner
const miner = new Miner("Alice");

// Create new block
const newBlock = new Block(
    "Transaction Data",
    blockchain.getLatestBlock().hash,
    blockchain.length() + 1
);

// Start mining process
const success = miner.mine(
    newBlock,
    blockchain.getLatestBlock().hash,
    blockchain
);

if (success) {
    console.log("Block added successfully!");
    console.log(`Miner balance: ${miner.currValue}`);
}
```

## 🏗️ Core Classes

### `Block`

```typescript
class Block {
    nonce: number; // Mining nonce value
    blockNumber: number; // Block sequence number
    data: string; // Block data
    hash: string; // Block hash
    fingerprint: string; // Previous block hash
}
```

### `Blockchain`

```typescript
class Blockchain {
    chain: Array<Block>; // Block chain
    difficulty: number; // Mining difficulty
    rewardPrice: number; // Mining reward

    addBlock(hash: string, newBlock: Block, miner: Miner): boolean;
    validateNewBlock(hash: string): boolean;
}
```

### `Miner`

```typescript
class Miner {
    name: string; // Miner name
    publicKey: string; // Public key
    privateKey: string; // Private key
    currValue: number; // Current balance

    mine(block: Block, previousHash: string, blockchain: Blockchain): boolean;
}
```

## ⚡ Mining Algorithm

The mining process follows these steps:

1. **Target Calculation**: Target value is determined based on difficulty
2. **Nonce Search**: Search for nonce from random starting point
3. **Hash Calculation**: `SHA-256(previousHash + nonce + timestamp + minerName)`
4. **Validation**: Check if hash < target
5. **Block Addition**: Attempt to add block to blockchain when valid hash is found

### Race Condition Protection

To prevent finding the same nonce in multi-threading environment:

```typescript
// Uniqueness ensured with timestamp and miner name
hash = hashString(previousHash + seed + timestamp + this.name);
```

## 🎯 Difficulty System

Difficulty determines how many leading zeros the hash must have:

-   **Difficulty 1**: `0xxxxxxx...` (1 zero)
-   **Difficulty 4**: `0000xxxx...` (4 zeros)
-   **Difficulty 6**: `000000xx...` (6 zeros)

Mining time increases exponentially as difficulty increases.

## 💰 Reward System

-   **10 coins** reward for each successful mining
-   **Halving** occurs every **100 blocks**
-   Only the first miner to find solution gets rewarded

## 🔄 Blockchain Validation

Each new block must pass these validations:

1. **Hash Validation**: Does hash comply with difficulty rules?
2. **Block Number**: Is it sequential? (`previous + 1`)
3. **Fingerprint**: Is previous block's hash correct?
4. **Uniqueness**: Has block already been added?

## 🐛 Known Limitations

-   **Simplified Merkle Tree**: No transaction tree like real Bitcoin
-   **Network Simulation**: No P2P network simulation
-   **UTXO Model**: No transaction input/output model
-   **Script System**: No Bitcoin script support

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is published under MIT license.

## 🔗 Resources

-   [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
-   [Proof of Work Explained](https://en.bitcoin.it/wiki/Proof_of_work)
-   [SHA-256 Algorithm](https://en.wikipedia.org/wiki/SHA-2)

---

**Note**: This project is for educational purposes and is not suitable for production use.
