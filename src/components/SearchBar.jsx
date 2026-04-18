import React from 'react';

/**
 * SearchBar — controlled input used on the Home page.
 * The parent manages the query state; this component just renders and fires onChange.
 */
const SearchBar = ({ value, onChange, placeholder = 'Search books by title or author...' }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search icon */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 shadow-sm text-sm
          bg-white text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-500
          transition-all duration-200
        "
      />

      {/* Clear button — only shows when there is text */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
