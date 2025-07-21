import { hashString } from "./crypto";
import { Block } from "./block";
import { Blockchain } from "./blockchain";
import * as os from "os";
import { Worker } from "worker_threads";

export default class Miner {
    publicKey: string;
    privateKey: string;
    name: string;
    currValue: number;

    constructor(newName: string) {
        this.name = newName;
        const randomUID = crypto.randomUUID();
        this.privateKey = hashString(this.name + randomUID);
        this.publicKey = hashString(this.name + this.privateKey);
        this.currValue = 0;
    }

    receive(amount: number): void {
        this.currValue += amount;
    }

    send(receiver: Miner, value: number): boolean {
        if (this.currValue < value) return false;
        receiver.receive(value);
        this.currValue -= value;
        return true;
    }

    mine(
        newBlock: Block,
        previousBlockHash: string,
        blockchain: Blockchain
    ): boolean {
        const target: BigInt = BigInt(
            "0x" +
                "0".repeat(blockchain.difficulty) +
                "f".repeat(64 - blockchain.difficulty)
        );
        var hash: string = hashString(previousBlockHash + "0");
        var hashToInteger: BigInt = BigInt("0x" + hash);
        var seed: number = 0;
        while (hashToInteger >= target) {
            hash = hashString(
                previousBlockHash +
                    newBlock.data +
                    Date.now().toString() +
                    seed.toString()
            );
            hashToInteger = BigInt("0x" + hash);
            console.log(
                `Miner: ${this.name}, Hash first 10 char: ${hash.slice(
                    0,
                    10
                )}, Seed: ${seed}, Hash to Integer: ${hashToInteger}, Target: ${target}`
            );
            seed++;
        }

        newBlock.hash = hash; // Update the block's hash with the found nonce

        console.log(`Miner ${this.name} found the nonce! Seed: ${seed - 1}`);

        newBlock.updateNonce(seed - 1);

        const success = blockchain.addBlock(newBlock, this);
        if (!success) {
            console.log(
                `Miner ${this.name} couldn't add a block - another miner might have added it first`
            );
        }
        return success;
    }

    mineWithWorker(
        newBlock: Block,
        previousBlockHash: string,
        blockchain: Blockchain
    ): void {
        // const threadCount = os.cpus().length;
        const threadCount = 4;
        for (let i = 0; i < threadCount; i++) {
            const worker = new Worker("./src/worker.js", {
                workerData: {
                    newBlock,
                    previousBlockHash,
                    blockchain,
                },
            });

            worker.on("message", (message) => {
                newBlock.nonce = message.nonce;
                newBlock.hash = message.hash;
                blockchain.addBlock(newBlock, this);
                console.log(
                    `Miner ${this.name} found the nonce with worker! Nonce: ${message.nonce}, Hash: ${message.hash}`
                );
                process.exit(0);
            });

            worker.on("error", (error) => {
                console.error(`Worker error: ${error}`);
            });
            worker.on("exit", (code) => {
                if (code !== 0)
                    console.log(`⚠️ Worker exited with code ${code}`);
            });
        }
    }
}

export { Miner };
