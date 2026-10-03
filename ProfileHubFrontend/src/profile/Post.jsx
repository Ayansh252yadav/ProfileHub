import { useState } from "react";
import { Plus } from "lucide-react";
import { deletePost } from "../api/ProfileApi";
import PostModal from "./PostModel";
import PostCard from "./PostCard";

const Post = ({
  posts,
  onProfileUpdated,
  readOnly = false
}) => {

  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ================= DELETE POST =================
  const handleDeletePost = async (id) => {

    if (!id) {
      console.error("Post ID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(true);

      await deletePost(id);

      await onProfileUpdated();

    } catch (error) {

      console.error("Failed to delete post:", error);

      alert(
        error?.response?.data?.message ||
        "Failed to delete post"
      );

    } finally {

      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">

      {/* ================= POST SECTION ================= */}

      <div className="bg-white border border-gray-200 rounded-xl">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">

          <h2 className="text-xl font-semibold text-gray-800">
            Posts
          </h2>

          {!readOnly && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
              title="Create post"
            >
              <Plus size={22} />
            </button>
          )}

        </div>


        {/* ================= POSTS ================= */}

        <div className="p-6">

          {!posts || posts.length === 0 ? (

            <div className="text-center py-8">

              <p className="text-gray-500">
                No posts yet.
              </p>

              {!readOnly && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="mt-3 text-blue-600 hover:underline cursor-pointer"
                >
                  Create your first post
                </button>
              )}

            </div>

          ) : (

            <div className="space-y-6">

              {posts.map((post) => (

                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={readOnly ? undefined : handleDeletePost}
                  deleting={deleting}
                  readOnly={readOnly}
                />

              ))}

            </div>

          )}

        </div>

      </div>


      {/* ================= CREATE POST MODAL ================= */}

      {!readOnly && showModal && (
        <PostModal
          onClose={() => setShowModal(false)}
          onProfileUpdated={onProfileUpdated}
        />
      )}

    </div>
  );
};

export default Post;