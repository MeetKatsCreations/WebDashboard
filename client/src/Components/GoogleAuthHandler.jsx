import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

const GoogleAuthHandler = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        console.log("Extracted Token:", token);

        if (token) {
            
            localStorage.setItem("userToken", token);

            setTimeout(() => {
                console.log("Logging in with token:", token);
                login(token);
                navigate("/"); 
            }, 500); 
        } else {
            console.error("No token found in URL. Redirecting to /login");
            navigate("/login"); 
        }
    }, [login, navigate]);

    return <h2>Logging in...</h2>;
};

export default GoogleAuthHandler;
