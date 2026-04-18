import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BADGES, getNextBadge, getProgressToNext } from '../utils/gamification';

/**
 * DashboardPage — user's personal stats: favorites, borrowed, points, and badges.
 */
const DashboardPage = () => {
  const { user, favorites, borrowed, points, badge } = useApp();
  const navigate = useNavigate();
  const nextBadge = getNextBadge(points);
  const progress = getProgressToNext(points);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Please log in</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Collect all unique categories from favorites and borrowed for activity summary
  const allCategories = [
    ...favorites.flatMap((b) => b.categories || []),
    ...borrowed.flatMap((b) => b.categories || []),
  ];
  const categoryCounts = allCategories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    { label: 'Favorite Books', value: favorites.length, icon: '❤️', color: 'rose' },
    { label: 'Borrowed Books', value: borrowed.length, icon: '📖', color: 'blue' },
    { label: 'Total Points', value: points, icon: '⭐', color: 'amber' },
    { label: 'Current Badge', value: badge.label, icon: badge.icon, color: 'purple' },
  ];

  const colorMap = {
    rose:   'bg-rose-50   dark:bg-rose-900/20   border-rose-100   dark:border-rose-800   text-rose-600   dark:text-rose-400',
    blue:   'bg-blue-50   dark:bg-blue-900/20   border-blue-100   dark:border-blue-800   text-blue-600   dark:text-blue-400',
    amber:  'bg-amber-50  dark:bg-amber-900/20  border-amber-100  dark:border-amber-800  text-amber-600  dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          📊 Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, <strong>{user.username}</strong>!
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon, color }) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 ${colorMap[color]}`}
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm opacity-80 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gamification / Badge progress */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            🏆 Badge Progress
          </h2>

          {/* All badges */}
          <div className="flex flex-col gap-3">
            {BADGES.map((b) => {
              const earned = points >= b.minPoints;
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                    earned
                      ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700'
                      : 'border-slate-100 dark:border-slate-700 opacity-50'
                  }`}
                >
                  <span className="text-2xl">{b.icon}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${earned ? 'text-yellow-700 dark:text-yellow-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {b.label}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{b.description}</p>
                  </div>
                  {earned && <span className="text-green-500 text-lg">✓</span>}
                  {!earned && (
                    <span className="text-xs text-slate-400 whitespace-nowrap">{b.minPoints} pts</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar to next badge */}
          {nextBadge && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
                <span>Progress to {nextBadge.icon} {nextBadge.label}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 dark:bg-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Reading activity — top categories */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            📈 Reading Activity
          </h2>

          {topCategories.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              No activity yet. Add favorites or borrow books to see your interests here.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {topCategories.map(([cat, count]) => {
                const maxCount = topCategories[0][1];
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 dark:text-slate-300 truncate">{cat}</span>
                      <span className="text-slate-400 dark:text-slate-500 ml-2 flex-shrink-0">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recent borrowed books */}
          {borrowed.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Recently Borrowed
              </h3>
              <ul className="flex flex-col gap-2">
                {borrowed.slice(-3).reverse().map((book) => (
                  <li
                    key={book.id}
                    className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => navigate(`/book/${book.id}`)}
                  >
                    <span>📗</span>
                    <span className="truncate">{book.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
