import { useState } from 'react';

const InspectionRecordStoreModal = ({ closeModal }) => {
    const initialValues = {
        vessel_name: "",
        imo_number: "",
        vessel_description: "",
        ship_company: ""
    };

    const [ vesselData, setVesselData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});

    const handleChange = () => {
        console.log("changed");
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Submit");
    }

    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">Store Inspection</h5>
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

export default InspectionRecordStoreModal;