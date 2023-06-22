import { useNavigate } from "react-router-dom";

export default function TopBar(){
    const navigate = useNavigate();
    function goToLogin(){
        navigate("/login");
    }
    return (
        <div className="top-bar">
            <button onClick={goToLogin}>Login</button>
        </div>
    )
}