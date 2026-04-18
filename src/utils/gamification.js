/**
 * Gamification utility
 * Manages points and badges for user actions
 */

// Points awarded per action
export const POINTS_CONFIG = {
  ADD_FAVORITE: 10,
  REMOVE_FAVORITE: -5,
  BORROW_BOOK: 15,
  RETURN_BOOK: 5,
};

// Badge definitions — each badge has a threshold and a display icon
export const BADGES = [
  { id: 'bookworm',    label: 'Bookworm',      icon: '📚', minPoints: 0,   description: 'Welcome to the library!' },
  { id: 'explorer',   label: 'Explorer',       icon: '🔍', minPoints: 25,  description: 'You started exploring books.' },
  { id: 'reader',     label: 'Reader',         icon: '📖', minPoints: 75,  description: 'An avid reader!' },
  { id: 'scholar',    label: 'Scholar',        icon: '🎓', minPoints: 150, description: 'Knowledge is your power.' },
  { id: 'librarian',  label: 'Librarian',      icon: '🏆', minPoints: 300, description: 'You run this library!' },
];

/**
 * Returns the highest badge the user has earned based on current points.
 * @param {number} points
 */
export const getCurrentBadge = (points) => {
  const earned = BADGES.filter((b) => points >= b.minPoints);
  return earned[earned.length - 1] || BADGES[0];
};

/**
 * Returns the next badge the user can earn.
 * @param {number} points
 */
export const getNextBadge = (points) => {
  return BADGES.find((b) => points < b.minPoints) || null;
};

/**
 * Calculates progress percentage toward the next badge.
 * @param {number} points
 */
export const getProgressToNext = (points) => {
  const current = getCurrentBadge(points);
  const next = getNextBadge(points);
  if (!next) return 100; // Max badge reached
  const range = next.minPoints - current.minPoints;
  const progress = points - current.minPoints;
  return Math.round((progress / range) * 100);
};
