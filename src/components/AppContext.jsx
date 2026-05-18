import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // ... your existing state (books, borrowed, favorites, points, etc.)

  // NEW: comments state
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load comments from localStorage (demo) or from API
  useEffect(() => {
    // Option A: localStorage (only for demo, not shared)
    const stored = localStorage.getItem('userComments');
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      // Option B: fetch from a real backend (example using fetch)
      // fetch('/api/comments')
      //   .then(res => res.json())
      //   .then(data => setComments(data))
      //   .finally(() => setLoading(false));
      setLoading(false);
    }
    setLoading(false);
  }, []);

  const addComment = (text) => {
    const newComment = {
      id: Date.now(),
      text,
      date: new Date().toISOString(),
    };
    const updated = [newComment, ...comments];

    // Option A: localStorage
    localStorage.setItem('userComments', JSON.stringify(updated));
    setComments(updated);

    // Option B: POST to backend (fetch('/api/comments', { method: 'POST', body: JSON.stringify(newComment) }))
  };

  const value = {
    // ... your existing values
    comments,
    addComment,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};