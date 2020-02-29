import SHA256 from "crypto-js/sha256";
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  calculateHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.amount + this.timestamp
    ).toString();
  }

  signTransaction(pk, sk) {
    const privKey = ec.keyFromPrivate(sk);
    if (pk !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }
    const hashTx = this.calculateHash();
    const sig = privKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

export default Transaction;
