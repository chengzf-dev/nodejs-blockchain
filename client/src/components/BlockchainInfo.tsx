import React, { useState, useEffect } from "react";
import { Typography, Card, CardContent, Grid, Button, Alert, TextField, Box } from "@mui/material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Block {
  index: number;
  timestamp: number;
  data: string;
  previousHash: string;
  hash: string;
  nonce: number;
}

interface BlockchainData {
  chain: Block[];
  length: number;
}

const BlockchainInfo: React.FC = () => {
  const [blockchainData, setBlockchainData] = useState<BlockchainData | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [blockIndex, setBlockIndex] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // 获取整个区块链信息
  const fetchBlockchainInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/blockchain`);
      setBlockchainData(response.data);
    } catch (err: any) {
      setError("获取区块链信息失败: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 获取特定区块信息
  const fetchBlockByIndex = async () => {
    if (!blockIndex.trim()) {
      setError("请输入区块索引");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_BASE_URL}/block/${blockIndex}`);
      setSelectedBlock(response.data);
    } catch (err: any) {
      setError("获取区块信息失败: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时自动获取区块链信息
  useEffect(() => {
    fetchBlockchainInfo();
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", mt: 2 }}>
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* 区块链概览 */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  区块链概览
                </Typography>
                {blockchainData ? (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        区块链长度:
                      </Typography>
                      <Typography variant="h6">
                        {blockchainData.chain.length} 个区块
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        最新区块hash:
                      </Typography>
                      <Typography variant="h6" sx={{ wordBreak: "break-all", fontFamily: "monospace" }}>
                        {blockchainData.chain.length > 0 ? blockchainData.chain[blockchainData.chain.length - 1].hash : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={fetchBlockchainInfo}
                        disabled={loading}
                      >
                        {loading ? "刷新中..." : "刷新区块链信息"}
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography>加载中...</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* 查询特定区块 */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  查询特定区块
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                  <TextField
                    label="区块索引"
                    value={blockIndex}
                    onChange={(e) => setBlockIndex(e.target.value)}
                    type="number"
                    size="small"
                  />
                  <Button
                    variant="outlined"
                    onClick={fetchBlockByIndex}
                    disabled={loading}
                  >
                    查询区块
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 选中的区块详情 */}
          {selectedBlock && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    区块详情 (索引: {selectedBlock.index})
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        时间戳:
                      </Typography>
                      <Typography variant="body1">
                        {formatTimestamp(selectedBlock.timestamp)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        随机数 (Nonce):
                      </Typography>
                      <Typography variant="body1">
                        {selectedBlock.nonce}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        数据:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                        {selectedBlock.data}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        前一个区块哈希:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "0.875rem" }}>
                        {selectedBlock.previousHash}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        当前区块哈希:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: "break-all", fontFamily: "monospace", fontSize: "0.875rem" }}>
                        {selectedBlock.hash}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* 区块链列表 */}
          {blockchainData && blockchainData.chain.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    区块链列表 (最近 5 个区块)
                  </Typography>
                  {blockchainData.chain.slice(-5).reverse().map((block) => (
                    <Card key={block.index} variant="outlined" sx={{ mb: 1, p: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2">
                            区块 #{block.index} - {formatTimestamp(block.timestamp)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            {block.hash.substring(0, 32)}...
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedBlock(block);
                            setBlockIndex(block.hash.toString());
                          }}
                        >
                          查看详情
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BlockchainInfo;
