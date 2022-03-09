import { useEffect, useState } from 'react';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { network } from '../constants';
import { getVessels } from '../apis/get-vessels';
import AddVessel from './AddVessel';

const wallets = [
    getPhantomWallet()
]

const HomePage = () => {
    const [ vesselData, setVesselData ] = useState([]);
    const wallet = useWallet();

    useEffect(() => {
        const loadVessel = async () => {
            const vessel = await getVessels(wallet);
            setVesselData(vessel);
        }
        loadVessel();
    }, [wallet]);

    const refresh = (val) => {
        if(val === "refresh") {
            const loadVessel = async () => {
                const vessel = await getVessels(wallet);
                setVesselData(vessel);
            }
            loadVessel();
        }
    }

    const renderVessels = () => {
        if(vesselData.length !== 0) {
            return (
                <div className="scrollable-table">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                              <th scope="col">Vessel Name</th>
                              <th scope="col">IMO Number</th>
                              <th scope="col">Vessel Description</th>
                              <th scope="col">Ship Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vesselData.map((vessel, idx) => {
                                return (
                                    <tr key={idx}>
                                        <th>{vessel.vessel_name}</th>
                                        <th>{vessel.imo_number}</th>
                                        <th>{vessel.vessel_description}</th>
                                        <th>{vessel.ship_company}</th>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
    
    if(!wallet.connected) {
        return (
            <div className="main-center-container">
                <div>
                    Connect your wallet to start adding vessels
                </div>
                <div className="wallet-container">
                    <WalletMultiButton />
                </div>
            </div>
        );
    } else {
        return (
            <div className="main-center-container-sm my-5">
                <div className="inline-row">
                    <button 
                        className="actium-main-button" 
                        data-toggle="modal" 
                        data-target="#storeVesselModal">Add Vessels</button>
                    <div className="ml-2">
                        <WalletMultiButton />
                    </div>
                </div>
                <AddVessel wallet={wallet} refresh={refresh} />
                <div className="my-3">
                    {renderVessels()}
                </div>
            </div>
        );
    }
}

const ConnectedHomePage = () => {
    return (
        <ConnectionProvider endpoint={network.local}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <HomePage />        
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>   
    );
}

export default ConnectedHomePage;