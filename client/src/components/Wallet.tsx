import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent, Grid, TextField, Alert, Box } from "@mui/material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
interface WalletData {
  privateKey: string;
  publicKey: string;
  address: string;
}

interface WalletListItem {
  address: string;
  publicKey: string;
  balance: number;
}

interface WalletProps {
  setWallet: (wallet: WalletData | null) => void;
  setAddress: (address: string) => void;
}

const Wallet: React.FC<WalletProps> = ({ setWallet, setAddress }) => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [importPrivateKey, setImportPrivateKey] = useState<string>("");
  const [walletList, setWalletList] = useState<WalletListItem[]>([]);
  const [showWalletList, setShowWalletList] = useState<boolean>(false);

  // 创建新钱包
  const createWallet = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/new`);
      const newWallet = response.data;
      setWalletData(newWallet);
      setWallet(newWallet);
      setAddress(newWallet.address);
      await getBalance(newWallet.address);
    } catch (err: any) {
      setError("创建钱包失败: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 导入钱包（通过私钥）
  const importWallet = async () => {
    if (!importPrivateKey.trim()) {
      setError("请输入私钥");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(`${API_BASE_URL}/wallet/import`, {
        privateKey: importPrivateKey
      });
      
      const importedWallet = response.data;
      const wallet: WalletData = {
        privateKey: importedWallet.privateKey,
        publicKey: importedWallet.publicKey,
        address: importedWallet.address
      };
      
      setWalletData(wallet);
      setWallet(wallet);
      setAddress(wallet.address);
      setBalance(importedWallet.balance || 0);
      setImportPrivateKey(""); // 清空输入框
    } catch (err: any) {
      setError("导入钱包失败: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 获取余额
  const getBalance = async (address: string) => {
    if (!address) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/balance/${address}`);
      setBalance(response.data.balance);
    } catch (err: any) {
      console.error("获取余额失败:", err);
    }
  };

  // 刷新余额
  const refreshBalance = () => {
    if (walletData?.address) {
      getBalance(walletData.address);
    }
  };

  // 获取所有钱包列表
  const getAllWallets = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.get(`${API_BASE_URL}/wallets`);
      setWalletList(response.data);
      setShowWalletList(true);
    } catch (err: any) {
      setError("获取钱包列表失败: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 当钱包地址改变时自动获取余额
  useEffect(() => {
    if (walletData?.address) {
      getBalance(walletData.address);
    }
  }, [walletData?.address]);

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!walletData ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={createWallet}
                disabled={loading}
                fullWidth
              >
                {loading ? "创建中..." : "创建新钱包"}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                或导入现有钱包
              </Typography>
              <TextField
                fullWidth
                label="私钥"
                type="password"
                value={importPrivateKey}
                onChange={(e) => setImportPrivateKey(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                onClick={importWallet}
                disabled={loading}
                fullWidth
              >
                {loading ? "导入中..." : "导入钱包"}
              </Button>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">钱包信息</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="地址"
                value={walletData.address}
                InputProps={{ readOnly: true }}
                sx={{ mb: 1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="私钥"
                type="password"
                value={walletData.privateKey}
                InputProps={{ readOnly: true }}
                sx={{ mb: 1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6">
                  余额: {balance} 币
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={refreshBalance}
                >
                  刷新
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      <Grid item xs={12} sx={{ mt: 2 }}>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={getAllWallets}
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? "加载中..." : "查看所有钱包"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setWalletData(null);
                setWallet(null);
                setAddress("");
                setBalance(0);
                setImportPrivateKey("");
                setError("");
                setShowWalletList(false);
                setWalletList([]);
              }}
              sx={{ flex: 1 }}
            >
              清除钱包
            </Button>
          </Box>
        </Grid>
        {/* 钱包列表显示 */}
        {showWalletList && walletList.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">所有钱包列表</Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowWalletList(false)}
              >
                隐藏列表
              </Button>
            </Box>
            
            {walletList.map((wallet, index) => (
              <Card key={wallet.address} variant="outlined" sx={{ mb: 1, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      地址:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                      {wallet.address}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      公钥:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                      {wallet.publicKey.substring(0, 20)}...
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="textSecondary">
                      余额:
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {wallet.balance} 币
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Wallet;