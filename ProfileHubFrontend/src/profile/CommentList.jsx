import { Trash2 } from "lucide-react";

const CommentList = ({
  comments = [],
  loading,
  onDelete
}) => {

  if (loading) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        Loading comments...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">

      {comments.map((comment) => (

        <div
          key={comment.id}
          className="flex items-start justify-between gap-3"
        >

          {/* Comment */}
          <div className="flex gap-3">

            {/* Profile picture */}
            {comment.profilePicture ? (
              <img
                src={comment.profilePicture}
                alt={comment.userName || "User"}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-500">
                  {comment.userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}

            <div>

              <p className="font-medium text-sm text-gray-800">
                {comment.userName}
              </p>

              <p className="text-sm text-gray-700">
                {comment.comment}
              </p>

            </div>

          </div>

          {/* Delete button */}
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition"
            title="Delete comment"
          >
            <Trash2 size={16} />
          </button>

        </div>

      ))}

    </div>
  );
};

export default CommentList;