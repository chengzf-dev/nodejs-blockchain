const cryptoJs = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // 使用与比特币相同的椭圆曲线

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
        this.signature = null;
    }

     calculateHash () {
        return cryptoJs.SHA256(
        this.fromAddress +
        this.toAddress +
        this.amount +
        this.timestamp
        ).toString();
    }

    isValid() {
        if (this.fromAddress === null) return true; // 挖矿奖励交易
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }

    signTransaction(signingKey) {
      if (signingKey.getPublic('hex') !== this.fromAddress) {
        throw new Error('You cannot sign transactions for other wallets!');
      }
      const hashTx = this.calculateHash();
      const sig = signingKey.sign(hashTx, 'base64');
      this.signature = sig.toDER('hex');
  }
}

module.exports = Transaction;