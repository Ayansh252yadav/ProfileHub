import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { createComment, getComment, deleteComment } from "../api/ProfileApi";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Comment = ({
  postId,
  initialComments = [],
  commentCount = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [comments, setComments] = useState(initialComments);

  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= TOGGLE COMMENTS =================

  const handleToggleComments = () => {
    setIsOpen((prev) => !prev);
  };

  // ================= CREATE COMMENT =================

  const handleCreateComment = async () => {
    const text = commentText.trim();

    if (!text) {
      return;
    }

    try {
      setLoading(true);

      await createComment(postId, {
        comment: text,
      });

      setCommentText("");

      // Refresh comments after creating
      const data = await getComment(postId);

      setComments(data);
    } catch (error) {
      console.error("Failed to create comment:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to create comment"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE COMMENT =================

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteComment(commentId);

      // Refresh comments after deleting
      const data = await getComment(postId);

      setComments(data);
    } catch (error) {
      console.error("Failed to delete comment:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete comment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= TOGGLE BUTTON ================= */}

      <button
        type="button"
        onClick={handleToggleComments}
        className={`flex items-center gap-2 transition cursor-pointer ${
          isOpen
            ? "text-blue-600"
            : "text-gray-600 hover:text-blue-600"
        }`}
      >
        <MessageCircle size={20} />

        <span>
          Comment{commentCount > 0 ? ` ${commentCount}` : ""}
        </span>
      </button>

      {/* ================= COMMENT SECTION ================= */}

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">

          <CommentForm
            value={commentText}
            onChange={setCommentText}
            onSubmit={handleCreateComment}
            disabled={loading}
          />

          <CommentList
            comments={comments}
            loading={loading}
            onDelete={handleDeleteComment}
          />

        </div>
      )}
    </>
  );
};

export default Comment;