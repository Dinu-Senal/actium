import LoginPage from "./LoginPage";
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from '../constants';

const wallets = [
    getPhantomWallet()
]

const LandingPage = () => {
    const wallet = useWallet();

    return (
        <div className="landing-content mt-5">
            {(!wallet.connected) ? (
                <>
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
                </>
            ) : 
                <>
                    <LoginPage wallet={wallet}/>
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
                    <LandingPage />        
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>   
    )
}

export default ConnectedLandingPage;