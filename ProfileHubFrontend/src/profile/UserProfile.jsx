import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    getUserProfile,
    getUserPosts,
    getMyProfile,
    requestConnection,
    getConnections
} from "../api/ProfileApi";

import Navbar from "../LandingPages/Navbar";
import Post from "./Post";

// Compare ids safely (number vs string)
const sameId = (a, b) =>
    a !== undefined && a !== null &&
    b !== undefined && b !== null &&
    String(a) === String(b);

const UserProfile = () => {

    const { userId } = useParams();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // NONE | PENDING | REQUEST_RECEIVED | CONNECTED
    const [connectionStatus, setConnectionStatus] = useState("NONE");
    const [connectionLoading, setConnectionLoading] = useState(false);
    const [connectionError, setConnectionError] = useState("");


    // =========================================================
    // LOAD TARGET USER + LOGGED-IN USER
    // =========================================================

    useEffect(() => {

        let cancelled = false;

        const loadUser = async () => {

            setLoading(true);
            setProfile(null);
            setPosts([]);
            setConnectionStatus("NONE");
            setConnectionError("");

            try {

                // Profile and my account are required
                const [profileData, currentUserData] =
                    await Promise.all([
                        getUserProfile(userId),
                        getMyProfile()
                    ]);

                // Posts failing should not hide the profile
                let postsData = [];

                try {
                    postsData = await getUserPosts(userId);
                } catch (error) {
                    console.error("Failed to load posts:", error);
                }

                if (cancelled) return;

                setProfile(profileData);
                setCurrentUser(currentUserData);
                setPosts(Array.isArray(postsData) ? postsData : []);

            } catch (error) {

                console.error("Failed to load user:", error);

            } finally {

                if (!cancelled) setLoading(false);

            }
        };

        loadUser();

        // Ignore results from a previous userId
        return () => {
            cancelled = true;
        };

    }, [userId]);


    // =========================================================
    // CHECK CONNECTION STATUS
    // =========================================================

    useEffect(() => {

        if (!currentUser || !profile) return;

        // Own profile: no connection UI
        if (sameId(currentUser.userId, profile.userId)) {
            setConnectionStatus("NONE");
            return;
        }

        let cancelled = false;

        const checkConnection = async () => {

            try {

                const connections = await getConnections();

                if (cancelled) return;

                const connection = (connections || []).find((item) =>
                    (
                        sameId(item.senderId, currentUser.userId) &&
                        sameId(item.receiverId, profile.userId)
                    ) ||
                    (
                        sameId(item.receiverId, currentUser.userId) &&
                        sameId(item.senderId, profile.userId)
                    )
                );

                if (!connection) {
                    setConnectionStatus("NONE");
                    return;
                }

                const status = connection.connectionRequestStatus;

                if (status === "ACCEPTED") {
                    setConnectionStatus("CONNECTED");
                }
                else if (status === "PENDING") {
                    setConnectionStatus(
                        sameId(connection.senderId, currentUser.userId)
                            ? "PENDING"
                            : "REQUEST_RECEIVED"
                    );
                }
                else {
                    // Rejected / cancelled
                    setConnectionStatus("NONE");
                }

            } catch (error) {

                console.error("Failed to check connection:", error);

            }
        };

        checkConnection();

        return () => {
            cancelled = true;
        };

    }, [currentUser, profile]);


    // =========================================================
    // SEND CONNECTION REQUEST
    // =========================================================

    const handleConnect = async () => {

        if (!currentUser || !profile) return;
        if (sameId(currentUser.userId, profile.userId)) return;
        if (connectionStatus !== "NONE") return;

        try {

            setConnectionLoading(true);
            setConnectionError("");

            // Target USER ID, not profile ID
            await requestConnection(profile.userId);

            setConnectionStatus("PENDING");

        } catch (error) {

            console.error("Failed to send connection request:", error);

            setConnectionError(
                error?.response?.data?.message ||
                "Could not send the request. Please try again."
            );

        } finally {

            setConnectionLoading(false);

        }
    };


    // =========================================================
    // LOADING / NOT FOUND
    // =========================================================

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center mt-10">
                    Loading profile...
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center mt-10">
                    User not found.
                </div>
            </>
        );
    }

    const isOwnProfile =
        currentUser && sameId(currentUser.userId, profile.userId);

    const disabledBtn =
        "px-6 py-2 bg-gray-200 text-gray-700 rounded-md cursor-not-allowed";


    // =========================================================
    // PAGE
    // =========================================================

    return (
        <>
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-6">

                {/* ================= BASIC INFO ================= */}

                <div className="border rounded-lg p-6">

                    <div className="flex items-start gap-6">

                        {profile.profilePicture ? (
                            <img
                                src={profile.profilePicture}
                                alt={profile.name}
                                className="w-32 h-32 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-semibold">
                                {profile.name?.charAt(0)?.toUpperCase()}
                            </div>
                        )}

                        <div className="flex-1">

                            <h1 className="text-3xl font-bold">
                                {profile.name}
                            </h1>

                            {profile.bio && (
                                <p className="mt-3 text-gray-600">
                                    {profile.bio}
                                </p>
                            )}

                            {/* CONNECT BUTTON (never on your own profile) */}

                            {currentUser && !isOwnProfile && (

                                <div className="mt-5">

                                    {connectionStatus === "NONE" && (
                                        <button
                                            type="button"
                                            onClick={handleConnect}
                                            disabled={connectionLoading}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                        >
                                            {connectionLoading ? "Sending..." : "Connect"}
                                        </button>
                                    )}

                                    {connectionStatus === "PENDING" && (
                                        <button type="button" disabled className={disabledBtn}>
                                            Pending
                                        </button>
                                    )}

                                    {connectionStatus === "REQUEST_RECEIVED" && (
                                        <button type="button" disabled className={disabledBtn}>
                                            Request Received
                                        </button>
                                    )}

                                    {connectionStatus === "CONNECTED" && (
                                        <button
                                            type="button"
                                            disabled
                                            className="px-6 py-2 bg-green-100 text-green-700 rounded-md cursor-not-allowed"
                                        >
                                            Connected
                                        </button>
                                    )}

                                    {connectionError && (
                                        <p className="mt-2 text-sm text-red-600">
                                            {connectionError}
                                        </p>
                                    )}

                                </div>
                            )}

                        </div>
                    </div>
                </div>


                {/* ================= SKILLS ================= */}

                {profile.skills && profile.skills.length > 0 && (
                    <div className="border rounded-lg p-6 mt-6">

                        <h2 className="text-xl font-semibold mb-4">Skills</h2>

                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                    </div>
                )}


                {/* ================= EDUCATION ================= */}

                {profile.education && profile.education.length > 0 && (
                    <div className="border rounded-lg p-6 mt-6">

                        <h2 className="text-xl font-semibold mb-4">Education</h2>

                        <div className="space-y-5">
                            {profile.education.map((edu, index) => (
                                <div
                                    key={edu.id || index}
                                    className="border-b pb-4 last:border-b-0"
                                >
                                    {edu.degree && (
                                        <h3 className="font-semibold">{edu.degree}</h3>
                                    )}
                                    {edu.institution && (
                                        <p className="text-gray-600">{edu.institution}</p>
                                    )}
                                    {edu.field && (
                                        <p className="text-gray-500">{edu.field}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                )}


                {/* ================= WORK EXPERIENCE ================= */}

                {profile.workExperience && profile.workExperience.length > 0 && (
                    <div className="border rounded-lg p-6 mt-6">

                        <h2 className="text-xl font-semibold mb-4">
                            Work Experience
                        </h2>

                        <div className="space-y-5">
                            {profile.workExperience.map((work, index) => (
                                <div
                                    key={work.id || index}
                                    className="border-b pb-4 last:border-b-0"
                                >
                                    {work.position && (
                                        <h3 className="font-semibold">{work.position}</h3>
                                    )}
                                    {work.company && (
                                        <p className="text-gray-600">{work.company}</p>
                                    )}
                                    {work.description && (
                                        <p className="text-gray-500 mt-2">{work.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                )}


                {/* ================= POSTS (read-only: view + comment) =================
                    Post expects the whole `posts` array and renders its own
                    "Posts" card, so it is rendered ONCE, not inside posts.map().
                    readOnly hides create / delete; PostCard keeps comments. */}

                <Post posts={posts} readOnly />

            </div>
        </>
    );
};

export default UserProfile;