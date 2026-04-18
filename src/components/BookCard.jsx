import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Fallback cover image when Google Books has no thumbnail
const FALLBACK_IMG = 'https://via.placeholder.com/128x192/e2e8f0/64748b?text=No+Cover';

/**
 * BookCard — displays a single book in the grid.
 * Shows cover, title, author, rating, and favorite/borrow action buttons.
 */
const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isBorrowed, borrowBook, user } = useApp();

  const favorite = isFavorite(book.id);
  const borrowed = isBorrowed(book.id);

  const handleFavorite = (e) => {
    e.stopPropagation(); // Don't navigate to detail page
    if (!user) {
      navigate('/login');
      return;
    }
    toggleFavorite(book);
  };

  const handleBorrow = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    borrowBook(book);
  };

  return (
    <div
      onClick={() => navigate(`/book/${book.id}`)}
      className="
        group flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100
        dark:border-slate-700 overflow-hidden cursor-pointer
        hover:shadow-lg hover:-translate-y-1 transition-all duration-200
      "
    >
      {/* Book cover */}
      <div className="relative bg-slate-100 dark:bg-slate-700 h-52 flex items-center justify-center overflow-hidden">
        <img
          src={book.thumbnail || FALLBACK_IMG}
          alt={book.title}
          className="h-full w-auto object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />

        {/* Favorite button (heart) */}
        <button
          onClick={handleFavorite}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="
            absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
            bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow
            hover:scale-110 transition-transform
          "
        >
          {favorite ? '❤️' : '🤍'}
        </button>

        {/* "Borrowed" badge */}
        {borrowed && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Borrowed
          </span>
        )}
      </div>

      {/* Book info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2">
          {book.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
          {book.authors.join(', ')}
        </p>

        {/* Star rating */}
        {book.averageRating && (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            {'★'.repeat(Math.round(book.averageRating))}
            {'☆'.repeat(5 - Math.round(book.averageRating))}
            <span className="text-slate-400 dark:text-slate-500 ml-1">
              ({book.ratingsCount})
            </span>
          </div>
        )}

        {/* Description snippet */}
        <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 flex-1">
          {book.description}
        </p>

        {/* Borrow button */}
        <button
          onClick={handleBorrow}
          disabled={borrowed}
          className={`
            mt-auto w-full py-2 rounded-lg text-xs font-semibold transition-colors
            ${borrowed
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-default'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {borrowed ? '✓ Borrowed' : '📖 Borrow'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
