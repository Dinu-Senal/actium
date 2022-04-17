import { useEffect, useState } from 'react';
import { getVesselParts } from '../../apis/get-vessel-parts';
import { storeVesselPart } from '../../apis/store-vessel-part';

const MaintenancePartModalOpen = ({ vesselIMO, dataLoading, wallet, closeModal }) => {
    const initialValues = {
        vessel_part: "",
        vessel_part_serial_key: "",
        vessel_imo_fkey: "",
    };

    const [ blockchainVesselPartData, setBlockchainVesselPartData ] = useState();
    const [ vesselPartData, setVesselPartData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ isStoringSuccess, setIsStoringSuccess ] = useState(false);


    const loadVesselParts = async () => {
        const vesselsParts = await getVesselParts(wallet);
        setBlockchainVesselPartData(vesselsParts);
    }

    useEffect(() => {
        loadVesselParts();
    }, [wallet] );

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            const injectVesselPart = async() => {
                const authenticateVesselPart = blockchainVesselPartData.some(vessel => {
                    const vesselValid = vesselPartData.vessel_part_serial_key === vessel.vessel_part_serial_key && vesselIMO === vessel.vessel_imo_fkey
                    return vesselValid
                });

                if(!authenticateVesselPart) {
                    const response = await storeVesselPart (
                        wallet,  
                        vesselPartData.vessel_part, 
                        vesselPartData.vessel_part_serial_key,
                        vesselIMO
                    );
                    setIsStoringSuccess(response);
                    closeModal(false)
                } else {
                    setFormErrors({
                        vessel_part_store_failed: "the serial key is already in the system"
                    });
                }
                
            }
            injectVesselPart();
        }
    }, [formErrors] );

    useEffect(() => {
        if(isStoringSuccess) {
            setVesselPartData(initialValues);
            dataLoading(true);
        }
    }, [isStoringSuccess] );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setVesselPartData( {...vesselPartData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(vesselPartData));
        setIsSubmit(true);
    }

    const validate = (vesselPartValues) => {
        const errors = {};
        if(!vesselPartValues.vessel_part){
            errors.vessel_part = "vessel part name is required";
        }
        if(!vesselPartValues.vessel_part_serial_key){
            errors.vessel_part_serial_key = "serial key is required";
        }
        return errors;
    }

    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">Store Maintenance Part</h5>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Vessel Part Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="vessel_part"
                                  placeholder='Enter Vessel Part Name'
                                  value={vesselPartData.vessel_part}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.vessel_part}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Serial Key</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="vessel_part_serial_key"
                                  placeholder='Enter Vessel Part Serial Key'
                                  value={vesselPartData.vessel_part_serial_key}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.vessel_part_serial_key}</label>
                                <label className="error-text col-form-label">{formErrors.vessel_part_store_failed}</label>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="actium-main-button" 
                        onClick={() => closeModal(false)}
                      >Cancel
                      </button>
                      <button className='actium-main-button'>Store Vessel Part</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MaintenancePartModalOpen;