import React, { useState, useRef } from 'react';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useDebounce from '../hooks/useDebounce';
import useGoogleBooks from '../hooks/useGoogleBooks';
import { useApp } from '../context/AppContext';

// Default query shown when the user hasn't searched for anything yet
const DEFAULT_QUERY = 'programming computer science';

// Categories used for the Recommendation System
const CATEGORIES = [
  'Fiction', 'Science', 'History', 'Technology', 'Philosophy',
  'Biography', 'Art', 'Mathematics', 'Psychology', 'Business',
];

/**
 * HomePage — main landing page with search, book grid, and recommendations.
 */
const HomePage = () => {
  const { favorites } = useApp();
  const [searchInput, setSearchInput] = useState('');

  // Debounce the raw input so we only hit the API after the user stops typing
  const debouncedSearch = useDebounce(searchInput, 500);

  // If user has searched, use that; otherwise load default popular books
  const activeQuery = debouncedSearch.trim() || DEFAULT_QUERY;
  const { books, loading, error, fetchMore, hasMore } = useGoogleBooks(activeQuery, 20);

  // ----- Recommendation System -----
  // Derive the user's preferred categories from their favorites list
  const preferredCategories = React.useMemo(() => {
    const cats = favorites.flatMap((b) => b.categories || []);
    const counts = cats.reduce((acc, c) => { acc[c] = (acc[c] || 0) + 1; return acc; }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [favorites]);

  // Stable random category — picked once on mount, never re-randomised on re-render
  const fallbackCategory = useRef(
    CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
  ).current;
  const recommendedCategory = preferredCategories[0] || fallbackCategory;

  const {
    books: recommendedBooks,
    loading: recLoading,
  } = useGoogleBooks(
    debouncedSearch ? '' : recommendedCategory, // Only show when not searching
    8
  );

  const isSearching = !!debouncedSearch.trim();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Hero section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          📚 Digital Library
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto mb-8">
          Discover, borrow, and track millions of books — all in one place.
        </p>
        <SearchBar value={searchInput} onChange={setSearchInput} />
      </div>

      {/* ---- Recommendation Section (only when not searching) ---- */}
      <div
        className="overflow-hidden transition-all duration-700 ease-in-out"
        style={{ maxHeight: isSearching ? '0px' : '800px', opacity: isSearching ? 0 : 1 }}
      >
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              ⭐ Recommended for You
            </h2>
            <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              {preferredCategories.length > 0
                ? `Based on your favorites · ${recommendedCategory}`
                : recommendedCategory}
            </span>
          </div>

          {recLoading ? (
            <LoadingSpinner message="Loading recommendations..." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
              {recommendedBooks.slice(0, 8).map((book) => (
                <div key={book.id} className="rec-card-enter">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ---- Category filter chips ---- */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSearchInput(cat)}
              className="px-3 py-1.5 text-sm rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Main book grid ---- */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          {isSearching ? `🔍 Results for "${debouncedSearch}"` : '🔥 Popular Books'}
        </h2>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <span className="text-red-600 dark:text-red-400 text-sm">⚠️ {error}</span>
            <button
              onClick={() => fetchMore()}
              className="px-4 py-1.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading state (first load) */}
        {loading && books.length === 0 && (
          <LoadingSpinner message="Fetching books..." />
        )}

        {/* Empty state */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <div className="text-5xl mb-3">🔍</div>
            <p>No books found. Try a different search term.</p>
          </div>
        )}

        {/* Book grid */}
        {books.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Load more button */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={fetchMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Books'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
