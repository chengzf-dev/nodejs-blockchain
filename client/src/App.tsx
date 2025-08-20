import React from 'react';
import './App.css';
import Wallet from './components/Wallet';
import SendToken from './components/SendToken';
import BlockchainInfo from './components/BlockchainInfo';
import Mining from './components/Mining';
import { Typography, Container, Box, Tabs, Tab } from '@mui/material';

interface WalletData {
  privateKey: string;
  publicKey: string;
  address: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ display: value === index ? 'block' : 'none' }}
      {...other}
    >
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </div>
  );
}

function App() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [address, setAddress] = React.useState<string>("");
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="App">
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            简单区块链
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            钱包管理 | 转账交易 | 挖矿 | 区块链浏览器
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="钱包管理" />
              <Tab label="发送代币" />
              <Tab label="挖矿" />
              <Tab label="区块链信息" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Wallet setWallet={setWallet} setAddress={setAddress} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <SendToken wallet={wallet} address={address} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Mining />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <BlockchainInfo />
          </TabPanel>

          {/* 钱包状态显示 */}
          {wallet && (
            <Box sx={{ position: 'fixed', bottom: 16, right: 16, bgcolor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 2 }}>
              <Typography variant="caption" color="text.secondary">
                当前钱包: {address.substring(0, 8)}...{address.substring(address.length - 8)}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default App;
