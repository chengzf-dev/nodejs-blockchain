const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./src/core/blockchain');
const Transaction = require('./src/core/transaction');
const Wallet = require('./src/core/wallet');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // 静态文件目录

// 解决跨域问题
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 初始化区块链
const myCoin = new Blockchain();
const wallets = {}; // 存储钱包

// 创建新钱包
app.post('/api/wallet/new', (req, res) => {
  const wallet = new Wallet();
  const address = wallet.getAddress();
  wallets[address] = wallet;
  
  res.json({
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
    address: address,
  });
});

// 导入钱包
app.post('/api/wallet/import', (req, res) => {
  const { privateKey } = req.body;
  try {
    const wallet = Wallet.loadFromPrivateKey(privateKey);
    const address = wallet.getAddress();
    wallets[address] = wallet;
    
    res.json({
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      address: address,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取所有钱包
app.get('/api/wallets', (req, res) => {
  const walletsInfo = Object.entries(wallets).map(([address, wallet]) => ({
    address: address,
    publicKey: wallet.publicKey,
    balance: wallet.getBalance(myCoin),
  }));
  
  res.json(walletsInfo);
});


  // 获取余额
app.get('/api/balance/:address', (req, res) => {
  const balance = myCoin.getBalanceOfAddress(req.params.address);
  res.json({ balance });
});

// 创建交易
app.post('/api/transaction', (req, res) => {
  const { toAddress, amount, privateKey } = req.body;
  try {
    const wallet = Wallet.loadFromPrivateKey(privateKey);
    wallet.createTransaction(toAddress, amount, myCoin) 
    res.json({ message: 'Transaction added to pending transactions.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 开始挖矿
app.post('/api/mine', (req, res) => {
  const { minerAddress } = req.body;
  myCoin.minePendingTransactions(minerAddress);
  res.json({ 
    message: `Block mined successfully!`,
    newBlock: myCoin.getLatestBlock()
  });
});

// 获取区块链
app.get('/api/blockchain', (req, res) => {
  res.json(myCoin);
});

// 获取特定区块
app.get('/api/block/:index', (req, res) => {
  const blockIndex = parseInt(req.params.index);
  if (blockIndex < 0 || blockIndex >= myCoin.chain.length) {
    return res.status(404).json({ error: 'Block not found' });
  }
  res.json(myCoin.chain[blockIndex]);
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Blockchain server running on port ${PORT}`);
});