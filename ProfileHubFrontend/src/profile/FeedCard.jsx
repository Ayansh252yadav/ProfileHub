import { useNavigate } from "react-router-dom";

import {
    UserPlus,
    UserCheck
} from "lucide-react";

import { formatDate } from "../utils/formatDate";
import { sameId } from "../utils/connectionStatus";

import LikeCount from "./LikeCount";
import Comment from "./Comment";


// Connection state now comes from Feed (single source of truth):
//   connectionStatus  : NONE | PENDING | REQUEST_RECEIVED | CONNECTED
//   connectionLoading : true while this author's request is sending
//   onConnect(authorId)

const FeedCard = ({
    post,
    currentUserId,
    connectionStatus = "NONE",
    connectionLoading = false,
    onConnect
}) => {

    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate(`/profile/${post.authorId}`);
    };

    // Hide the button on your own posts, or until we know who you are
    const showConnect =
        currentUserId &&
        post.authorId &&
        !sameId(currentUserId, post.authorId);

    const buttonStyle =
        connectionStatus === "CONNECTED"
            ? "bg-green-100 text-green-700 cursor-default"
            : connectionStatus === "PENDING"
            ? "bg-gray-100 text-gray-700 cursor-default"
            : connectionStatus === "REQUEST_RECEIVED"
            ? "bg-blue-100 text-blue-700 cursor-default"
            : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer";

    return (

        <div className="bg-white border border-gray-200 rounded-xl p-5">

            {/* ================= AUTHOR ================= */}

            <div className="flex items-center justify-between">

                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={handleProfileClick}
                >

                    {post.authorProfilePicture ? (
                        <img
                            src={post.authorProfilePicture}
                            alt={post.authorName || "User"}
                            className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-semibold">
                                {post.authorName?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-gray-800 hover:underline">
                            {post.authorName}
                        </h3>

                        {post.createdAt && (
                            <p className="text-sm text-gray-500">
                                {formatDate(post.createdAt)}
                            </p>
                        )}
                    </div>

                </div>


                {/* ================= CONNECTION BUTTON ================= */}

                {showConnect && (

                    <button
                        type="button"
                        onClick={() => onConnect?.(post.authorId)}
                        disabled={
                            connectionLoading ||
                            connectionStatus !== "NONE"
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-100 ${buttonStyle}`}
                    >

                        {connectionLoading ? (
                            "Sending..."
                        ) : connectionStatus === "CONNECTED" ? (
                            <>
                                <UserCheck size={16} />
                                Connected
                            </>
                        ) : connectionStatus === "PENDING" ? (
                            "Pending"
                        ) : connectionStatus === "REQUEST_RECEIVED" ? (
                            "Request Received"
                        ) : (
                            <>
                                <UserPlus size={16} />
                                Connect
                            </>
                        )}

                    </button>

                )}

            </div>


            {/* ================= POST CONTENT ================= */}

            <div className="mt-4">

                {post.title && (
                    <h2 className="text-lg font-semibold text-gray-800">
                        {post.title}
                    </h2>
                )}

                {post.body && (
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                        {post.body}
                    </p>
                )}

            </div>


            {/* ================= MEDIA ================= */}

            {post.media && post.mediaType === "IMAGE" && (
                <div className="mt-4">
                    <img
                        src={post.media}
                        alt={post.title || "Post"}
                        className="w-full max-h-[500px] object-contain rounded-lg border border-gray-200"
                    />
                </div>
            )}

            {post.media && post.mediaType === "VIDEO" && (
                <div className="mt-4">
                    <video
                        src={post.media}
                        controls
                        className="w-full max-h-[500px] rounded-lg border border-gray-200"
                    />
                </div>
            )}


            {/* ================= ACTIONS ================= */}

            <div className="mt-5 pt-4 border-t border-gray-200 flex items-center gap-6">

                <LikeCount
                    postId={post.postId}
                    initialCount={post.likeCount}
                    initialLiked={post.likedByCurrentUser}
                />

                <Comment
                    postId={post.postId}
                    initialComments={post.commentResponseDto || []}
                    commentCount={post.commentCount || 0}
                />

            </div>

        </div>
    );
};

export default FeedCard;