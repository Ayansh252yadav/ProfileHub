import { Navigate, useRoutes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import DashBoard from "../LandingPages/DashBoard";
import Register from "../LandingPages/Register";
import Login from "../LandingPages/Login";
import OAuth2Redirect from "../context/OAuth2Redirect";
import Profile from "../profile/Profile";
import UserProfile from "../profile/UserProfile";
import MyNetwork from "../profile/MyNetwork";

const ProtectedRoute = ({ children }) => {

    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

const ProjectRoutes = () => {

    const { token } = useAuth();

    return useRoutes([
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <DashBoard />
                </ProtectedRoute>
            )
        },

        {
            path: "/profile",
            element: (
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            )
        },

        {
            path: "/profile/:userId",
            element: (
                <ProtectedRoute>
                    <UserProfile />
                </ProtectedRoute>
            )
        },

        {
            path: "/network",
            element: (
                <ProtectedRoute>
                    <MyNetwork />
                </ProtectedRoute>
            )
        },

        {
            path: "/auth",
            element: token
                ? <Navigate to="/" replace />
                : <Login />
        },

        {
            path: "/signup",
            element: token
                ? <Navigate to="/" replace />
                : <Register />
        },

        {
            path: "/oauth2/redirect",
            element: <OAuth2Redirect />
        },

        {
            path: "*",
            element: (
                <Navigate
                    to={token ? "/" : "/auth"}
                    replace
                />
            ),
        }
    ]);
};

export default ProjectRoutes;