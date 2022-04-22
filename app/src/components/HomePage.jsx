import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getVessels } from '../apis/get-vessels';
import AddVessel from './AddVessel';

const HomePage = ({ wallet }) => {
    const navigate = useNavigate();
    
    const [ vesselData, setVesselData ] = useState([]);
    const [ dataLoaded, setDataLoaded ] = useState(false);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ searchParams ] = useSearchParams();

    const loadVessel = async () => {
        const vessel = await getVessels(wallet);
        setVesselData(vessel);
    }

    useEffect(() => {
        loadVessel();
        setDataLoaded(false);
    }, [wallet, dataLoaded]);

    const userKey = searchParams.get('user_key')
    const userType = searchParams.get('usertype');
  
    const renderOptionalButtons = () => {
        if(userKey === null) {
            return (
                <div className="inline-row mt-4">
                    <button 
                        className="actium-main-button" 
                        onClick={() => navigate('/')}>
                            Back
                    </button>
                </div>
            );
        } else {
            return (
                <div className="inline-row mt-4">
                    <button 
                        className="actium-main-button" 
                        onClick={() => navigate('/')}>
                            Sign Out
                    </button>
                    <button 
                        className="actium-main-button ml-2" 
                        onClick={() => navigate(`/account?user_key=${userKey}`)}>
                            My Account
                    </button>
                    {(userType === "maintenance_admin") && (
                        <button 
                            className="actium-main-button ml-2" 
                            onClick={() => setIsModalOpen(true)}>
                                Add Vessels
                        </button>
                    )}
                    <div className="ml-2">
                        <WalletMultiButton />
                    </div>
                </div>
            )
        }
    }

    const renderVessels = () => {
        if(vesselData.length !== 0) {
            return (
                <div className="scrollable-table">
                    <table className="table" style={{border: "none"}}>
                        <thead>
                            <tr>
                                <th className="table-heading" scope="col">No.</th>
                                <th className="table-heading" scope="col">Public Key</th>
                                <th className="table-heading" scope="col">Vessel Name</th>
                                <th className="table-heading" scope="col">Seaworthiness</th>
                                <th className="table-heading" scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vesselData.map((vessel, idx) => {
                                return (
                                    <tr key={idx}>
                                        <th>{idx+1}</th>
                                        <th>{vessel.key_sliced}</th>
                                        <th>{vessel.vessel_name}</th>
                                        <th>40%</th>
                                        <th className="pt-0">
                                            <button 
                                                className="actium-secondary-button ml-2 mt-3" 
                                                onClick={() => navigate(`/vessel?vessel_key=${vessel.key}&user_key=${userKey}`)}>
                                                View Details
                                            </button>
                                        </th>
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
            <div className="landing-text mt-3">Vessel Record</div>
            {renderOptionalButtons()}
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

export default HomePage;