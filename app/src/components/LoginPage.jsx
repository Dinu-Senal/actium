import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getUsers } from '../apis/get-users';
import { getWallet } from "../apis/get-wallet";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const LoginPage = ({ wallet }) => {
    const navigate = useNavigate();
    const initialValues = {
        full_name: "",
        license_number: ""
    };

    const [ userData, setUserData ] = useState();
    const [ loginData, setLoginData ] = useState(initialValues);
    const [ formErrors, setFormErrors ] = useState({});
    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ walletPublicKey, setWalletPublicKey ] = useState(null);
    
    useEffect(() => {
        loadUser();
    }, [wallet] );

    const retrieveWalletPubkey = async () => {
        const walletKey = await getWallet(wallet);
        setWalletPublicKey(walletKey)
    }

    useEffect(() => {
        retrieveWalletPubkey()
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            userData.forEach(user => {
                if(
                    user.full_name === loginData.full_name && 
                    user.license_number === loginData.license_number
                ) {
                    if (user.author_key === walletPublicKey) {
                        navigate(`/home?user_key=${user.key}&usertype=${user.designation}`)
                    }
                } else {
                    setFormErrors({
                        login_failed: "please check the wallet or cridentials"
                    })
                }
            });
        }
    }, [formErrors] );

    const loadUser = async () => {
        const users = await getUsers(wallet);
        setUserData(users);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLoginData( {...loginData, [name]: value });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormErrors(validate(loginData));
        setIsSubmit(true);
    }

    const validate = (loginValues) => {
        const errors = {};
        if(!loginValues.full_name){
            errors.full_name = "full name is required";
        }
        if(!loginValues.license_number){
            errors.license_number = "license number is required";
        }
        return errors;
    }

    return (
        <div className="login-content primary-card mt-5">
            <form className="p-3" onSubmit={handleSubmit}>
                <h2 className="text-uppercase text-center mx-5 mt-3 mb-5">Login</h2>
                <div className="login-body px-5">

                    <div className="form-group row">
                        <label className="col-sm-4 text-left">Full Name</label>
                        <div className="col-sm-8">
                            <input className="form-control" type="text" name="full_name"
                              placeholder='Enter Full Name'
                              value={loginData.full_name}
                              onChange={handleChange}
                            />
                            <label className="error-text col-form-label">{formErrors.full_name}</label>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-4 text-left">License Number</label>
                        <div className="col-sm-8">
                            <input className="form-control" type="text" name="license_number"
                              placeholder='Enter License Number'
                              value={loginData.license_number}
                              onChange={handleChange}
                            />
                            <label className="error-text col-form-label">{formErrors.license_number}</label>
                            <label className="error-text col-form-label">{formErrors.wallet_invalid}</label>
                            <label className="error-text col-form-label">{formErrors.login_failed}</label>
                        </div>
                    </div>
                    <div className="inline-row my-4">
                        <button className="actium-main-button mx-3">Login</button>
                        <div className="ml-2">
                            <WalletMultiButton />
                        </div>
                    </div>
                    <div className="mt-3">
                        Don't have an account? 
                        <Link to='/register'> Register</Link>
                    </div>
                    <div className="mt-3 mb-5">
                        Wan't only to view vessels?
                        <Link to='/home'> View Vessels</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;