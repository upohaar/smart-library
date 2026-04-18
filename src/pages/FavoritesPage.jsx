import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import BookCard from '../components/BookCard';

/**
 * FavoritesPage — shows all books the user has marked as favorite.
 */
const FavoritesPage = () => {
  const { favorites, user } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Please log in
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          You need to be logged in to view your favorites.
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          ❤️ My Favorites
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {favorites.length === 0
            ? 'No favorites yet — start exploring!'
            : `${favorites.length} book${favorites.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="text-6xl">📚</div>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Your favorites list is empty.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Explore Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
