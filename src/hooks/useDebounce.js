import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until the user stops typing.
 * @param {any} value  — the value to debounce (e.g., a search query string)
 * @param {number} delay — delay in milliseconds (default 500ms)
 * @returns debounced value
 *
 * Example usage:
 *   const debouncedQuery = useDebounce(searchQuery, 500);
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer that updates the debounced value after `delay` ms
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timer if the value changes before the delay is up
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
