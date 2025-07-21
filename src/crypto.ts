import sha256 from "crypto-js/sha256";

function hashString(input: string): string {
    return sha256(input).toString();
}

export { hashString };
