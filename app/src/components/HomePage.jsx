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
    const [ dataLoaded, setDataLoaded ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const wallet = useWallet();

    const loadVessel = async () => {
        const vessel = await getVessels(wallet);
        setVesselData(vessel);
    }

    useEffect(() => {
        loadVessel();
        setDataLoaded(false);
    }, [wallet, dataLoaded]);

    const renderVessels = () => {
        if(vesselData.length !== 0) {
            return (
                <div className="scrollable-table">
                    <table className="table" style={{border: "none"}}>
                        <thead>
                            <tr>
                              <th className="table-heading" scope="col">Vessel Name</th>
                              <th className="table-heading" scope="col">IMO Number</th>
                              <th className="table-heading" scope="col">Vessel Description</th>
                              <th className="table-heading" scope="col">Ship Company</th>
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
    return (
        <div className={`${isModalOpen && "primary-container"} main-center-container-sm`}>
            <div className="inline-row mt-4">
                {(!wallet.connected) ? (
                    <div className="error-msg" >
                        Connect to Add Vessels
                    </div>
                ) : 
                    <button 
                        className="actium-main-button" 
                        onClick={() => setIsModalOpen(true)}>
                            Add Vessels
                    </button>
                }
                <div className="ml-2">
                    <WalletMultiButton />
                </div>
            </div>
            {isModalOpen && 
                <AddVessel 
                    wallet={wallet} 
                    dataLoading={loaded => setDataLoaded(loaded)}
                    closeModal={setIsModalOpen}
                />
            }
            <div className="my-3">
                {renderVessels()}
            </div>
        </div>
    );
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