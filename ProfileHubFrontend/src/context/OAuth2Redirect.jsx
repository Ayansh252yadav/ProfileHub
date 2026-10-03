import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuth2Redirect() {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            navigate("/auth", { replace: true });
            return;
        }

        localStorage.setItem("token", token);
        login(token);

        navigate("/", { replace: true });
    }, [login, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Signing you in...</p>
        </div>
    );
}