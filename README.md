# NodeJs Blockchain

一个基于 Node.js 和 React 的简单区块链应用，实现了基本的区块链功能包括钱包管理、交易处理、挖矿和区块链浏览。

## 项目结构

```
simple-blockchain/
├── src/                    # 后端核心代码
│   └── core/
│       ├── block.js        # 区块类
│       ├── blockchain.js   # 区块链类
│       ├── transaction.js  # 交易类
│       └── wallet.js       # 钱包类
├── client/                 # 前端 React 应用
│   ├── public/
│   └── src/
│       ├── components/     # React 组件
│       │   ├── Wallet.tsx          # 钱包管理组件
│       │   ├── SendToken.tsx       # 转账组件
│       │   ├── Mining.tsx          # 挖矿组件
│       │   └── BlockchainInfo.tsx  # 区块链信息组件
│       └── App.tsx         # 主应用组件
├── index.js                # 后端服务器入口
└── package.json            # 后端依赖配置
```

## 功能特性

### 核心功能
- ✅ **区块链核心**: 基于工作量证明(PoW)的区块链实现
- ✅ **钱包管理**: 创建新钱包、导入钱包、查看余额
- ✅ **交易处理**: 创建和验证数字签名交易
- ✅ **挖矿系统**: 工作量证明挖矿机制
- ✅ **区块浏览**: 查看区块链和特定区块信息

### 前端界面
- 🎨 **现代化UI**: 基于 Material-UI 的响应式界面
- 📱 **标签页导航**: 钱包、转账、挖矿、区块链信息四个主要功能模块
- 🔄 **实时更新**: 自动刷新余额和区块链状态
- 📊 **数据可视化**: 清晰展示钱包信息和区块链数据

## 技术栈

### 后端
- **Node.js**: 服务器运行环境
- **Express.js**: Web 框架
- **crypto-js**: 加密哈希函数
- **elliptic**: 椭圆曲线数字签名

### 前端
- **React 19**: 用户界面框架
- **TypeScript**: 类型安全的 JavaScript
- **Material-UI**: UI 组件库
- **Axios**: HTTP 客户端

## 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装和运行

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd nodejs-blockchain
   ```

2. **安装后端依赖**
   ```bash
   npm install
   ```

3. **安装前端依赖**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **启动后端服务器**
   ```bash
   npm start
   ```
   服务器将在 http://localhost:3001 启动

5. **启动前端应用**
   ```bash
   cd client
   npm start
   ```
   前端应用将在 http://localhost:3000 启动

## API 接口

### 钱包相关
- `POST /api/wallet/new` - 创建新钱包
- `POST /api/wallet/import` - 导入钱包
- `GET /api/wallets` - 获取所有钱包列表
- `GET /api/balance/:address` - 获取地址余额

### 交易相关
- `POST /api/transaction` - 创建新交易

### 挖矿相关
- `POST /api/mine` - 开始挖矿

### 区块链相关
- `GET /api/blockchain` - 获取完整区块链
- `GET /api/block/:index` - 获取特定区块

## 使用指南

### 1. 创建钱包
- 在"钱包"标签页点击"创建新钱包"
- 系统会生成私钥、公钥和地址
- 妥善保存私钥，用于导入钱包

### 2. 获取代币
- 在"挖矿"标签页输入钱包地址
- 点击"开始挖矿"获得挖矿奖励(100代币)

### 3. 转账交易
- 在"转账"标签页输入接收地址和金额
- 系统会自动使用当前钱包进行签名
- 交易会被添加到待处理交易池

### 4. 查看区块链
- 在"区块链信息"标签页查看完整区块链
- 可以查看每个区块的详细信息
- 包括交易记录、哈希值、时间戳等

## 核心概念

### 区块结构
```javascript
{
  timestamp: 时间戳,
  transactions: 交易列表,
  previousHash: 前一个区块哈希,
  hash: 当前区块哈希,
  nonce: 工作量证明随机数
}
```

### 交易结构
```javascript
{
  fromAddress: 发送方地址,
  toAddress: 接收方地址,
  amount: 交易金额,
  signature: 数字签名
}
```

### 钱包结构
```javascript
{
  privateKey: 私钥,
  publicKey: 公钥,
  address: 钱包地址
}
```

## 安全特性

- **数字签名**: 使用椭圆曲线数字签名算法(ECDSA)确保交易安全
- **哈希验证**: SHA-256 哈希算法保证区块完整性
- **工作量证明**: PoW 机制防止恶意篡改
- **交易验证**: 严格的交易有效性检查

## 开发说明

### 后端开发
- 主要逻辑在 `src/core/` 目录下
- 使用 Express.js 提供 RESTful API
- 支持 CORS 跨域请求

### 前端开发
- 基于 React + TypeScript
- 使用 Material-UI 组件库
- 响应式设计，支持移动端

## 注意事项

⚠️ **重要提醒**:
- 这是一个教育和演示项目，不适用于生产环境
- 私钥存储在内存中，重启服务器会丢失
- 没有实现持久化存储
- 挖矿难度较低，仅用于演示

## 许可证

MIT License

## 作者

chengzf

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

*这个项目旨在帮助理解区块链的基本概念和实现原理。*
