import { useState, useEffect } from 'react';
import { storeDelivery } from '../../apis/store-delivery'

const DeliveryRecordStoreModal = ({ wallet, deliveryServiceData, vesselPartPubKey, dataLoading, closeModal }) => {
    const initialValues = {
        delivery_service_name: deliveryServiceData?.name,
        delivery_service_license_number: deliveryServiceData?.license_number,
        delivered_address: "",
        delivered_date: "2022-01-01",
        warehouse: "",
        vessel_part_public_key_fkey: vesselPartPubKey
    };

    const [ deliveryRecordData, setDeliveryRecordData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ isStoringSuccess, setIsStoringSuccess ] = useState(false);

    useEffect(() => {
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            const injectDeliveryData = async() => {
                const response = await storeDelivery (
                    wallet,
                    deliveryRecordData.delivered_address,
                    deliveryRecordData.delivered_date,
                    deliveryRecordData.warehouse,
                    deliveryRecordData.vessel_part_public_key_fkey
                );
                setIsStoringSuccess(response);
                closeModal(false)
            }
            injectDeliveryData();
        }
    }, [formErrors] );

    useEffect(() => {
        if(isStoringSuccess) {
            setDeliveryRecordData(initialValues);
            dataLoading(true);
        }
    }, [isStoringSuccess] );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDeliveryRecordData( {...deliveryRecordData, [name]: value });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(deliveryRecordData));
        setIsSubmit(true)
    }

    const validate = (deliveryValues) => {
        const errors = {};
        if(!deliveryValues.delivery_service_name){
            errors.delivery_service_name = "delivery service name is required";
        }
        if(!deliveryValues.delivery_service_license_number){
            errors.delivery_service_license_number = "delivery service license is required";
        }
        if(!deliveryValues.delivered_address){
            errors.delivered_address = "delivered address is required";
        }
        if(!deliveryValues.delivered_date){
            errors.delivered_date = "delivered date is required";
        }
        if(!deliveryValues.warehouse){
            errors.warehouse = "warehouse is required";
        }
        return errors;
    }
    
    return (
        <div className="modal-background">
            <div className="modal-container shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">Store Delivery Details</h5>
                    </div>
                    <div className="modal-body">
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Delivery Service Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="delivery_service_name"
                                  placeholder='Enter Delivery Service Name'
                                  value={deliveryRecordData?.delivery_service_name}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.delivery_service_name}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Delivery Service License</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="delivery_service_license_number"
                                  placeholder='Enter Delivery Services License'
                                  value={deliveryRecordData?.delivery_service_license_number}
                                  readOnly
                                />
                                <label className="error-text col-form-label">{formErrors.delivery_service_license_number}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Delivery Address</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="delivered_address"
                                  placeholder='Enter Delivery Address'
                                  value={deliveryRecordData.delivered_address}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.delivered_address}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="date-time-delivered" className="col-sm-4 col-form-label">Delivered Date</label>
                            <div className="col-sm-8">
                                <input id="date-time-delivered" 
                                    className="form-control" 
                                    type="date" 
                                    name="delivered_date"
                                    placeholder='Enter the Delivered Date'
                                    value={deliveryRecordData.delivered_date}
                                    onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.delivered_date}</label>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-4 col-form-label">Warehouse</label>
                            <div className="col-sm-8">
                                <input className="form-control" type="text" name="warehouse"
                                  placeholder='Enter the Warehouse'
                                  value={deliveryRecordData.warehouse}
                                  onChange={handleChange}
                                />
                                <label className="error-text col-form-label">{formErrors.warehouse}</label>
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
                      <button className='actium-main-button'>Add Delivery</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DeliveryRecordStoreModal;