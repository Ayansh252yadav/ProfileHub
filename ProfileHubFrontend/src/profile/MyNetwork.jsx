import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

import {
    getMyProfile,
    getPendingRequests,
    getConnections,
    getUserProfile,
    updateConnectionStatus
} from "../api/ProfileApi";

import { formatDate } from "../utils/formatDate";
import { sameId } from "./connectionStatus";
import Navbar from "../LandingPages/Navbar";

// =========================================================
// CONFIG: must match what your backend expects in
// PUT /connection/approved/{status}/{requestId}
// =========================================================
const ACCEPT_STATUS = "ACCEPTED";
const REJECT_STATUS = "REJECTED";


// Backend field names for pending requests are unknown,
// so accept common variants. Adjust here if yours differ.
const normalizeRequest = (r) => ({
    requestId: r.requestId ?? r.id,
    senderId: r.senderId ?? r.sender?.userId ?? r.sender?.id,
    name: r.senderName ?? r.name ?? r.sender?.name ?? null,
    picture:
        r.senderProfilePicture ??
        r.profilePicture ??
        r.sender?.profilePicture ??
        null,
    bio: r.senderBio ?? r.bio ?? r.sender?.bio ?? null,
    createdAt: r.createdAt ?? r.requestedAt ?? null
});


// Small shared avatar
const Avatar = ({ src, name }) =>
    src ? (
        <img
            src={src}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
        />
    ) : (
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
            {name.charAt(0).toUpperCase()}
        </div>
    );


const MyNetwork = () => {

    const navigate = useNavigate();

    const [tab, setTab] = useState("REQUESTS");

    const [requests, setRequests] = useState([]);
    const [connected, setConnected] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [actingId, setActingId] = useState(null);


    // ================= LOAD ACCEPTED CONNECTIONS =================
    // /connection returns sender/receiver ids. If names are not in the
    // response, each person's profile is fetched to show name + photo.

    const loadConnected = async (me) => {

        const all = await getConnections();

        const accepted = (Array.isArray(all) ? all : []).filter(
            (item) => item.connectionRequestStatus === "ACCEPTED"
        );

        const people = await Promise.all(
            accepted.map(async (item) => {

                const iSent = sameId(item.senderId, me);
                const otherId = iSent ? item.receiverId : item.senderId;

                let name =
                    (iSent
                        ? item.receiverName ?? item.receiver?.name
                        : item.senderName ?? item.sender?.name) ?? null;

                let picture =
                    (iSent
                        ? item.receiverProfilePicture ?? item.receiver?.profilePicture
                        : item.senderProfilePicture ?? item.sender?.profilePicture) ?? null;

                let bio = null;

                if (!name) {
                    try {
                        const profile = await getUserProfile(otherId);
                        name = profile.name;
                        picture = profile.profilePicture ?? picture;
                        bio = profile.bio ?? null;
                    } catch (err) {
                        console.error("Failed to load profile:", otherId, err);
                    }
                }

                return {
                    key: item.requestId ?? item.id ?? otherId,
                    userId: otherId,
                    name,
                    picture,
                    bio
                };
            })
        );

        setConnected(people);
    };


    // ================= INITIAL LOAD =================

    useEffect(() => {

        let cancelled = false;

        const load = async () => {

            try {

                setLoading(true);
                setError("");

                const [me, pending] = await Promise.all([
                    getMyProfile(),
                    getPendingRequests()
                ]);

                if (cancelled) return;

                setRequests(
                    Array.isArray(pending) ? pending.map(normalizeRequest) : []
                );

                await loadConnected(me.userId);

            } catch (err) {

                console.error("Failed to load network:", err);

                if (!cancelled) setError("Failed to load your network.");

            } finally {

                if (!cancelled) setLoading(false);

            }
        };

        load();

        return () => {
            cancelled = true;
        };

    }, []);


    // ================= ACCEPT / REJECT =================

    const handleDecision = async (requestId, status) => {

        if (!requestId || actingId) return;

        try {

            setActingId(requestId);

            await updateConnectionStatus(status, requestId);

            setRequests((prev) =>
                prev.filter((r) => r.requestId !== requestId)
            );

            // A newly accepted person should appear under Connections
            if (status === ACCEPT_STATUS) {
                try {
                    const me = await getMyProfile();
                    await loadConnected(me.userId);
                } catch (err) {
                    console.error("Failed to refresh connections:", err);
                }
            }

        } catch (err) {

            console.error("Failed to update request:", err);

            alert(
                err?.response?.data?.message ||
                "Could not update the request. Please try again."
            );

        } finally {

            setActingId(null);

        }
    };


    const openProfile = (userId) => {
        if (userId) navigate(`/profile/${userId}`);
    };


    const tabClass = (name) =>
        `flex-1 px-4 py-3 text-sm font-medium border-b-2 cursor-pointer ${
            tab === name
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-600"
        }`;


    // ================= RENDER =================

    return (
        <>
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-6">

                <div className="bg-white border border-gray-200 rounded-xl">

                    {/* TABS */}

                    <div className="flex border-b border-gray-200">

                        <button
                            type="button"
                            onClick={() => setTab("REQUESTS")}
                            className={tabClass("REQUESTS")}
                        >
                            Requests ({requests.length})
                        </button>

                        <button
                            type="button"
                            onClick={() => setTab("CONNECTIONS")}
                            className={tabClass("CONNECTIONS")}
                        >
                            Connections ({connected.length})
                        </button>

                    </div>


                    {loading && (
                        <p className="p-6 text-center text-gray-500">
                            Loading your network...
                        </p>
                    )}

                    {!loading && error && (
                        <p className="p-6 text-center text-red-500">{error}</p>
                    )}


                    {/* ================= REQUESTS ================= */}

                    {!loading && !error && tab === "REQUESTS" && (

                        requests.length === 0 ? (

                            <p className="p-8 text-center text-gray-500">
                                No pending requests.
                            </p>

                        ) : (

                            <ul className="divide-y divide-gray-200">

                                {requests.map((request) => {

                                    const displayName =
                                        request.name ||
                                        `User ${request.senderId ?? ""}`.trim();

                                    const busy = actingId === request.requestId;

                                    return (
                                        <li
                                            key={request.requestId}
                                            className="flex items-center gap-4 px-6 py-4"
                                        >

                                            <div
                                                className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                                                onClick={() => openProfile(request.senderId)}
                                            >
                                                <Avatar src={request.picture} name={displayName} />

                                                <div className="min-w-0">
                                                    <h2 className="font-semibold text-gray-800 truncate hover:underline">
                                                        {displayName}
                                                    </h2>

                                                    {request.bio && (
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {request.bio}
                                                        </p>
                                                    )}

                                                    {request.createdAt && (
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {formatDate(request.createdAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDecision(request.requestId, REJECT_STATUS)
                                                    }
                                                    disabled={busy}
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                                >
                                                    <X size={16} />
                                                    Reject
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDecision(request.requestId, ACCEPT_STATUS)
                                                    }
                                                    disabled={busy}
                                                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                                >
                                                    <Check size={16} />
                                                    {busy ? "Saving..." : "Accept"}
                                                </button>

                                            </div>

                                        </li>
                                    );
                                })}

                            </ul>
                        )
                    )}


                    {/* ================= CONNECTIONS ================= */}

                    {!loading && !error && tab === "CONNECTIONS" && (

                        connected.length === 0 ? (

                            <p className="p-8 text-center text-gray-500">
                                You have no connections yet.
                            </p>

                        ) : (

                            <ul className="divide-y divide-gray-200">

                                {connected.map((person) => {

                                    const displayName =
                                        person.name || `User ${person.userId ?? ""}`.trim();

                                    return (
                                        <li
                                            key={person.key}
                                            onClick={() => openProfile(person.userId)}
                                            className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50"
                                        >
                                            <Avatar src={person.picture} name={displayName} />

                                            <div className="min-w-0">
                                                <h2 className="font-semibold text-gray-800 truncate">
                                                    {displayName}
                                                </h2>

                                                {person.bio && (
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {person.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}

                            </ul>
                        )
                    )}

                </div>

            </div>
        </>
    );
};

export default MyNetwork;