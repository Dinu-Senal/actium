import { useEffect, useState } from 'react';
import { getVessels } from '../apis/get-vessels';
import { storeVessel } from '../apis/store-vessel';

const AddVessel  = ({ wallet, dataLoading, closeModal }) => {
    
    const initialValues = {
        vessel_name: "",
        imo_number: "",
        vessel_description: "",
        ship_company: ""
    };
    const [ blockchainVesselData, setBlockchainVesselData ] = useState([]);
    const [ vesselData, setVesselData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});

    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ isStoringSuccess, setIsStoringSuccess ] = useState(false);

    const loadVessel = async () => {
        const vessels = await getVessels(wallet);
        setBlockchainVesselData(vessels);
    }

    useEffect(() => {
        loadVessel();
    }, [wallet] );

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            const injectVessel = async() => {
                const authenticateVessel = blockchainVesselData.some(vessel => {
                    return vessel.imo_number === vesselData.imo_number
                });
                if(!authenticateVessel) {
                    const response = await storeVessel (
                        wallet,  
                        vesselData.vessel_name, 
                        vesselData.imo_number,
                        vesselData.vessel_description,
                        vesselData.ship_company
                    );
                    setIsStoringSuccess(response);
                    closeModal(false)
                } else {
                    setFormErrors({
                        vessel_reg_failed: "please check again"
                    });
                }
                
            }
            injectVessel();
        }
    }, [formErrors] );

    useEffect(() => {
        if(isStoringSuccess) {
            setVesselData(initialValues);
            dataLoading(true);
        }
    }, [isStoringSuccess] );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setVesselData( {...vesselData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(vesselData));
        setIsSubmit(true);
    }

    const validate = (vesselValues) => {
        const errors = {};
        if(!vesselValues.vessel_name){
            errors.vessel_name = "vessel name is required";
        }
        if(!vesselValues.imo_number){
            errors.imo_number = "imo number is required";
        }
        if(!vesselValues.vessel_description){
            errors.vessel_description = "vessel description is required";
        }
        if(!vesselValues.ship_company){
            errors.ship_company = "ship company is required";
        }
        return errors;
    }

    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">Store Vessel</h5>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Vessel Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="vessel_name"
                                  placeholder='Enter Vessel Name'
                                  value={vesselData.vessel_name}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.vessel_name}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">IMO Number</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="imo_number"
                                  placeholder='Enter IMO Number'
                                  value={vesselData.imo_number}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.imo_number}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Vessel Description</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="vessel_description"
                                  placeholder='Enter Vessel Description'
                                  value={vesselData.vessel_description}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.vessel_description}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Ship Company</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="ship_company"
                                  placeholder='Enter Ship Company'
                                  value={vesselData.ship_company}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.ship_company}</label>
                                <label className="error-text col-form-label">{formErrors.vessel_reg_failed}</label>
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
                      <button className='actium-main-button'>Create Vessel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddVessel;