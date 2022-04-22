import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from './constants';
import LoginPage from './components/LoginPage';
import VesselPage from './components/VesselPage';
import SupplyChain from './components/SupplyChain';
import MyAccountPage from './components/MyAccountPage';
require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
  getPhantomWallet()
]

function App() {
  const wallet = useWallet();
  return (
    <div className="App">
        {(!wallet.connected) ? (
            <div className="app-content mt-5">
                <div className="landing-text">Actium</div>
                <hr className="mt-0 mb-1" style={{ width: "50%", background: '#29707E' }} />
                <div className="inline-row mt-4">
                    <div className="error-msg" >
                        Connect to Login
                    </div>
                    <div className="ml-2">
                        <WalletMultiButton />
                    </div>
                </div>
            </div>
        ) : 
            <>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<LoginPage wallet={wallet}/>} />
                    <Route path="/home" element={<HomePage wallet={wallet}/>} />
                    <Route path="/register" element={<RegisterPage wallet={wallet}/>} />
                    <Route path="/vessel" element={<VesselPage wallet={wallet}/>} />
                    <Route path="/supplychain" element={<SupplyChain wallet={wallet}/>} />
                    <Route path="/account" element={<MyAccountPage wallet={wallet} />} />
                  </Routes>
                </BrowserRouter>
            </>
        }
    </div>
  );
}

const ConnectedLandingPage = () => {
  return(
      <ConnectionProvider endpoint={network.local}>
          <WalletProvider wallets={wallets}>
              <WalletModalProvider>
                  <App />        
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>   
  )
}


export default ConnectedLandingPage;