import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";

import {
    getPendingRequests,
    updateConnectionStatus
} from "../api/ProfileApi";

import { formatDate } from "../utils/formatDate";
import Navbar from "../LandingPages/Navbar";

// =========================================================
// CONFIG: must match what your backend expects in
// PUT /connection/approved/{status}/{requestId}
// =========================================================
const ACCEPT_STATUS = "ACCEPTED";
const REJECT_STATUS = "REJECTED";


// =========================================================
// Backend field names are unknown, so accept common variants.
// If your response uses other names, change them here only.
// =========================================================
const normalizeRequest = (r) => ({
    requestId: r.requestId ?? r.id,
    senderId: r.senderId ?? r.sender?.userId ?? r.sender?.id,
    name:
        r.senderName ??
        r.name ??
        r.sender?.name ??
        null,
    picture:
        r.senderProfilePicture ??
        r.profilePicture ??
        r.sender?.profilePicture ??
        null,
    bio: r.senderBio ?? r.bio ?? r.sender?.bio ?? null,
    createdAt: r.createdAt ?? r.requestedAt ?? null
});


const ConnectionRequests = () => {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // requestId currently being accepted / rejected
    const [actingId, setActingId] = useState(null);


    // ================= LOAD PENDING REQUESTS =================

    useEffect(() => {

        let cancelled = false;

        const loadRequests = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getPendingRequests();

                if (cancelled) return;

                setRequests(
                    Array.isArray(data)
                        ? data.map(normalizeRequest)
                        : []
                );

            } catch (err) {

                console.error("Failed to load requests:", err);

                if (!cancelled) {
                    setError("Failed to load connection requests.");
                }

            } finally {

                if (!cancelled) setLoading(false);

            }
        };

        loadRequests();

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

            // Request is no longer pending: remove it from the list
            setRequests((prev) =>
                prev.filter((r) => r.requestId !== requestId)
            );

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


    const openProfile = (senderId) => {
        if (senderId) navigate(`/profile/${senderId}`);
    };


    // ================= RENDER =================

    return (
        <>
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-6">

                <div className="bg-white border border-gray-200 rounded-xl">

                    <div className="px-6 py-4 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-800">
                            Connection requests
                            {!loading && !error && requests.length > 0 && (
                                <span className="ml-2 text-gray-500 font-normal">
                                    ({requests.length})
                                </span>
                            )}
                        </h1>
                    </div>


                    {loading && (
                        <p className="p-6 text-center text-gray-500">
                            Loading requests...
                        </p>
                    )}

                    {!loading && error && (
                        <p className="p-6 text-center text-red-500">
                            {error}
                        </p>
                    )}

                    {!loading && !error && requests.length === 0 && (
                        <p className="p-8 text-center text-gray-500">
                            No pending requests.
                        </p>
                    )}


                    {!loading && !error && requests.length > 0 && (

                        <ul className="divide-y divide-gray-200">

                            {requests.map((request) => {

                                const displayName =
                                    request.name ||
                                    `User ${request.senderId ?? ""}`.trim();

                                const busy =
                                    actingId === request.requestId;

                                return (
                                    <li
                                        key={request.requestId}
                                        className="flex items-center gap-4 px-6 py-4"
                                    >

                                        {/* AVATAR + NAME (opens sender profile) */}

                                        <div
                                            className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                                            onClick={() =>
                                                openProfile(request.senderId)
                                            }
                                        >

                                            {request.picture ? (
                                                <img
                                                    src={request.picture}
                                                    alt={displayName}
                                                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-500">
                                                    {displayName
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}

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
                                                        {formatDate(
                                                            request.createdAt
                                                        )}
                                                    </p>
                                                )}

                                            </div>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="flex items-center gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDecision(
                                                        request.requestId,
                                                        REJECT_STATUS
                                                    )
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
                                                    handleDecision(
                                                        request.requestId,
                                                        ACCEPT_STATUS
                                                    )
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

                    )}

                </div>

            </div>
        </>
    );
};

export default ConnectionRequests;