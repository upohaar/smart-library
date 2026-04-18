import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

// In-memory cache: cacheKey -> { items, timestamp }
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const normalizeBook = (item) => {
  const info = item.volumeInfo || {};
  return {
    id: item.id,
    title: info.title || 'Untitled',
    authors: info.authors || ['Unknown Author'],
    description: info.description || 'No description available.',
    thumbnail:
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      null,
    publisher: info.publisher || 'Unknown Publisher',
    publishedDate: info.publishedDate || 'N/A',
    pageCount: info.pageCount || null,
    categories: info.categories || [],
    averageRating: info.averageRating || null,
    ratingsCount: info.ratingsCount || 0,
    previewLink: info.previewLink || null,
    language: info.language || 'en',
  };
};

const fetchWithRetry = async (url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res;
    if (res.status !== 503 && res.status !== 429) {
      const msg =
        res.status === 403
          ? 'API access denied. Please add a Google Books API key.'
          : `API error: ${res.status}`;
      throw new Error(msg);
    }
    if (attempt < retries) await new Promise((r) => setTimeout(r, attempt * 1500));
    else {
      const msg =
        res.status === 429
          ? 'Too many requests. Please wait a moment and try again.'
          : 'Google Books is temporarily unavailable. Please try again in a moment.';
      throw new Error(msg);
    }
  }
};

const useGoogleBooks = (query, maxResults = 20) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(
    async (reset = false) => {
      if (!query.trim()) {
        setBooks([]);
        return;
      }

      setLoading(true);
      setError(null);

      const index = reset ? 0 : startIndex;
      const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_KEY;
      const url = `${BASE_URL}?q=${encodeURIComponent(query)}&startIndex=${index}&maxResults=${maxResults}&printType=books${apiKey ? `&key=${apiKey}` : ''}`;
      const cacheKey = url;

      try {
        let items;

        // Return cached result if still fresh
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          items = cached.items;
        } else {
          const res = await fetchWithRetry(url);
          const data = await res.json();
          items = data.items || [];
          cache.set(cacheKey, { items, timestamp: Date.now() });
        }

        const normalised = items.map(normalizeBook);

        if (reset) {
          setBooks(normalised);
          setStartIndex(maxResults);
        } else {
          setBooks((prev) => [...prev, ...normalised]);
          setStartIndex((i) => i + maxResults);
        }

        setHasMore(items.length === maxResults);
      } catch (err) {
        setError(err.message || 'Failed to fetch books. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [query, maxResults, startIndex]
  );

  useEffect(() => {
    setStartIndex(0);
    setHasMore(true);
    if (query.trim()) {
      fetchBooks(true);
    } else {
      setBooks([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return { books, loading, error, fetchMore: () => fetchBooks(false), hasMore };
};

export default useGoogleBooks;
