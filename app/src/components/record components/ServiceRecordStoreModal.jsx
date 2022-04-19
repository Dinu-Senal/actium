import { useState, useEffect } from 'react';
import { storeService } from '../../apis/store-service';

const ServiceRecordStoreModal = ({ wallet, serviceProviderData, vesselPartPubKey, dataLoading, closeModal }) => {
    const initialValues = {
        service_provider_name: serviceProviderData?.name,
        service_provider_license_number: serviceProviderData?.license_number,
        part_description: "",
        date_purchased: "2022-01-01",
        warranty_code: "",
        vessel_part_public_key_fkey: vesselPartPubKey
    };

    const [ serviceRecordData, setServiceRecordData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ isStoringSuccess, setIsStoringSuccess ] = useState(false);

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            const injectServiceData = async() => {
                const response = await storeService (
                    wallet,
                    serviceRecordData.part_description,
                    serviceRecordData.date_purchased,
                    serviceRecordData.warranty_code,
                    serviceRecordData.vessel_part_public_key_fkey
                );
                setIsStoringSuccess(response);
                closeModal(false)
            }
            injectServiceData();
        }
    }, [formErrors] );

    useEffect(() => {
        if(isStoringSuccess) {
            setServiceRecordData(initialValues);
            dataLoading(true);
        }
    }, [isStoringSuccess] );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setServiceRecordData( {...serviceRecordData, [name]: value });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(serviceRecordData));
        setIsSubmit(true)
    }

    const validate = (serviceValues) => {
        const errors = {};
        if(!serviceValues.service_provider_name){
            errors.service_provider_name = "service provider name is required";
        }
        if(!serviceValues.service_provider_license_number){
            errors.service_provider_license_number = "service provider license is required";
        }
        if(!serviceValues.part_description){
            errors.part_description = "vessel part's description is required";
        }
        if(!serviceValues.date_purchased){
            errors.date_purchased = "purchased date is required";
        }
        if(!serviceValues.warranty_code){
            errors.warranty_code = "warranty code is required";
        }
        return errors;
    }
    
    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">Store Services</h5>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Service Provider Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="service_provider_name"
                                  placeholder='Enter Service Provider Name'
                                  value={serviceRecordData?.service_provider_name}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.service_provider_name}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Provider License</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="service_provider_license_number"
                                  placeholder='Enter Provider License'
                                  value={serviceRecordData?.service_provider_license_number}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.service_provider_license_number}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Part Description</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="part_description"
                                  placeholder='Enter Part Description'
                                  value={serviceRecordData.part_description}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.part_description}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="date-time-purchased" className="col-sm-4 col-form-label">Date Purchased</label>
                            <div className="col-sm-8">
                                <input id="date-time-purchased" 
                                    className="form-control" 
                                    type="date" 
                                    name="date_purchased"
                                    placeholder='Enter the Date Purchased'
                                    value={serviceRecordData.date_purchased}
                                    onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.date_purchased}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Warranty Code</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="warranty_code"
                                  placeholder='Enter the Warranty Code'
                                  value={serviceRecordData.warranty_code}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.warranty_code}</label>
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
                      <button className='actium-main-button'>Add Service</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ServiceRecordStoreModal;