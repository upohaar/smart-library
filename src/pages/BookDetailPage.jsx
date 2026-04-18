import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const FALLBACK_IMG = 'https://via.placeholder.com/200x300/e2e8f0/64748b?text=No+Cover';

/**
 * BookDetailPage — fetches full details for a single book by its Google Books ID.
 * Provides favorite and borrow actions.
 */
const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite, isBorrowed, borrowBook, returnBook } = useApp();

  const [book, setBook]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        if (!res.ok) throw new Error('Book not found.');
        const data = await res.json();
        const info = data.volumeInfo || {};
        setBook({
          id: data.id,
          title: info.title || 'Untitled',
          authors: info.authors || ['Unknown Author'],
          description: info.description || 'No description available.',
          thumbnail: info.imageLinks?.large || info.imageLinks?.thumbnail || null,
          publisher: info.publisher || 'Unknown Publisher',
          publishedDate: info.publishedDate || 'N/A',
          pageCount: info.pageCount || null,
          categories: info.categories || [],
          averageRating: info.averageRating || null,
          ratingsCount: info.ratingsCount || 0,
          previewLink: info.previewLink || null,
          language: info.language || 'en',
          isbn: info.industryIdentifiers?.[0]?.identifier || 'N/A',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading book details..." />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-lg">⚠️ {error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const favorite = isFavorite(book.id);
  const borrowed = isBorrowed(book.id);

  const handleFavorite = () => {
    if (!user) { navigate('/login'); return; }
    toggleFavorite(book);
  };

  const handleBorrow = () => {
    if (!user) { navigate('/login'); return; }
    if (borrowed) {
      returnBook(book.id);
    } else {
      borrowBook(book);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Cover */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <img
            src={book.thumbnail || FALLBACK_IMG}
            alt={book.title}
            className="w-48 rounded-xl shadow-lg"
            onError={(e) => { e.target.src = FALLBACK_IMG; }}
          />

          {/* Action buttons */}
          <button
            onClick={handleFavorite}
            className={`
              w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2
              ${favorite
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300'
              }
            `}
          >
            {favorite ? '❤️ Remove Favorite' : '🤍 Add to Favorites'}
          </button>

          <button
            onClick={handleBorrow}
            className={`
              w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2
              ${borrowed
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {borrowed ? '✓ Return Book' : '📖 Borrow Book'}
          </button>

          {book.previewLink && (
            <a
              href={book.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 text-center rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-400 transition-colors"
            >
              🔗 Preview on Google
            </a>
          )}
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2">
            {book.title}
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
            by {book.authors.join(', ')}
          </p>

          {/* Star rating */}
          {book.averageRating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber-500 text-lg">
                {'★'.repeat(Math.round(book.averageRating))}
                {'☆'.repeat(5 - Math.round(book.averageRating))}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {book.averageRating} ({book.ratingsCount} ratings)
              </span>
            </div>
          )}

          {/* Meta info grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Publisher', value: book.publisher },
              { label: 'Published', value: book.publishedDate },
              { label: 'Pages', value: book.pageCount || 'N/A' },
              { label: 'Language', value: book.language?.toUpperCase() },
              { label: 'ISBN', value: book.isbn },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Categories */}
          {book.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {book.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-100 dark:border-blue-800"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Description</h2>
            <p
              className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: book.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
