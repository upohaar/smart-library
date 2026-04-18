import { useState } from 'react';

/**
 * useLocalStorage — a useState wrapper that syncs state to localStorage.
 * @param {string} key — the localStorage key
 * @param {any} initialValue — default value if key doesn't exist yet
 * @returns [storedValue, setValue] — just like useState
 *
 * Example usage:
 *   const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function (same as useState setter)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error('useLocalStorage error:', err);
    }
  };

  return [storedValue, setValue];
};

export default useLocalStorage;
