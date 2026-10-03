import { Send } from "lucide-react";

const CommentForm = ({ value, onChange, onSubmit, disabled }) => {
  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
        placeholder="Write a comment..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full cursor-pointer disabled:opacity-50"
        title="Send comment"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default CommentForm;