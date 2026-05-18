import React, { useState } from 'react';
import { useApp } from '../context/AppContext';   // ✅ useApp, not useAppContext

const CommentsPage = () => {
  const { comments, addComment, loading } = useApp();
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500 dark:text-slate-400">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-slate-100">
        📝 Readers’ Favourite Lines
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Share a line from a book that stayed with you.
      </p>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-white dark:bg-slate-800 rounded-xl shadow-md p-5">
        <textarea
          className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg 
                     bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="“It is only with the heart that one can see rightly...” — The Little Prince"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Post Comment 💬
          </button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <span className="text-4xl">💭</span>
            <p className="text-slate-500 dark:text-slate-400 mt-2">No comments yet. Be the first!</p>
          </div>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
            <p className="text-slate-700 dark:text-slate-200 text-lg italic">“{comment.text}”</p>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-400 dark:text-slate-500">
              <span>📅</span>
              <span>{new Date(comment.date).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsPage;