import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { POINTS_CONFIG, getCurrentBadge } from '../utils/gamification';

// Create the context
const AppContext = createContext(null);

/**
 * AppProvider wraps the entire app and provides global state:
 * - user (logged-in user info)
 * - favorites (list of favorite books)
 * - borrowed (list of borrowed books with timestamps)
 * - theme (dark / light)
 * - points & badge (gamification)
 */
export const AppProvider = ({ children }) => {
  // --- Auth state ---
  const [user, setUser] = useState(() => getFromStorage(STORAGE_KEYS.USER, null));

  // --- Favorites ---
  const [favorites, setFavorites] = useState(() =>
    getFromStorage(STORAGE_KEYS.FAVORITES, [])
  );

  // --- Borrowed books ---
  const [borrowed, setBorrowed] = useState(() =>
    getFromStorage(STORAGE_KEYS.BORROWED, [])
  );

  // --- Theme ---
  const [theme, setTheme] = useState(() =>
    getFromStorage(STORAGE_KEYS.THEME, 'light')
  );

  // --- Points (gamification) ---
  const [points, setPoints] = useState(() =>
    getFromStorage(STORAGE_KEYS.POINTS, 0)
  );

  // Apply dark class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveToStorage(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist favorites
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  // Persist borrowed
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BORROWED, borrowed);
  }, [borrowed]);

  // Persist points
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.POINTS, points);
  }, [points]);

  // ----- Auth actions -----
  const login = useCallback((username, password) => {
    // Fake authentication — any non-empty username/password works
    if (!username.trim() || !password.trim()) {
      return { success: false, message: 'Please fill in all fields.' };
    }
    const userData = { username, loginTime: new Date().toISOString() };
    setUser(userData);
    saveToStorage(STORAGE_KEYS.USER, userData);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveToStorage(STORAGE_KEYS.USER, null);
  }, []);

  // ----- Favorites actions -----
  const isFavorite = useCallback(
    (bookId) => favorites.some((b) => b.id === bookId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (book) => {
      setFavorites((prev) => {
        const exists = prev.some((b) => b.id === book.id);
        if (exists) {
          // Remove from favorites
          setPoints((p) => Math.max(0, p + POINTS_CONFIG.REMOVE_FAVORITE));
          return prev.filter((b) => b.id !== book.id);
        } else {
          // Add to favorites
          setPoints((p) => p + POINTS_CONFIG.ADD_FAVORITE);
          return [...prev, { ...book, addedAt: new Date().toISOString() }];
        }
      });
    },
    []
  );

  // ----- Borrow actions -----
  const isBorrowed = useCallback(
    (bookId) => borrowed.some((b) => b.id === bookId),
    [borrowed]
  );

  const borrowBook = useCallback(
    (book) => {
      if (isBorrowed(book.id)) return;
      setBorrowed((prev) => [
        ...prev,
        {
          ...book,
          borrowedAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        },
      ]);
      setPoints((p) => p + POINTS_CONFIG.BORROW_BOOK);
    },
    [isBorrowed]
  );

  const returnBook = useCallback(
    (bookId) => {
      setBorrowed((prev) => prev.filter((b) => b.id !== bookId));
      setPoints((p) => p + POINTS_CONFIG.RETURN_BOOK);
    },
    []
  );

  // ----- Theme toggle -----
  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  // Derive current badge from points
  const badge = getCurrentBadge(points);

  const value = {
    user,
    login,
    logout,
    favorites,
    isFavorite,
    toggleFavorite,
    borrowed,
    isBorrowed,
    borrowBook,
    returnBook,
    theme,
    toggleTheme,
    points,
    badge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for consuming context
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
