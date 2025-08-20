import React, { useState } from "react";
import { Typography, Button, Card, CardContent, Grid, Alert, Box, CircularProgress, TextField } from "@mui/material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface MiningResult {
  message: string;
  newBlock?: {
    index: number;
    timestamp: number;
    data: string;
    previousHash: string;
    hash: string;
    nonce: number;
  };
}

const Mining: React.FC = () => {
  const [mining, setMining] = useState<boolean>(false);
  const [result, setResult] = useState<MiningResult | null>(null);
  const [error, setError] = useState<string>("");
  const [minerAddress, setMinerAddress] = useState<string>("");

  const startMining = async () => {
    if (!minerAddress.trim()) {
      setError("请输入矿工地址");
      return;
    }

    setMining(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/mine`, {
        minerAddress: minerAddress.trim()
      });
      setResult(response.data);
    } catch (err: any) {
      setError("挖矿失败: " + (err.response?.data?.error || err.message));
    } finally {
      setMining(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          点击开始挖矿按钮来挖掘新的区块。挖矿过程可能需要一些时间，请耐心等待。
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {result.message}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="矿工地址"
              value={minerAddress}
              onChange={(e) => setMinerAddress(e.target.value)}
              placeholder="请输入矿工地址"
              disabled={mining}
              sx={{ mb: 2 }}
              helperText="挖矿奖励将发送到此地址"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={startMining}
                disabled={mining || !minerAddress.trim()}
                fullWidth
              >
                {mining ? "挖矿中..." : "开始挖矿"}
              </Button>
              {mining && <CircularProgress size={24} />}
            </Box>
          </Grid>

          {result?.newBlock && (
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    新挖掘的区块信息
                  </Typography>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        区块索引:
                      </Typography>
                      <Typography variant="body1">
                        {result.newBlock.index}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        时间戳:
                      </Typography>
                      <Typography variant="body1">
                        {formatTimestamp(result.newBlock.timestamp)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        数据:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                        {result.newBlock.data}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        前一个区块哈希:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "0.875rem" }}>
                        {result.newBlock.previousHash}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        当前区块哈希:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "0.875rem" }}>
                        {result.newBlock.hash}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        随机数 (Nonce):
                      </Typography>
                      <Typography variant="body1">
                        {result.newBlock.nonce}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Mining;