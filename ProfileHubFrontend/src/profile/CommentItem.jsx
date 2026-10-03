const CommentItem = ({ comment, onDelete }) => {
  return (
    <div className="flex gap-3 bg-gray-50 rounded-lg p-3">
      {/* PROFILE PICTURE */}
      {comment.profilePicture ? (
        <img
          src={comment.profilePicture}
          alt={comment.userName}
          className="w-9 h-9 rounded-full object-cover"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-600">
          {comment.userName?.charAt(0)?.toUpperCase()}
        </div>
      )}

      {/* COMMENT CONTENT */}
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800">
          {comment.userName}
        </p>

        <p className="text-sm text-gray-700 mt-1">{comment.comment}</p>

        <button
          type="button"
          onClick={() => onDelete(comment.id)}
          className="text-xs text-gray-500 hover:text-red-600 mt-2 cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CommentItem;