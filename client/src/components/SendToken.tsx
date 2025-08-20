import React, { useState } from "react";
import { Typography, Button, Card, CardContent, Grid, TextField, Alert } from "@mui/material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log('API_BASE_URL', process.env.REACT_APP_API_BASE_URL);

interface WalletData {
  privateKey: string;
  publicKey: string;
  address: string;
}

interface SendTokenProps {
  wallet: WalletData | null;
  address: string;
}

const SendToken: React.FC<SendTokenProps> = ({ wallet, address }) => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const sendTokens = async () => {
    if (!wallet || !recipient || !amount) {
      setError("请填写所有必需字段");
      return;
    }

    if (!address) {
      setError("钱包地址不能为空");
      return;
    }

      if (recipient === wallet.address) {
          setError("不能向自己的地址转账");
          return;
      }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_BASE_URL}/transaction`, {
        fromAddress: address,
        toAddress: recipient,
        amount: parseFloat(amount),
        privateKey: wallet.privateKey
      });

      setSuccess(`转账成功！交易哈希: ${response.data.transactionHash || '已提交'}`);
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      setError("转账失败: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {!wallet ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            请先创建或导入钱包
          </Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="发送地址"
                value={address}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="接收地址"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="输入接收方地址"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="金额"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="输入转账金额"
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                onClick={sendTokens} 
                disabled={!wallet || loading}
                fullWidth
              >
                {loading ? "发送中..." : "发送代币"}
              </Button>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default SendToken;
