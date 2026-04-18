import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const FALLBACK_IMG = 'https://via.placeholder.com/80x120/e2e8f0/64748b?text=📚';

/**
 * BorrowedPage — shows all currently borrowed books and borrow history.
 * Users can return books from here.
 */
const BorrowedPage = () => {
  const { borrowed, returnBook, user } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Please log in</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          You need to be logged in to view borrowed books.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Check if a book is overdue (past 14-day window)
  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          📖 Borrowed Books
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {borrowed.length === 0
            ? 'You have not borrowed any books yet.'
            : `${borrowed.length} book${borrowed.length !== 1 ? 's' : ''} currently borrowed`}
        </p>
      </div>

      {borrowed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="text-6xl">📕</div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            No borrowed books. Go explore and borrow something!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Explore Books
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {borrowed.map((book) => {
            const overdue = isOverdue(book.dueDate);
            return (
              <div
                key={book.id}
                className="flex gap-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md transition-shadow"
              >
                {/* Cover */}
                <img
                  src={book.thumbnail || FALLBACK_IMG}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded-lg flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/book/${book.id}`)}
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {book.authors?.join(', ')}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400 dark:text-slate-500">
                    <span>📅 Borrowed: {formatDate(book.borrowedAt)}</span>
                    <span className={overdue ? 'text-red-500 font-semibold' : ''}>
                      {overdue ? '⚠️ Overdue:' : '📆 Due:'} {formatDate(book.dueDate)}
                    </span>
                  </div>
                </div>

                {/* Return button */}
                <div className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => returnBook(book.id)}
                    className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl transition-colors"
                  >
                    Return
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BorrowedPage;
