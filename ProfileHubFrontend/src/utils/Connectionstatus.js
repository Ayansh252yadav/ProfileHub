// Shared by Feed.jsx (and UserProfile.jsx if you want the same logic there)

export const sameId = (a, b) =>
    a !== undefined && a !== null &&
    b !== undefined && b !== null &&
    String(a) === String(b);

/**
 * Returns: "NONE" | "PENDING" | "REQUEST_RECEIVED" | "CONNECTED"
 * between the logged-in user (me) and another user (otherId).
 */
export const getConnectionStatus = (connections, me, otherId) => {

    if (!me || !otherId || sameId(me, otherId)) {
        return "NONE";
    }

    const connection = (connections || []).find((item) =>
        (sameId(item.senderId, me) && sameId(item.receiverId, otherId)) ||
        (sameId(item.receiverId, me) && sameId(item.senderId, otherId))
    );

    if (!connection) return "NONE";

    const status = connection.connectionRequestStatus;

    if (status === "ACCEPTED") return "CONNECTED";

    if (status === "PENDING") {
        return sameId(connection.senderId, me)
            ? "PENDING"
            : "REQUEST_RECEIVED";
    }

    // Rejected / cancelled
    return "NONE";
};