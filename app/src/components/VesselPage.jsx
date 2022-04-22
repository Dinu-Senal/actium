import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getVessels } from '../apis/get-vessels';
import { getUsers } from '../apis/get-users';
import { getVesselParts } from '../apis/get-vessel-parts';
import { getValidation } from '../apis/get-validations';
import { getSeaworthiness } from '../apis/get-seaworthiness';
import { storeSeaworthiness } from '../apis/store-seaworthiness';
import MaintenancePartStoreModal from './record components/MaintenancePartStoreModal';
import ValidationRecordStoreModal from './record components/ValidationRecordStoreModal';

const VesselPage = ({ wallet }) => {
    const navigate = useNavigate();

    const [ vesselData, setVesselData ] = useState([]);
    const [ userData, setUserData ] = useState([]);
    const [ vesselPartData, setVesselPartData ] = useState([]);
    const [ validationData, setValidationData ] = useState([]);
    const [ seaworthinessData, setSeaworthinessData ] = useState([]);

    const [ newSeaworthiness, setNewSeaworthiness ] = useState(0);
    const [ approvedSeaworthiness, setApproveSeaworthiness ] = useState([]);

    const [ relevantVesselData, setReleventVesselData ] = useState({});
    const [ relevantUserData, setReleventUserData ] = useState({});

    const [ finalShipSuperintendentVal, setFinalShipSuperintendentVal ] = useState([]);
    const [ finalPortStateControlVal, setFinalPortStateControlVal ] = useState([]);
    const [ finalVettingOrganizationVal, setFinalVettingOrganizationVal ] = useState([]);

    const [ maintenancePartDataLoaded, setMaintenancePartDataLoaded ] = useState(false);
    const [ validationDataLoaded, setValidationDataLoaded ] = useState(false);
    const [ seaworthinessDataLoaded, setSeaworthinessDataLoaded ] = useState(false);


    const [ maintenancePartModalOpen, setMaintenancePartModalOpen ] = useState(false);
    const [ validationModalOpen, setValidationModalOpen ] = useState(false);

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
    const loadValidations = async () => {
        const validations = await getValidation(wallet);
        setValidationData(validations);
    }
    const loadSeaworthiness = async () => {
        const seaworthiness = await getSeaworthiness(wallet)
        setSeaworthinessData(seaworthiness);
    }

    useEffect(() => {
        loadVessel();
        loadUser();
    }, [wallet] );

    useEffect(() => {
        loadVesselParts();
        loadValidations();
        loadSeaworthiness();
        setMaintenancePartDataLoaded(false);
        setValidationDataLoaded(false);
    }, [ wallet, maintenancePartDataLoaded, validationDataLoaded, seaworthinessDataLoaded ] );

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
                        name: user.full_name, 
                        license_number: user.license_number,
                        user_designation: user.designation,
                        user_public_key: user.key,
                    })
                }
            })
        }
        retrieveRelevantVesselData();
        retrieveRelevantUserData();
    }, [ vesselData, userData ] );

    useEffect(() => {
        filterValidations();
        filterSeaworthiness();
    }, [validationData, seaworthinessData])

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
                            <tr className="burn-orange-color">
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
                                                    className="actium-orange-button ml-2 mt-3" 
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

    const renderValidationData = () => {
        if(validationData.length !== 0) {
            return (
                <div className="scrollable-table">
                    <table className="table maintenance-table" style={{border: "none"}}>
                        <thead>
                            <tr className="teal-color">
                                <th className="maintenance-table-heading" scope="col">Validator Name</th>
                                <th className="maintenance-table-heading" scope="col">Validator License Number</th>
                                <th className="maintenance-table-heading" scope="col">Validator Designation</th>
                                <th className="maintenance-table-heading" scope="col">Approval</th>
                                <th className="maintenance-table-heading" scope="col">Comment</th>
                                <th className="maintenance-table-heading" scope="col">Issued</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validationData.map((validation, idx) => {
                                if(validation.vessel_imo_fkey === relevantVesselData?.imo_number) {
                                    return (
                                        <tr key={idx}>
                                            {userData.map((user, u_idx) => {
                                                if(user.author_key === validation.author_key) {
                                                    return (
                                                        <> 
                                                            <th>{user?.full_name}</th>
                                                            <th>{user?.license_number}</th>
                                                            {(user?.designation === "ship_superintendent") ? <th>Ship Superintendent</th>
                                                            : (user?.designation === "port_state_control") ? <th>Port State Control</th>
                                                            : <th>Vetting Organization</th>
                                                            }
                                                            
                                                        </>
                                                    )
                                                }
                                                return null
                                            })}
                                            <th>{validation.v_approval}</th>
                                            <th>{validation.v_comment}</th>
                                            <th>{validation.created_at}</th>
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
    
    const filterValidations = () => {
        const filteredValidationData = validationData.filter(validation => {
            if(validation.vessel_imo_fkey === relevantVesselData?.imo_number) {
                return validation
            } else {
                return null;
            }
        });
        const shipSuperintendentValidations = filteredValidationData.filter(validation => {
            if(validation.v_designation === "ship_superintendent") {
                return validation
            } else {
                return null;
            }
        });
        const portStateControlValidations = filteredValidationData.filter(validation => {
            if(validation.v_designation === "port_state_control") {
                return validation
            } else {
                return null;
            }
        });
        const vettingOrganizationValidations = filteredValidationData.filter(validation => {
            if(validation.v_designation === "vetting_organization") {
                return validation
            } else {
                return null;
            }
        });

        let finalShipSuperintendentValidation = [];
        let finalPortStateControlValidation = [];
        let finalVettingOrganizationApproval = [];
        if(shipSuperintendentValidations.length !== 0) {
            const shipSuperIntendentLatestApproval = Math.max.apply(Math,  
                shipSuperintendentValidations.map(validation => {
                return validation.timestamp
            }));
            finalShipSuperintendentValidation = shipSuperintendentValidations.filter(validation => {
                if(+validation.timestamp === shipSuperIntendentLatestApproval) {
                    return validation
                } else {
                    return null
                }
            });
        }
        if(portStateControlValidations.length !== 0) {
            const portStateControlLatestApproval = Math.max.apply(Math,  
                portStateControlValidations.map(validation => {
                return validation.timestamp
            }));
            finalPortStateControlValidation = portStateControlValidations.filter(validation => {
                if(+validation.timestamp === portStateControlLatestApproval) {
                    return validation
                } else {
                    return null
                }
            });
        }
        if(vettingOrganizationValidations.length !== 0) {
            const vettingOrganizationLatestApproval = Math.max.apply(Math,  
                vettingOrganizationValidations.map(validation => {
                return validation.timestamp
            }));
            finalVettingOrganizationApproval = vettingOrganizationValidations.filter(validation => {
                if(+validation.timestamp === vettingOrganizationLatestApproval) {
                    return validation
                } else {
                    return null
                }
            });
        }
        setFinalShipSuperintendentVal(finalShipSuperintendentValidation);
        setFinalPortStateControlVal(finalPortStateControlValidation);
        setFinalVettingOrganizationVal(finalVettingOrganizationApproval);

        let shipSuperintendentSeaworthiness = 0;
        let portStateSeaworthiness = 0;
        let vettingSeaworthiness = 0;
        if(finalShipSuperintendentValidation.length !== 0) {
            if(finalShipSuperintendentValidation[0].v_approval === "Yes") {
                shipSuperintendentSeaworthiness = 40;
            } 
        }

        if(finalPortStateControlValidation.length !== 0) {
            if(finalPortStateControlValidation[0].v_approval === "Yes") {
                portStateSeaworthiness = 40;
            } 
        }

        if(finalVettingOrganizationApproval.length !== 0) {
            if(finalVettingOrganizationApproval[0].v_approval === "Yes") {
                vettingSeaworthiness = 20;
            } 
        }
        const newSeaworthiness = shipSuperintendentSeaworthiness + portStateSeaworthiness + vettingSeaworthiness
    
        setNewSeaworthiness(newSeaworthiness);
    }

    const filterSeaworthiness = () => {
        const filteredSeawothinessData = seaworthinessData.filter(seaworth => {
            if(seaworth.vessel_imo_fkey === relevantVesselData?.imo_number) {
                return seaworth
            } else {
                return null;
            }
        });
        
        let approvedSeawothiness = [];
        if(filteredSeawothinessData.length !== 0) {
            const latestApprovedSeaworthiness = Math.max.apply(Math,  
                filteredSeawothinessData.map(seaworth => {
                return seaworth.timestamp
            }));
            approvedSeawothiness = filteredSeawothinessData.filter(seaworth => {
                if(+seaworth.timestamp === latestApprovedSeaworthiness) {
                    return seaworth
                } else {
                    return null
                }
            });
        }
        setApproveSeaworthiness(approvedSeawothiness)
    }

    const handleSeaworthiness = () => {
        const injectRecordData = async() => {
            const response = await storeSeaworthiness (
                wallet,
                newSeaworthiness.toString(),
                relevantVesselData?.imo_number
            );
            setSeaworthinessDataLoaded(response);
        }
        injectRecordData();
    }

    return (
        <div style={{overflowY: 'unset'}} className={`${(
            maintenancePartModalOpen ||
            validationModalOpen
            ) ? "record-container" : "vessel-page-content py-3 px-5"}`
        }>
            {maintenancePartModalOpen && (
                <MaintenancePartStoreModal 
                    wallet={wallet}
                    vesselIMO={relevantVesselData?.imo_number}
                    dataLoading={loaded => setMaintenancePartDataLoaded(loaded)}
                    closeModal={setMaintenancePartModalOpen}
            />
            )}
            {validationModalOpen && (
                <ValidationRecordStoreModal
                    wallet={wallet}
                    validatorData={relevantUserData}
                    vesselIMO={relevantVesselData?.imo_number}
                    dataLoading={loaded => setValidationDataLoaded(loaded)}
                    closeModal={setValidationModalOpen}
                />
            )}
            <div className="box-container mt-4">
                {vesselDetails()}
                {userDetails()}
            </div>
            <div className="card-white shadow-sm p-3 mt-4">
                <div className="primary-text">
                        Vessel Integrity
                </div>
                <div className="inline-row mt-3">
                    <button 
                        className="actium-main-button ml-2" 
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    
                    {(relevantUserData?.user_designation === "ship_superintendent" || 
                        relevantUserData?.user_designation === "port_state_control" ||
                        relevantUserData?.user_designation === "vetting_organization") && (
                            <button 
                                className="actium-main-button ml-2" 
                                onClick={() => setValidationModalOpen(true)}>
                                    Add Validation
                            </button>
                    )}

                    <div className="ml-2">
                        <WalletMultiButton />
                    </div>
                </div>
                <div className="box-container mt-4">
                    <div className="main-box maintenance-record-card mx-2 p-2">
                        <div className="subheading-text teal-color my-3">
                            <p className="text-uppercase bold-text mt-2 mb-0 mx-0">Ship Superintendent
                            {(finalShipSuperintendentVal.length !== 0) && 
                                <span className="color-white mx-3">-
                                    <span className="color-white mx-3"> 
                                        {finalShipSuperintendentVal[0].v_approval}
                                    </span>
                                </span>
                            }</p>
                            {(finalShipSuperintendentVal.length !== 0) ? 
                                <div className="color-white mt-2">
                                    <div>Comment: {finalShipSuperintendentVal[0].v_comment}</div>
                                    <div>Issued: {finalShipSuperintendentVal[0].created_at}</div>
                                </div>
                                :
                                <div className="color-white my-2">Not Initialized</div>
                            }
                        </div>
                        <div className="subheading-text teal-color my-3">
                            <p className="text-uppercase bold-text mt-2 mb-0 mx-0">Port State Control
                            {(finalPortStateControlVal.length !== 0) && 
                                <span className="color-white mx-3">-
                                    <span className="color-white mx-3"> 
                                        {finalPortStateControlVal[0].v_approval}
                                    </span>
                                </span>
                            }</p>
                            {(finalPortStateControlVal.length !== 0) ? 
                                <div className="color-white mt-2">
                                    <div>Comment: {finalPortStateControlVal[0].v_comment}</div>
                                    <div>Issued: {finalPortStateControlVal[0].created_at}</div>
                                </div>
                                :
                                <div className="color-white my-2">Not Initialized</div>
                            }
                        </div>
                        <div className="subheading-text teal-color my-3">
                            <p className="text-uppercase bold-text mt-2 mb-0 mx-0">Vetting Organization
                            {(finalVettingOrganizationVal.length !== 0) && 
                                <span className="color-white mx-3">-
                                    <span className="color-white mx-3"> 
                                        {finalVettingOrganizationVal[0].v_approval}
                                    </span>
                                </span>
                            }</p>
                            {(finalVettingOrganizationVal.length !== 0) ? 
                                <div className="color-white mt-2">
                                    <div>Comment: {finalVettingOrganizationVal[0].v_comment}</div>
                                    <div>Issued: {finalVettingOrganizationVal[0].created_at}</div>
                                </div>
                                :
                                <div className="color-white my-2">Not Initialized</div>
                            }
                        </div>
                    </div>
                    <div className="main-box maintenance-record-card mx-2 p-2">
                        <div className="subheading-text bold-text text-uppercase teal-color my-3 p">
                            Sea Worthiness
                        </div>
                        <div className="landing-text bold-text text-uppercase mt-5">
                            {(approvedSeaworthiness.length !== 0) ? 
                                <div>
                                    {approvedSeaworthiness[0].seaworthiness} <span className="teal-color">%</span>
                                </div>
                                :
                                <div className="error-text">0</div>
                            }
                        </div>
                        <div className="my-5">
                                <div><span className="mr-1">Latest Approved Date: </span>
                                    {(approvedSeaworthiness.length !== 0) ? 
                                    approvedSeaworthiness[0].created_at : "Not Approved"}
                                </div>
                            <div>New Seaworthiness: <span className="ml-1">{newSeaworthiness}</span> %</div>
                        </div>

                        <div className="inline-row mt-4 mb-3">
                            {(relevantUserData?.user_designation === "maintenance_admin"  && 
                                relevantUserData?.user_author === relevantVesselData?.author) ? (
                                <button 
                                    onClick={handleSeaworthiness} 
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
                    </div>
                </div>
                <div className="mt-4">
                    {renderValidationData()}
                </div>
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
                <div className="mt-4">
                    {renderMaintenanceData()}
                </div>
            </div>
        </div>
    );
}

export default VesselPage;