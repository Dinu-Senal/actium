import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { getUsers } from '../apis/get-users';

const MyAccountPage = ({ wallet }) => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();

    const [ userData, setUserData ] = useState([]);

    const loadUser = async () => {
        const users = await getUsers(wallet);
        setUserData(users);
    }

    useEffect(() => {
        loadUser();
    }, [wallet] );

    const userKey = searchParams.get('user_key');

    return( 
        <div className="my-account-content py-3 px-5">
            <div className="landing-text mt-3">My Account</div>
            <div className="card-zinc subheading-text mt-3 p-4">
                {userData.map((user, idx) => {
                    if (user.key === userKey) {
                        return (
                            <div key={idx}>
                                <div className="mt-3">
                                    <span className="bold-text mr-3">Name:</span>
                                    {user.full_name}
                                </div>
                                <div className="mt-3">
                                    <span className="bold-text mr-3">Designation:</span>
                                    {user.designation}
                                </div>
                                <div className="mt-3">
                                    <span className="bold-text mr-3">License Number:</span>
                                    {user.license_number}
                                </div>
                                <div className="mt-3">
                                    <span className="bold-text mr-3">NIC:</span>
                                    {user.nic_number}
                                </div>
                                <div className="mt-3">
                                    <span className="bold-text mr-3">Contact:</span>
                                    {user.contact}
                                </div>
                                <div className="mt-3">
                                    <span className="bold-text mr-3">Account Created:</span>
                                    {user.created_at}
                                </div>
                                <div className="mt-3">
                                    <span className="bold-text mr-3">Public Key:</span>
                                    {user.key_sliced}
                                </div>
                            </div>
                        )
                    }
                    return null
                })}
                <button 
                        className="actium-main-button mt-4" 
                        onClick={() => navigate(-1)}
                    >
                        Back
                </button>
            </div>
        </div>
    )
}

export default MyAccountPage;