import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ThemeToggle from './ThemeToggle';
import PointsBadge from './PointsBadge';

/**
 * Navbar — top navigation bar with links, theme toggle, points badge, and auth button.
 * Collapses to a hamburger menu on mobile.
 */
const Navbar = () => {
  const { user, logout, favorites, borrowed } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: '🏠 Home' },
    { to: '/favorites', label: `❤️ Favorites (${favorites.length})` },
    { to: '/borrowed', label: `📖 Borrowed (${borrowed.length})` },
    ...(user ? [{ to: '/dashboard', label: '📊 Dashboard' }] : []),
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
            <span className="text-2xl">📚</span>
            <span className="hidden sm:inline">Digital Library</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(link.to)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: theme + points + auth */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user && <PointsBadge />}

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  👤 {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:inline-flex px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Login
              </Link>
            )}

            {/* Hamburger toggle (mobile) */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(link.to)
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 px-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">👤 {user.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 dark:text-red-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
