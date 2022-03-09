import { useEffect, useState } from 'react';
import { storeVessel } from '../apis/store-vessel';

const AddVessel  = (props) => {
    const [vesselData, setVesselData] = useState('');

    useEffect(() => {
        if(vesselData !== '') {
            storeVessel (
                props.wallet,  
                vesselData.vessel_name, 
                vesselData.imo_number,
                vesselData.vessel_description,
                vesselData.ship_company
            )
            props.refresh("refresh")
        }
    }, [vesselData]);

    const handleSubmit = async (event) => {
        event.preventDefault()
        const vesselData = {
          "vessel_name": event.target.elements.vessel_name.value,
          "imo_number": event.target.elements.imo_number.value,
          "vessel_description": event.target.elements.vessel_description.value,
          "ship_company": event.target.elements.ship_company.value
        }
        setVesselData(vesselData);
    }

    return (
        <div className="modal fade" id="storeVesselModal" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <form onSubmit={handleSubmit}>
                    <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">Store Vessel</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label">Vessel Name</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" name="vessel_name"
                                      placeholder='Enter Vessel Name'
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label">IMO Number</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" name="imo_number"
                                      placeholder='Enter IMO Number'
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label">Vessel Description</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" name="vessel_description"
                                      placeholder='Enter Vessel Description'
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label">Ship Company</label>
                                <div className="col-sm-8">
                                    <input className="form-control" type="text" name="ship_company"
                                      placeholder='Enter Ship Company'
                                    />
                                </div>
                            </div>  
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="actium-main-button" data-dismiss="modal">Cancel</button>
                          <button className='actium-main-button' type='submit'>Create Vessel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div> 
    )
}

export default AddVessel;