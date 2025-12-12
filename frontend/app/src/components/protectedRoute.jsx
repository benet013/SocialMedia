import { ACCESS_TOKEN,REFRESH_TOKEN } from "../constant";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api";
import {jwtDecode} from "jwt-decode";

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        auth().catch((error) => {
            console.error("Authentication error:", error);
            setIsAuthenticated(false);
        });
    }, []);

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('/api/token/refresh/', { refresh: refresh });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        }catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthenticated(false);
        }
    }

    const auth = async () => {
        const access = localStorage.getItem(ACCESS_TOKEN);
        if (!access) {
            setIsAuthenticated(false);
            return;
        }

        const decoded = jwtDecode(access);
        const exp = decoded.exp;
        const currentTime = Date.now() / 1000;

        if (exp < currentTime) {
            await refreshToken();
        } else {
            setIsAuthenticated(true);
        }
    }

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;