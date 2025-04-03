import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("userToken");
    
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []); 
    const fetchUser = async (token) => {
        try {
            if (!token) {
                logout(); 
                return;
            }
            
            const response = await fetch("http://localhost:5000/validUser", {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
            } else {
                logout();
            }
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };


    const login = async (tokenOrFormData) => {
        if (typeof tokenOrFormData === "string") {
            localStorage.setItem("userToken", tokenOrFormData);
            await fetchUser(tokenOrFormData);
            return { success: true, message: "Google login successful" };
        }


        try {
            const response = await axios.post("http://localhost:5000/login", tokenOrFormData, { withCredentials: true });

            if (!response.data.token) {
                return { success: false, message: "No token received" };
            }
            localStorage.setItem("userToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));  
            setUser(response.data.user);  
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (formData) => {
        try {
            const response = await axios.post("http://localhost:5000/register", formData, { withCredentials: true });
            localStorage.setItem("userToken", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setUser(response.data.user);
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
