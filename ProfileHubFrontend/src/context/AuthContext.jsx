import React, {
    useContext,
    useState,
    useEffect,
    createContext
} from "react";

const AuthContext = createContext();

const isTokenValid = (token) => {

    if (!token) {
        return false;
    }

    try {

        const parts = token.split(".");

        if (parts.length !== 3) {
            return false;
        }

        const payload = JSON.parse(
            atob(parts[1])
        );

        if (!payload.exp) {
            return false;
        }
//////////////////
        return payload.exp * 1000 > Date.now();

    } catch (error) {

        return false;
    }
};

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => {

        const storedToken =
            localStorage.getItem("token");

        if (isTokenValid(storedToken)) {
            return storedToken;
        }

        localStorage.removeItem("token");

        return null;
    });


    /*
     * Check token whenever the application starts
     */
    useEffect(() => {

        const storedToken =
            localStorage.getItem("token");

        if (!isTokenValid(storedToken)) {

            localStorage.removeItem("token");

            setToken(null);

            return;
        }

        setToken(storedToken);

    }, []);


    /*
     * Automatically logout when JWT expires
     */
    useEffect(() => {

        if (!token) {
            return;
        }

        try {

            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            if (!payload.exp) {

                localStorage.removeItem("token");
                setToken(null);

                return;
            }

            const expirationTime =
                payload.exp * 1000;

            const remainingTime =
                expirationTime - Date.now();


            /*
             * Token already expired
             */
            if (remainingTime <= 0) {

                localStorage.removeItem("token");

                setToken(null);

                return;
            }


            /*
             * Logout exactly when token expires
             */
            const timer = setTimeout(() => {

                localStorage.removeItem("token");

                setToken(null);

            }, remainingTime);


            return () => {
                clearTimeout(timer);
            };

        } catch (error) {

            localStorage.removeItem("token");

            setToken(null);
        }

    }, [token]);


    /*
     * Login
     */
    const login = (newToken) => {

        if (!isTokenValid(newToken)) {

            localStorage.removeItem("token");

            setToken(null);

            return;
        }

        localStorage.setItem(
            "token",
            newToken
        );

        setToken(newToken);
    };


    /*
     * Logout
     */
    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);
    };


    const value = {
        token,
        login,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    return useContext(AuthContext);

};