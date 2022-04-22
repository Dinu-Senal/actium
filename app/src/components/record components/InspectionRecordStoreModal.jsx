import { useState, useEffect } from 'react';
import { storeInspection } from '../../apis/store-inspection';

const InspectionRecordStoreModal = ({ wallet, inspectorData, vesselPartPubKey, dataLoading, closeModal }) => {
    const initialValues = {
        inspector_name: inspectorData?.name,
        inspector_license_number: inspectorData?.license_number,
        i_comment: "",
        maintenance_batch: "",
        vessel_part_public_key_fkey: vesselPartPubKey
    };

    const [ inspectionRecordData, setInspectionRecordData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ isStoringSuccess, setIsStoringSuccess ] = useState(false);

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            const injectRecordData = async() => {
                const response = await storeInspection (
                    wallet,
                    inspectionRecordData.i_comment,
                    inspectionRecordData.maintenance_batch,
                    inspectionRecordData.vessel_part_public_key_fkey
                );
                setIsStoringSuccess(response);
                closeModal(false)
            }
            injectRecordData();
        }
    }, [formErrors] );

    useEffect(() => {
        if(isStoringSuccess) {
            setInspectionRecordData(initialValues);
            dataLoading(true);
        }
    }, [isStoringSuccess] );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInspectionRecordData( {...inspectionRecordData, [name]: value });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(inspectionRecordData));
        setIsSubmit(true)
    }

    const validate = (inspectionValues) => {
        const errors = {};
        if(!inspectionValues.inspector_name){
            errors.inspector_name = "inspector name is required";
        }
        if(!inspectionValues.inspector_license_number){
            errors.inspector_license_number = "inspector license is required";
        }
        if(!inspectionValues.i_comment){
            errors.i_comment = "comment is required";
        }
        if(!inspectionValues.maintenance_batch){
            errors.maintenance_batch = "maintenance batch required";
        }
        return errors;
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
                            <label className="col-sm-4 col-form-label">Inspector Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="inspector_name"
                                  placeholder='Enter Inspector Name'
                                  value={inspectorData?.name}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.inspector_name}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Inspector License</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="inspector_license_number"
                                  placeholder='Enter Inspector License'
                                  value={inspectorData?.license_number}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.inspector_license_number}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Comment</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="i_comment"
                                  placeholder='Enter a Comment'
                                  value={inspectionRecordData.i_comment}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.i_comment}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Maintenance Batch</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="maintenance_batch"
                                  placeholder='Enter the Maintenance Batch'
                                  value={inspectionRecordData.maintenance_batch}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.maintenance_batch}</label>
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
                      <button className='actium-main-button'>Add Inspection</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default InspectionRecordStoreModal;