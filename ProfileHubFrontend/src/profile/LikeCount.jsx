import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { likeCount, getLikeCount } from "../api/ProfileApi";

const LikeCount = ({ postId, initialCount = 0, initialLiked = false }) => {
  // ================= LIKE STATES =================
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  // ================= GET LIKE COUNT =================
  useEffect(() => {
    const fetchLikeCount = async () => {
      try {
        const totalLikes = await getLikeCount(postId);

        setCount(totalLikes);
      } catch (error) {
        console.error("Failed to fetch like count:", error);
      }
    };

    if (postId) {
      fetchLikeCount();
    }
  }, [postId]);

  // ================= LIKE POST =================
  const handleLike = async () => {
    // Already liked — nothing to do (no unlike endpoint yet)
    if (liked || loading) {
      return;
    }

    try {
      setLoading(true);

      const newCount = await likeCount(postId);

      setCount(newCount);
      setLiked(true);
    } catch (error) {
      console.error("Failed to like post:", error);

      // Backend throws on duplicate like
      if (error?.response?.status === 409) {
        setLiked(true);
      } else {
        alert(error?.response?.data?.message || "Failed to like post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading || liked}
      title={liked ? "You liked this post" : "Like this post"}
      className={`flex items-center gap-2 transition cursor-pointer disabled:cursor-default ${
        liked ? "text-red-600" : "text-gray-600 hover:text-red-600"
      }`}
    >
      <Heart size={20} fill={liked ? "currentColor" : "none"} />
      <span>{count}</span>
    </button>
  );
};

export default LikeCount;