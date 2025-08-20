const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const Transaction = require('./transaction');

class Wallet {
 constructor() {
    this.keyPair = ec.genKeyPair();
    this.privateKey = this.keyPair.getPrivate('hex');
    this.publicKey = this.keyPair.getPublic('hex');
  }
  getAddress() {
    return this.publicKey;
  }
  
  getBalance(blockchain) {
    return blockchain.getBalanceOfAddress(this.publicKey);
  }

  createTransaction (payedAddress, amount, blockchain) {
    const balance = blockchain.getBalanceOfAddress(this.publicKey);
    if (amount > balance) {
      throw new Error('No enough balance, transaction failed');
    }
    const tx = new Transaction(this.publicKey, payedAddress, amount);
    tx.signTransaction(this.keyPair);
    blockchain.addTransaction(tx);
    return tx;
  }

 static loadFromPrivateKey(privateKey) {
    const wallet = new Wallet();
    wallet.keyPair = ec.keyFromPrivate(privateKey);
    wallet.privateKey = wallet.keyPair.getPrivate('hex');
    wallet.publicKey = wallet.keyPair.getPublic('hex');
    return wallet;
  }
}

module.exports = Wallet;