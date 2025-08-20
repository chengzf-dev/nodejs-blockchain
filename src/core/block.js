const crypo = require('crypto-js');

class Block {
    constructor(timestamp, transactions, previousHash) {
        this.timestamp = timestamp;
        this.transactions = transactions; //区块链交易信息
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //工作量证明
    }
    calculateHash() {
       return crypo.SHA256(this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce).toString();
    }

    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join('0');
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

module.exports = Block;