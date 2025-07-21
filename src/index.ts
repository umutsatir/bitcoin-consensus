import { Block } from "./block";
import { Blockchain } from "./blockchain";
import { Miner } from "./miner";
import * as os from "os";
import { Worker } from "worker_threads";

const blockchain = new Blockchain(3);
const miners: Miner[] = [];
const newBlockData: string[] = [];

for (let i = 0; i < 10; i++) {
    const miner = new Miner(`Miner ${i}`);
    miners.push(miner);
    newBlockData.push(`Block Data ${i}`);
}

function mineWithWorker(
    newBlockData: string,
    previousBlockHash: string,
    blockchain: Blockchain,
    miner: Miner
): void {
    const allWorkers: Worker[] = [];
    const threadCount = os.cpus().length;
    console.log(
        `Starting mining for ${newBlockData} with ${threadCount} threads...`
    );
    for (let i = 0; i < threadCount; i++) {
        const worker = new Worker("./src/worker.js", {
            workerData: {
                data: newBlockData,
                previousHash: previousBlockHash,
                difficulty: blockchain.difficulty,
            },
        });
        allWorkers.push(worker);

        let blockMined = false;

        worker.on("message", (message) => {
            // race condition check
            if (blockMined) return;
            blockMined = true;

            allWorkers.forEach((w) => w.terminate());

            // Create a new block with the mined data
            const newBlock = new Block(
                newBlockData,
                blockchain.getLatestBlock().hash,
                blockchain.chain.length + 1
            );
            newBlock.nonce = message.nonce;
            newBlock.hash = message.hash;
            blockchain.addBlock(newBlock, miners[i]);

            console.log(
                `✅ ${newBlock.data} mined by ${miners[i].name}: Nonce ${message.nonce}, Hash ${message.hash}`
            );
        });
    }
}

for (let i = 0; i < newBlockData.length; i++) {
    mineWithWorker(
        newBlockData[i],
        blockchain.getLatestBlock().hash,
        blockchain,
        miners[i]
    );
}

setTimeout(() => {
    console.log("\n⛓️ Current Blockchain:");
    console.dir(blockchain, { depth: null });
}, blockchain.difficulty * 2000); // Wait for mining to complete
