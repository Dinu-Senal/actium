import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="main-center-container">
            <div className="landing-text">Actium</div>
            <hr className="mb-4" style={{ width: "50%", background: '#29707E' }} />
            <button className="actium-main-button mx-3">Login</button>
            <button className="actium-main-button mx-3">Register</button>
            <Link to="/home">
                <button className="actium-main-button mx-3">View Vessels</button>
            </Link>
        </div>
    );
}

export default LandingPage;