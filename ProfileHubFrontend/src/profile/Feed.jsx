import { useEffect, useState } from "react";

import {
  getFeed,
  getMyProfile,
  getConnections,
  requestConnection
} from "../api/ProfileApi";

import {
  getConnectionStatus,
  sameId
} from "../utils/connectionStatus";

import FeedCard from "./FeedCard";

const Feed = () => {

  const [feed, setFeed] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [connections, setConnections] = useState([]);

  // authorId currently being sent a request
  const [connectingId, setConnectingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ================= LOAD FEED + ME + CONNECTIONS (once) =================

  useEffect(() => {

    let cancelled = false;

    const loadFeed = async () => {

      try {

        setLoading(true);

        const [feedData, me, connectionData] = await Promise.all([
          getFeed(),
          getMyProfile().catch(() => null),
          getConnections().catch(() => [])
        ]);

        if (cancelled) return;

        setFeed(Array.isArray(feedData) ? feedData : []);
        setCurrentUser(me);
        setConnections(Array.isArray(connectionData) ? connectionData : []);

      } catch (err) {

        console.error("Failed to fetch feed:", err);

        if (!cancelled) setError("Failed to load feed");

      } finally {

        if (!cancelled) setLoading(false);

      }
    };

    loadFeed();

    return () => {
      cancelled = true;
    };

  }, []);


  // ================= SEND CONNECTION REQUEST =================
  // One handler for the whole feed, so every post by the same
  // author switches to "Pending" together.

  const handleConnect = async (authorId) => {

    const me = currentUser?.userId;

    if (!me || !authorId || sameId(me, authorId)) return;

    if (getConnectionStatus(connections, me, authorId) !== "NONE") return;

    try {

      setConnectingId(authorId);

      const response = await requestConnection(authorId);

      // Show "Pending" immediately
      setConnections((prev) => [
        ...prev,
        {
          requestId: response?.requestId,
          senderId: me,
          receiverId: authorId,
          connectionRequestStatus: "PENDING"
        }
      ]);

      // Then sync with the server (keeps feed and profile page in agreement)
      try {
        setConnections(await getConnections());
      } catch (syncError) {
        console.error("Failed to refresh connections:", syncError);
      }

    } catch (err) {

      console.error("Connection request failed:", err);

      alert(
        err?.response?.data?.message ||
        "Could not send the request. Please try again."
      );

    } finally {

      setConnectingId(null);

    }
  };


  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500">Loading feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500">No posts available</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-5 space-y-5">
      {feed.map((post) => (
        <FeedCard
          key={post.postId}
          post={post}
          currentUserId={currentUser?.userId}
          connectionStatus={getConnectionStatus(
            connections,
            currentUser?.userId,
            post.authorId
          )}
          connectionLoading={sameId(connectingId, post.authorId)}
          onConnect={handleConnect}
        />
      ))}
    </div>
  );
};

export default Feed;