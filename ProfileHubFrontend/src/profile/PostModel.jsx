import { useState } from "react";
import { X, Image, Video } from "lucide-react";
import { createPost } from "../api/ProfileApi";

const PostModal = ({ onClose, onProfileUpdated }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState(null);
  const [saving, setSaving] = useState(false);

  // ================= MEDIA VALIDATION =================
  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Only image or video files are allowed");
      e.target.value = "";
      return;
    }

    setMedia(file);
  };

  // ================= CREATE POST =================
  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!title.trim() && !body.trim() && !media) {
      alert("Please add some content to your post");
      return;
    }

    try {
      setSaving(true);

      await createPost({
        title: title.trim(),
        body: body.trim(),
        media: media,
      });

      setTitle("");
      setBody("");
      setMedia(null);

      onClose();

      await onProfileUpdated();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(error?.response?.data?.message || "Failed to create post");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setTitle("");
    setBody("");
    setMedia(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Create Post</h2>

          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleCreatePost} className="p-6">
          {/* TITLE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BODY */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What do you want to talk about?"
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* MEDIA */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add media
            </label>

            <div className="flex gap-3">
              {/* IMAGE */}
              <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50">
                <Image size={18} />
                <span>Image</span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </label>

              {/* VIDEO */}
              <label className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50">
                <Video size={18} />
                <span>Video</span>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* SELECTED FILE */}
            {media && (
              <div className="mt-3 flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  {media.type.startsWith("image/") ? (
                    <Image size={18} />
                  ) : (
                    <Video size={18} />
                  )}

                  <span className="text-sm text-gray-600 truncate">
                    {media.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMedia(null)}
                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;