import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getUsers } from '../apis/get-users';
import { storeUser } from "../apis/store-user";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getWallet } from "../apis/get-wallet";

const RegisterPage = ({ wallet }) => {
    const navigate = useNavigate();
    
    const initialValues = {
        full_name: "",
        designation: "",
        license_number: "",
        nic_number: "",
        contact: ""
    };

    const [ userData, setUserData ] = useState();
    const [ registerData, setRegisterData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ isStoringSuccess, setIsStoringSuccess ] = useState(false);
    const [ walletPublicKey, setWalletPublicKey ] = useState(null);

    const loadUser = async () => {
        const users = await getUsers(wallet);
        setUserData(users);
    }

    useEffect(() => {
        loadUser();
    }, [wallet, isStoringSuccess] )
  
    const retrieveWalletPubkey = async () => {
        const walletKey = await getWallet(wallet);
        setWalletPublicKey(walletKey)
    }

    useEffect(() => {
        retrieveWalletPubkey();
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            let walletUsed;
            const registerFailed = userData.some(user => {
                if(user.full_name === registerData.full_name || 
                    user.license_number === registerData.license_number) {
                        walletUsed = false;
                        return true
                } else if (walletPublicKey === user.author_key) {
                        walletUsed = true;
                        return true
                }
                return false;
            })
            if(!registerFailed) {
                const injectUser = async () => {
                    const response = await storeUser (
                        wallet,  
                        registerData.full_name, 
                        registerData.designation,
                        registerData.license_number,
                        registerData.nic_number,
                        registerData.contact,
                    );
                    setIsStoringSuccess(response);
                }
                injectUser();
            } else if (walletUsed) {
                setFormErrors({
                    registration_failed: "wallet in use"
                })
            } else {
                setFormErrors({
                    registration_failed: "full name and license number are already on the system"
                })
            }
        }
    }, [formErrors] );

    useEffect(() => {
        if(isStoringSuccess) {
            userData.forEach(user => {
                if (user.license_number === registerData.license_number) {
                    navigate(`/home?user_key=${user.key}&usertype=${user.designation}`)
                }
            })
        }
    }, [isStoringSuccess, userData] );

    const handleChange = (event) => {
        const { name, value } = event.target;
        setRegisterData( {...registerData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(registerData));
        setIsSubmit(true);
    }

    const validate = (registerValues) => {
        const errors = {};
        if(!registerValues.full_name){
            errors.full_name = "full name is required";
        }
        if(!registerValues.designation){
            errors.designation = "designation is required";
        }
        if(!registerValues.license_number){
            errors.license_number = "license number is required";
        }
        if(!registerValues.nic_number){
            errors.nic_number = "nic number is required";
        }
        if(!registerValues.contact){
            errors.contact = "contact is required";
        }
        return errors;
    }

    return (
        <div className="register-content primary-card my-5">
        <form className="p-3" onSubmit={handleSubmit}>
            <h2 className="text-uppercase text-center mx-5 mt-3 mb-5">Register</h2>
            <div className="register-body px-5">

                <div className="form-group row">
                    <label className="col-sm-4 text-left">Full Name</label>
                    <div className="col-sm-8">
                        <input className="form-control" type="text" name="full_name"
                          placeholder='Enter Full Name'
                          value={registerData.full_name}
                          onChange={handleChange}
                        />
                        <label className="error-text col-form-label">{formErrors.full_name}</label>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-4 text-left">Designation</label>
                    <div className="col-sm-8">
                        <select
                            className="form-control"
                            onChange={handleChange}
                            name="designation"
                        >
                            <option defaultValue={registerData.designation}>
                                Enter Designation
                            </option>
                            <option value="maintenance_admin">
                                Maintenance Admin
                            </option>
                            <option value="internal_inspector">
                                Internal Inspector
                            </option>
                            <option value="port_state_control">
                                Port State Control
                            </option>
                            <option value="ship_superintendent">
                                Ship Superintendent
                            </option>
                            <option value="vetting_organization">
                                Vetting Organization
                            </option>
                            <option value="service_provider">
                                Service Provider
                            </option>
                            <option value="delivery_service">
                                Delivery_Service
                            </option>
                        </select>
                        <label className="error-text col-form-label">{formErrors.designation}</label>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-4 text-left">License Number</label>
                    <div className="col-sm-8">
                        <input className="form-control" type="text" name="license_number"
                          placeholder='Enter License Number'
                          value={registerData.license_number}
                          onChange={handleChange}
                        />
                        <label className="error-text col-form-label">{formErrors.license_number}</label>
                    </div>
                </div>
                 <div className="form-group row">
                    <label className="col-sm-4 text-left">Nic Number</label>
                    <div className="col-sm-8">
                        <input className="form-control" type="text" name="nic_number"
                          placeholder='Enter Nic Number'
                          value={registerData.nic_number}
                          onChange={handleChange}
                        />
                        <label className="error-text col-form-label">{formErrors.nic_number}</label>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-sm-4 text-left">Contact</label>
                    <div className="col-sm-8">
                        <input className="form-control" type="text" name="contact"
                          placeholder='Enter Contacts'
                          value={registerData.contact}
                          onChange={handleChange}
                        />
                        <label className="error-text col-form-label">{formErrors.contact}</label>
                        <label className="error-text col-form-label">{formErrors.registration_failed}</label>
                    </div>
                </div>
                <div className="inline-row">
                    <button className="actium-main-button mx-3">Register</button>
                    <div className="ml-2">
                            <WalletMultiButton />
                    </div>
                </div>
                <div className="my-5">
                    Do you have an account? 
                    <Link to='/'> Login</Link>
                </div>
            </div>
        </form>
        </div>
    );
}

export default RegisterPage;
