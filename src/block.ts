import { hashString } from "./crypto";

class Block {
    public blockNumber: number;
    public nonce: number;
    public data: string;
    public hash: string;
    public fingerprint: string;

    constructor(
        newData: string,
        newFingerprint: string,
        currentBlockNumber: number
    ) {
        this.nonce = 0; // Mining sırasında bulunacak
        this.blockNumber = currentBlockNumber;
        this.data = newData;
        this.hash = hashString(this.data);
        this.fingerprint = newFingerprint;
    }

    // Mining işlemi tamamlandıktan sonra nonce'u güncellemek için
    updateNonce(newNonce: number): void {
        this.nonce = newNonce;
    }
}

export { Block };
