import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate, useSearchParams } from "react-router-dom";

const SupplyChain = () => {
    const navigate = useNavigate();
    return (
        <div className="supplychain-content">
            <div className="landing-text">
               Supply Chain 
            </div>
            <div className="inline-row">
                <button 
                    className="actium-main-button ml-2" 
                    onClick={() => navigate(-1)}
                    >
                        Back
                </button>
                <div className="ml-2">
                    <WalletMultiButton />
                </div>
            </div>
        </div>
    );
}

export default SupplyChain;