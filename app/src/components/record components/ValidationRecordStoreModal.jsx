import { useState, useEffect } from 'react';
import { storeValidation } from '../../apis/store-validation';

const ValidationRecordStoreModal = ({ wallet, validatorData, vesselIMO, dataLoading, closeModal }) => {
    const initialValues = {
        validator_name: validatorData?.name,
        validator_license_number: validatorData?.license_number,
        v_approval: "Yes",
        v_comment: "",
        v_designation: validatorData?.user_designation,
        vessel_imo_fkey: vesselIMO,
    };

    const [ validatorRecordData, setValidatorRecordData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ isStoringSuccess, setIsStoringSuccess ] = useState(false);

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            const injectValidationData = async() => {
                const response = await storeValidation (
                    wallet,
                    validatorRecordData.v_approval,
                    validatorRecordData.v_comment,
                    validatorRecordData.v_designation,
                    validatorRecordData.vessel_imo_fkey,
                );
                setIsStoringSuccess(response);
                closeModal(false)
            }
            injectValidationData();
        }
    }, [formErrors] );

    useEffect(() => {
        if(isStoringSuccess) {
            setValidatorRecordData(initialValues);
            dataLoading(true);
        }
    }, [isStoringSuccess] );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValidatorRecordData( {...validatorRecordData, [name]: value });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(validatorRecordData));
        setIsSubmit(true)
    }

    const validate = (validationValues) => {
        const errors = {};
        if(!validationValues.validator_name){
            errors.validator_name = "validator name is required";
        }
        if(!validationValues.validator_license_number){
            errors.validator_license_number = "validator license is required";
        }
        if(!validationValues.v_approval){
            errors.v_approval = "validator's comment approval is required";
        }
        if(!validationValues.v_comment){
            errors.v_comment = "validator's comment is required";
        }
        return errors;
    }
    
    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">Store Validation</h5>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Validator Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="validator_name"
                                  placeholder='Enter Validators Name'
                                  value={validatorRecordData?.validator_name}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.validator_name}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">License Number</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="validator_license_number"
                                  placeholder='Enter Validator License Number'
                                  value={validatorRecordData?.validator_license_number}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.validator_license_number}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Approval</label>
                            <div className="col-sm-8">
                                <select
                                    className="form-control"
                                    onChange={handleChange}
                                    name="v_approval"
                                >
                                    <option defaultValue={validatorRecordData.v_approval}>
                                        Yes
                                    </option>
                                    <option value="No">
                                        No
                                    </option>
                                </select>
                                <label className="error-text col-form-label">{formErrors.v_approval}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Comment</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="v_comment"
                                  placeholder='Enter Comment'
                                  value={validatorRecordData.v_comment}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.v_comment}</label>
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
                      <button className='actium-main-button'>Add Validation</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ValidationRecordStoreModal;