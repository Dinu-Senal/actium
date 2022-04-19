import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getVesselParts } from '../apis/get-vessel-parts';
import { getUsers } from "../apis/get-users";
import { getInspection } from '../apis/get-inspections';
import { getServices } from "../apis/get-services";
import { getDeliveries } from "../apis/get-deliveries";
import InspectionRecordStoreModal from "./record components/InspectionRecordStoreModal";
import ServiceRecordStoreModal from "./record components/ServiceRecordStoreModal";
import DeliveryRecordStoreModal from "./record components/DeliveryRecordStoreModal";

const SupplyChain = ({ wallet }) => {
    const navigate = useNavigate();
    const [ vesselPartData, setVesselPartData ] = useState([]);
    const [ userData, setUserData ] = useState([]);
    const [ inspectionData, setInspectionData ] = useState([]);
    const [ serviceData, setServiceData ] = useState([]);
    const [ deliveryData, setDeliveryData ] = useState([]);

    const [ inspectionDataLoaded, setInspectionDataLoaded ] = useState(false);
    const [ serviceDataLoaded, setServiceDataLoaded ] = useState(false);
    const [ deliveryDataLoaded, setDeliveryDataLoaded ] = useState(false);

    const [ retrievedVesselPartData, setRetrievedVesselPartData ] = useState({});
    const [ loginUserData, setLoginUserData ] = useState({});

    const [ inspectionModalOpen, setInspectionModalOpen ] = useState(false);
    const [ serviceModalOpen, setServiceModalOpen ] = useState(false);
    const [ deliveryModalOpen, setDeliveryModalOpen ] = useState(false);

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
    const loadServiceData = async () => {
        const serviceData = await getServices(wallet);
        setServiceData(serviceData)
    }
    const loadDeliveryData = async () => {
        const deliveryData = await getDeliveries(wallet);
        setDeliveryData(deliveryData);
    }

    useEffect(() => {
        loadVesselParts();
        loadUserData();
        loadInspectionData();
        loadServiceData();
        loadDeliveryData();
        setInspectionDataLoaded(false);
        setServiceDataLoaded(false);
        setDeliveryDataLoaded(false);
    }, [wallet, inspectionDataLoaded, serviceDataLoaded, deliveryDataLoaded] );

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
                                    {userData.map((user, u_idx) => {
                                        if(user.author_key === inspection.author_key) {
                                            return (
                                                <div key={u_idx}>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        Inspector Name: </span> {user?.full_name}
                                                    </p>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        Inspector License: </span> {user?.license_number}
                                                    </p>
                                                </div>
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

    const renderServiceRecords = () => {
        const services = serviceData?.map((service, idx) => {
            if(service.vessel_part_public_key_fkey === retrievedVesselPartData?.vessel_part_public_key) {
                return (
                    <div key={idx} className="service-provider-card my-3 mx-3">
                        <div className="box-container mt-4">
                            <div className="main-box ml-3">
                                <div className="subheading-text text-left px-5 mt-3">
                                    {userData.map((user, u_idx) => {
                                        if(user.author_key === service.author_key) {
                                            return (
                                                <div key={u_idx}>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        Service Provider: </span> {user?.full_name}
                                                    </p>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        Provider License: </span> {user?.license_number}
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    })}
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Description: </span> {service?.part_description}
                                    </p>
                                </div>
                            </div>
                            <div className="main-box ml-3">
                                <div className="subheading-text text-left px-5 mt-3">
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Date Purchased: </span> {service?.date_format}
                                    </p>
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Warranty Code: </span> {service?.warranty_code}
                                    </p>
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Created Date: </span> 
                                        {service?.created_at}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            return null;
        })
        return services;
    }

    const renderDeliveryRecords = () => {
        const deliveries = deliveryData?.map((delivery, idx) => {
            if(delivery.vessel_part_public_key_fkey === retrievedVesselPartData?.vessel_part_public_key) {
                return (
                    <div key={idx} className="delivery-service-card my-3 mx-3 pb-3">
                        <div className="box-container mt-4">
                            <div className="main-box ml-3">
                                <div className="subheading-text text-left px-5 mt-3">
                                    {userData.map((user, u_idx) => {
                                        if(user.author_key === delivery.author_key) {
                                            return (
                                                <div key={u_idx}>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        Delivery Service: </span> {user?.full_name}
                                                    </p>
                                                    <p><span className="bold-text text-uppercase mr-2">
                                                        Delivery License: </span> {user?.license_number}
                                                    </p>
                                                </div>
                                            )
                                        }
                                        return null
                                    })}
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Delivery Address: </span> {delivery?.delivered_address}
                                    </p>
                                </div>
                            </div>
                            <div className="main-box ml-3">
                                <div className="subheading-text text-left px-5 mt-3">
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Delivery Date: </span> {delivery?.date_format}
                                    </p>
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Warehouse: </span> {delivery?.warehouse}
                                    </p>
                                    <p><span className="bold-text text-uppercase mr-2">
                                        Created Date: </span> 
                                        {delivery?.created_at}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            return null;
        })
        return deliveries;
    }

    return (
        <div style={{overflowY: 'unset'}} className={`${(
            inspectionModalOpen || 
            serviceModalOpen ||
            deliveryModalOpen
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
            {serviceModalOpen && (
                <ServiceRecordStoreModal 
                    wallet={wallet}
                    serviceProviderData={loginUserData}
                    vesselPartPubKey={retrievedVesselPartData?.vessel_part_public_key}
                    dataLoading={loaded => setServiceDataLoaded(loaded)}
                    closeModal={setServiceModalOpen}
                />
            )}
            {deliveryModalOpen && (
                <DeliveryRecordStoreModal
                    wallet={wallet}
                    deliveryServiceData={loginUserData}
                    vesselPartPubKey={retrievedVesselPartData?.vessel_part_public_key}
                    dataLoading={loaded => setDeliveryDataLoaded(loaded)}
                    closeModal={setDeliveryModalOpen}
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

            <div className="card-black teal-color shadow-sm py-3 px-5 mt-4">
                <div className="primary-text">
                   Service Provider Record
                </div>
               
                {loginUserData?.designation === "service_provider" && (
                    <button 
                    onClick={() => setServiceModalOpen(true)} 
                    className="actium-maintenance-button ml-2 mt-3">
                        Add Vessel Part Details
                    </button>
                )}
                
                <div className="content-height mt-3">
                    {renderServiceRecords()}
                </div>
            </div>

            <div className="card-black green-color shadow-sm py-3 px-5 mt-4">
                <div className="primary-text">
                   Delivery Service Record
                </div>
               
                {loginUserData?.designation === "delivery_service" && (
                    <button 
                    onClick={() => setDeliveryModalOpen(true)} 
                    className="actium-green-button ml-2 mt-3">
                        Add Delivery Details
                    </button>
                )}
                
                <div className="content-height mt-3">
                    {renderDeliveryRecords()}
                </div>
            </div>
        </div>
    );
}

export default SupplyChain;