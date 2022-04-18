import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getVesselParts } from '../apis/get-vessel-parts';
import InspectionRecordStoreModal from "./record components/InspectionRecordStoreModal";
import { getUsers } from "../apis/get-users";
import { getInspection } from '../apis/get-inspections';

const SupplyChain = ({ wallet }) => {
    const navigate = useNavigate();
    const [ vesselPartData, setVesselPartData ] = useState([]);
    const [ userData, setUserData ] = useState([]);
    const [ inspectionData, setInspectionData ] = useState([]);

    const [ inspectionDataLoaded, setInspectionDataLoaded ] = useState(false);

    const [ retrievedVesselPartData, setRetrievedVesselPartData ] = useState({});
    const [ loginUserData, setLoginUserData ] = useState({});

    const [ inspectionModalOpen, setInspectionModalOpen ] = useState(false);

    const [ searchParams ] = useSearchParams();

    const loginUserPublicKey = searchParams.get('user_key');
    const vesselPartSerialKey = searchParams.get('serial_key');
    const vesselPartImoNumber = searchParams.get('imo_number');

    const loadVesselParts = async () => {
        const vesselsParts = await getVesselParts(wallet);
        setVesselPartData(vesselsParts);
    }
    const loadUserData = async () => {
        const users = await getUsers(wallet);
        setUserData(users);
    }
    const loadInspectionData = async () => {
        const inspectionData = await getInspection(wallet);
        setInspectionData(inspectionData);
    }

    useEffect(() => {
        loadVesselParts();
        loadUserData();
        loadInspectionData();
        setInspectionDataLoaded(false);
    }, [wallet, inspectionDataLoaded] );

    useEffect(() => {
        const retrieveLoginUserData = () => {
            userData.forEach(user => {
                if(loginUserPublicKey === user.key) {
                    setLoginUserData({
                        name: user.full_name, 
                        license_number: user.license_number,
                        designation: user.designation
                    })
                }
            })
        }
        const retrieveVesselPartData = () => {
            vesselPartData.forEach(vesselPart => {
                if(vesselPart.vessel_part_serial_key === vesselPartSerialKey && 
                    vesselPart.vessel_imo_fkey === vesselPartImoNumber) {
                    setRetrievedVesselPartData({
                        vessel_part_public_key: vesselPart.key_sliced,
                        vessel_part_name: vesselPart.vessel_part,
                        vessel_part_key: vesselPart.vessel_part_serial_key,
                        vessel_part_created_date: vesselPart.created_at,
                    })
                }
            })
        }
        retrieveLoginUserData();
        retrieveVesselPartData();
    }, [userData, vesselPartData] );
    
    const renderInspections = () => {
        const inspection = inspectionData?.map((inspection, idx) => {
            if(inspection.vessel_part_public_key_fkey === retrievedVesselPartData?.vessel_part_public_key) {
                return (
                    <div key={idx} className="supply-chain-card my-3 mx-3">
                        <div className="box-container mt-4">
                            <div className="main-box ml-3">
                                <div className="subheading-text text-left px-5 mt-3">
                                    {userData.map(user => {
                                        if(user.author_key === inspection.author_key) {
                                            return (
                                                <>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        Inspector Name: </span> {user?.full_name}
                                                    </p>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        License Number: </span> {user?.license_number}
                                                    </p>
                                                </>
                                            )
                                        }
                                        return null
                                    })}
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Comment: </span> {inspection?.i_comment}
                                    </p>
                                </div>
                            </div>
                            <div className="main-box ml-3">
                                <div className="subheading-text text-left px-5 mt-3">
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Maintenance Batch: </span> {inspection?.maintenance_batch}
                                    </p>
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Created Date: </span> 
                                        {inspection?.created_at}
                                    </p>
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Created: </span> {inspection?.created_ago}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            return null;
        });
        return inspection;
    }

    return (
        <div style={{overflowY: 'unset'}} className={`${(
            inspectionModalOpen 
            ) ? "record-container" : "supplychain-content py-3 px-5"}`
        }>
            {inspectionModalOpen && (
                <InspectionRecordStoreModal 
                    wallet={wallet}
                    inspectorData={loginUserData}
                    vesselPartPubKey={retrievedVesselPartData?.vessel_part_public_key}
                    dataLoading={loaded => setInspectionDataLoaded(loaded)}
                    closeModal={setInspectionModalOpen}
            />
            )}
            <div className="landing-text">
               Supply Chain 
            </div>
            <div className="inline-row">
                <button 
                    className="actium-main-button ml-2" 
                    onClick={() => navigate(-1)}
                    >
                        Back
                </button>
                <div className="ml-2">
                    <WalletMultiButton />
                </div>
            </div>
            <div className="card-grey dark-navy-color shadow-sm py-3 px-5 mt-4">
                <div className="primary-text">
                   Vessel Part
                </div>
                <div className="maintenance-part-card my-3">
                    <div className="subheading-text mt-3">
                        <p><span className="bold-text text-uppercase mr-2">
                            Name: </span>{retrievedVesselPartData?.vessel_part_name}
                        </p>
                        <p><span className="bold-text text-uppercase mr-2">
                            Serial Key: </span>{retrievedVesselPartData?.vessel_part_key}
                        </p>
                        <p><span className="bold-text text-uppercase mr-2">
                            Vessel IMO: </span>{vesselPartImoNumber}
                        </p>
                        <p><span className="bold-text text-uppercase mr-2">
                            Approved: </span>{retrievedVesselPartData?.vessel_part_created_date}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="card-black color-wheat shadow-sm py-3 px-5 mt-4">
                <div className="primary-text">
                   Inspection Procedures
                </div>
               
                {loginUserData?.designation === "internal_inspector" && (
                    <button 
                    onClick={() => setInspectionModalOpen(true)} 
                    className="actium-wheat-button ml-2 mt-3">
                        Add Inspection
                    </button>
                )}
                
                <div className="content-height mt-3">
                    {renderInspections()}
                </div>
            </div>

            <div className="card-black shadow-sm py-3 px-5 mt-4">
                <div className="primary-text teal-color">
                   Service Provider Vessel
                </div>
               
                {loginUserData?.designation === "internal_inspector" && (
                    <button 
                    onClick={() => setInspectionModalOpen(true)} 
                    className="actium-maintenance-button ml-2 mt-3">
                        Add Vessel Part Details
                    </button>
                )}
                
                <div className="content-height mt-3">
                    content of validators
                </div>
            </div>
        </div>
    );
}

export default SupplyChain;