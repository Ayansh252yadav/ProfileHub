import { Trash2 } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import Comment from "./Comment";
import LikeCount from "./LikeCount";

const PostCard = ({
  post,
  onDelete,
  deleting,
  readOnly = false
}) => {

  return (
    <div className="border border-gray-200 rounded-xl p-5">

      {/* ================= POST HEADER ================= */}

      <div className="flex items-start justify-between">

        <div>

          <h3 className="font-semibold text-lg text-gray-800">
            {post.title}
          </h3>

          {post.createdAt && (
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(post.createdAt)}
            </p>
          )}

        </div>


        {/* ================= DELETE POST ================= */}

        {!readOnly && post.id && (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            disabled={deleting}
            title="Delete post"
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={18} />
          </button>
        )}

      </div>


      {/* ================= POST BODY ================= */}

      {post.body && (
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">
          {post.body}
        </p>
      )}


      {/* ================= IMAGE ================= */}

      {post.media && post.mediaType === "IMAGE" && (

        <div className="mt-4">

          <img
            src={post.media}
            alt={post.title || "Post"}
            className="w-full max-h-[500px] object-contain rounded-lg border border-gray-200"
          />

        </div>

      )}


      {/* ================= VIDEO ================= */}

      {post.media && post.mediaType === "VIDEO" && (

        <div className="mt-4">

          <video
            src={post.media}
            controls
            className="w-full max-h-[500px] rounded-lg border border-gray-200"
          />

        </div>

      )}


      {/* ================= LIKE + COMMENTS ================= */}

      <div className="mt-5 pt-4 border-t border-gray-200 flex items-center gap-6">

        <LikeCount
          postId={post.id}
          initialCount={post.likeCount}
          initialLiked={post.likedByCurrentUser}
        />

        <Comment
          postId={post.id}
        />

      </div>

    </div>
  );
};

export default PostCard;