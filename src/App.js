import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Global state provider
import { AppProvider } from './context/AppContext';

// Layout
import Navbar from './components/Navbar';

// Pages
import HomePage       from './pages/HomePage';
import BookDetailPage from './pages/BookDetailPage';
import FavoritesPage  from './pages/FavoritesPage';
import BorrowedPage   from './pages/BorrowedPage';
import DashboardPage  from './pages/DashboardPage';
import LoginPage      from './pages/LoginPage';

/**
 * App — root component.
 * Wraps everything in AppProvider (global state) and BrowserRouter (routing).
 */
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Min-height ensures footer-like behaviour; bg/text handle dark mode base */}
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <Navbar />

          <main>
            <Routes>
              <Route path="/"            element={<HomePage />} />
              <Route path="/book/:id"    element={<BookDetailPage />} />
              <Route path="/favorites"   element={<FavoritesPage />} />
              <Route path="/borrowed"    element={<BorrowedPage />} />
              <Route path="/dashboard"   element={<DashboardPage />} />
              <Route path="/login"       element={<LoginPage />} />

              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
                    <div className="text-6xl">🔍</div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      Page Not Found
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">
                      The page you are looking for does not exist.
                    </p>
                    <a
                      href="/"
                      className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
