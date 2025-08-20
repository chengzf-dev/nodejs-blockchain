const Block = require('./block');
const Transaction = require('./transaction');

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2;
        this.height = 1;
        this.pendingTransactions = [];
        this.miningReward = 100; // 挖矿奖励
    }
    createGenesisBlock() {
        return new Block(Date.now(), '', '0');
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        // 创建包含奖励交易的区块
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);
        const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty)
        this.chain.push(block);
        this.height++;
        this.pendingTransactions = [];
    }
    addTransaction(transaction) {
        // 验证交易有效性
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('The transaction must include addresses');
        }
        if (!transaction.isValid()) {
            throw new Error('illegal transaction');
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
        
        if (currentBlock.hash !== currentBlock.calculateHash()) {
            return false;
        }
        
        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
        }
        return true;
    }
   
}
module.exports = BlockChain;