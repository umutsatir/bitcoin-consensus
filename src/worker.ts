import { workerData, parentPort } from "worker_threads";
import { hashString } from "./crypto";

const { data, previousHash, difficulty } = workerData;
const targetPrefix = "0".repeat(difficulty);

var nonce = 0;

while (true) {
    const hash = hashString(
        previousHash + data + nonce + Date.now().toString()
    );
    if (hash.startsWith(targetPrefix)) {
        parentPort?.postMessage({ nonce, hash });
        break;
    }
    nonce++;
}
