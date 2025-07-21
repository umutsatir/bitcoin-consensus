import { Block } from "./block";
import { Miner } from "./miner";

var currentBlockNumber: number = 0;

class Blockchain {
    chain: Array<Block>;
    difficulty: number;
    rewardPrice: number;

    constructor(newDiff: number) {
        this.chain = Array(this.createGenesisBlock());
        this.difficulty = newDiff;
        this.rewardPrice = 10;
    }

    createGenesisBlock(): Block {
        return new Block(
            "Genesis Block",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            currentBlockNumber + 1
        );
    }

    addBlock(newBlock: Block, miner: Miner): boolean {
        try {
            if (!this.validateNewBlock(newBlock.hash))
                throw new Error("Invalid seed");
            if (this.getLatestBlock().blockNumber + 1 !== newBlock.blockNumber)
                throw new Error(
                    "New block's blockNumber must be one greater than the latest block's blockNumber"
                );
            newBlock.fingerprint = this.getLatestBlock().hash;
            this.chain.push(newBlock);
            this.reward(miner);
            this.halving();

            console.log(
                `Block successfully added! Miner: ${miner.name}, Block #${newBlock.blockNumber}, Nonce: ${newBlock.nonce}`
            );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    validateNewBlock(hash: string): boolean {
        const hashWithoutPrefix = hash.startsWith("0x") ? hash.slice(2) : hash;
        if (hashWithoutPrefix.startsWith("0".repeat(this.difficulty)))
            return true;
        else return false;
    }

    reward(miner: Miner): void {
        miner.receive(this.rewardPrice);
    }

    halving(): void {
        if (this.length() % 100 == 0) this.rewardPrice = this.rewardPrice / 2;
    }

    getLatestBlock(): Block {
        return this.chain[this.length() - 1];
    }

    length(): number {
        return this.chain.length;
    }
}

export { Blockchain };
