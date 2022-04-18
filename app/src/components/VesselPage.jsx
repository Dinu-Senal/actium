import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getVessels } from '../apis/get-vessels';
import { getUsers } from '../apis/get-users';
import { getVesselParts } from '../apis/get-vessel-parts';
import MaintenancePartStoreModal from './record components/MaintenancePartStoreModal';

const VesselPage = ({ wallet }) => {
    const navigate = useNavigate();

    const [ vesselData, setVesselData ] = useState([]);
    const [ userData, setUserData ] = useState([]);
    const [ vesselPartData, setVesselPartData ] = useState([]);

    const [ relevantVesselData, setReleventVesselData ] = useState({});
    const [ relevantUserData, setReleventUserData ] = useState({});

    const [ maintenancePartDataLoaded, setMaintenancePartDataLoaded ] = useState(false);
    const [ maintenancePartModalOpen, setMaintenancePartModalOpen ] = useState(false);
    
    const [ seaworthinessModalOpen, setSeaworthinessModalOpen ] = useState(false);

    const [ searchParams ] = useSearchParams();

    const vesselKey = searchParams.get('vessel_key');
    const userKey = searchParams.get('user_key');

    const loadVessel = async () => {
        const vessel = await getVessels(wallet);
        setVesselData(vessel);
    }
    const loadUser = async () => {
        const users = await getUsers(wallet);
        setUserData(users);
    }
    const loadVesselParts = async () => {
        const vesselsParts = await getVesselParts(wallet);
        setVesselPartData(vesselsParts);
    }

    useEffect(() => {
        loadVessel();
        loadUser();
    }, [wallet] );

    useEffect(() => {
        loadVesselParts();
        setMaintenancePartDataLoaded(false);
    }, [wallet, maintenancePartDataLoaded]);

    useEffect(() => {
        const retrieveRelevantVesselData= () => {
            vesselData.forEach(vessel => {
                if(vesselKey === vessel.key) {
                    setReleventVesselData({
                        author: vessel.author_key,
                        imo_number: vessel.imo_number
                    })
                }
            })
        }
        const retrieveRelevantUserData = () => {
            userData.forEach(user => {
                if(userKey === user.key) {
                    setReleventUserData({
                        user_author: user.author_key, 
                        user_designation: user.designation,
                        user_public_key: user.key,
                    })
                }
            })
        }
        retrieveRelevantVesselData();
        retrieveRelevantUserData();
    }, [vesselData, userData])

    const vesselDetails = () => {
        const vesselInfo = vesselData.map((vessel, idx) => {
            if(vesselKey === vessel.key) {
                return (
                    <div key={idx} className="main-box secondary-card shadow-sm p-3">
                        <div className="primary-text">
                            Vessel Info
                        </div>
                        <div className="subheading-text text-left px-5 mt-3">
                            <p><span className="bold-text text-uppercase mr-2">
                                Vessel Name: </span>{vessel.vessel_name}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                IMO Number: </span> {vessel.imo_number}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                Vessel Description: </span> {vessel.vessel_description}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                Ship Company: </span> {vessel.ship_company}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                Created At: </span> {vessel.created_at}
                            </p>
                        </div>
                    </div>
                );
            }
            return null
        });
        return vesselInfo;
    }

    const userDetails = () => {
        const userInfo = userData.map((user, idx) => {
            if(relevantVesselData?.author === user.author_key) {
                return (
                    <div key={idx} className="main-box ternary-card shadow-sm p-3 ml-3">
                        <div className="primary-text">
                            Author
                        </div>
                        <div className="subheading-text text-left px-5 mt-3">
                            <p><span className="bold-text text-uppercase mr-2">
                                Name: </span>{user.full_name}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                Designation: </span> {
                                (user.designation === "maintenance_admin") && "Maintenance Admin"}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                NIC Number: </span> {user.nic_number}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                Contact: </span> {user.contact}
                            </p>
                            <p><span className="bold-text text-uppercase mr-2">
                                User PubKey: </span> {user.author_display}
                            </p>
                        </div>
                    </div>
                );
            }
            return null
        })
        return userInfo;
    }

    const renderMaintenanceData = () => {
        if(vesselPartData.length !== 0) {
            return (
                <div className="scrollable-table">
                    <table className="table maintenance-table" style={{border: "none"}}>
                        <thead>
                            <tr>
                                <th className="maintenance-table-heading" scope="col">Maintenance Part</th>
                                <th className="maintenance-table-heading" scope="col">Serial Key</th>
                                <th className="maintenance-table-heading" scope="col">Created</th>
                                <th className="maintenance-table-heading" scope="col">IMO Number</th>
                                <th className="maintenance-table-heading" scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vesselPartData.map((vesselPart, idx) => {
                                if(vesselPart.vessel_imo_fkey === relevantVesselData?.imo_number) {
                                    return (
                                        <tr key={idx}>
                                            <th>{vesselPart.vessel_part}</th>
                                            <th>{vesselPart.vessel_part_serial_key}</th>
                                            <th>{vesselPart.created_at}</th>
                                            <th>{vesselPart.vessel_imo_fkey}</th>
                                            <th className="pt-0">
                                                <button 
                                                    onClick={() => navigate(`/supplychain?user_key=${userKey}&serial_key=${vesselPart.vessel_part_serial_key}&imo_number=${vesselPart.vessel_imo_fkey}`)}
                                                    className="actium-maintenance-button ml-2 mt-3" 
                                                >
                                                    View Supply Chain
                                                </button>
                                            </th>
                                        </tr>
                                    )
                                }
                                return null
                            })}
                        </tbody>
                    </table>
                </div>
            )
        }
    }
    
    return (
        <div style={{overflowY: 'unset'}} className={`${(
            maintenancePartModalOpen ||
            seaworthinessModalOpen 
            ) ? "record-container" : "vessel-page-content py-3 px-5"}`
        }>
            {maintenancePartModalOpen && (
                <MaintenancePartStoreModal 
                    wallet={wallet}
                    dataLoading={loaded => setMaintenancePartDataLoaded(loaded)}
                    vesselIMO={relevantVesselData?.imo_number}
                    closeModal={setMaintenancePartModalOpen}
            />
            )}
            {seaworthinessModalOpen && (
                <div>ccc</div>
            )}
            <div className="box-container mt-4">
                {vesselDetails()}
                {userDetails()}
            </div>
            <div className="card-white shadow-sm p-3 mt-4">
                <div className="primary-text">
                        Maintenance Record
                </div>
                <div className="inline-row mt-3">
                    <button 
                        className="actium-main-button ml-2" 
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>

                    {(relevantUserData?.user_designation === "maintenance_admin" 
                    && relevantUserData?.user_author === relevantVesselData?.author) && (
                        <button 
                            className="actium-main-button ml-2" 
                            onClick={() => setMaintenancePartModalOpen(true)}>
                                Add Maintenance Part
                        </button>
                    )}
                    
                    <div className="ml-2">
                        <WalletMultiButton />
                    </div>
                </div>
                <div className="box-container mt-4">
                    <div className="main-box maintenance-record-card mx-2 p-2">
                        <div className="subheading-text bold-text text-uppercase teal-color mt-2">
                            Ship Superintendent
                        </div>
                        <div className="subheading-text bold-text text-uppercase teal-color mt-2">
                            Port State Control
                        </div>
                        <div className="subheading-text bold-text text-uppercase teal-color mt-2">
                            Vetting Organization
                        </div>
                        <div className="inline-row mt-3">
                            {(relevantUserData?.user_designation === "ship_superintendent"
                            || relevantUserData?.user_designation === "port_state_control"
                            || relevantUserData?.user_designation === "vetting_organization"
                            ) ? (
                                <button 
                                    onClick={() => setSeaworthinessModalOpen(true)} 
                                    className="actium-maintenance-button ml-2"
                                >
                                    Approve
                                </button>
                            ) : 
                                <div className="error-msg-sm-bdr ml-2">
                                    Restricted
                                </div>
                            }
                        </div>
                        <button className="actium-maintenance-button ml-2">
                            View All
                        </button>
                    </div>
                    <div className="main-box maintenance-record-card mx-2 p-2">
                        <div className="subheading-text bold-text text-uppercase teal-color">
                            Sea Worthiness
                        </div>
                        <div className="landing-text bold-text text-uppercase mt-4">
                            100 <span className="teal-color">%</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    {renderMaintenanceData()}
                </div>
               
                
            </div>
        </div>
    );
}

export default VesselPage;