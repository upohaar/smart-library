import React from 'react';
import { useApp } from '../context/AppContext';
import { getNextBadge, getProgressToNext } from '../utils/gamification';

/**
 * PointsBadge — compact badge shown in the Navbar.
 * Displays the user's current badge icon and points total.
 */
const PointsBadge = () => {
  const { points, badge } = useApp();
  const nextBadge = getNextBadge(points);
  const progress = getProgressToNext(points);

  return (
    <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-full px-3 py-1 text-sm">
      <span title={badge.description}>{badge.icon}</span>
      <span className="font-semibold text-yellow-700 dark:text-yellow-400">
        {points} pts
      </span>

      {/* Progress bar toward next badge */}
      {nextBadge && (
        <div
          className="hidden sm:flex items-center gap-1"
          title={`${progress}% to ${nextBadge.label}`}
        >
          <div className="w-16 h-1.5 bg-yellow-200 dark:bg-yellow-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 dark:bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-yellow-600 dark:text-yellow-500">
            {nextBadge.icon}
          </span>
        </div>
      )}
    </div>
  );
};

export default PointsBadge;
