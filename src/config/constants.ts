export const APP_NAME = 'Success Inside';
export const APP_TAGLINE = 'A Smart Habit Tracker';
export const APP_FULL_NAME = 'Success Inside - A Smart Habit Tracker';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const HABIT_CATEGORIES = {
  health: { label: 'Health', color: '#10B981', icon: '❤️' },
  fitness: { label: 'Fitness', color: '#F59E0B', icon: '💪' },
  learning: { label: 'Learning', color: '#3B82F6', icon: '📚' },
  productivity: { label: 'Productivity', color: '#8B5CF6', icon: '⚡' },
  mindfulness: { label: 'Mindfulness', color: '#EC4899', icon: '🧘' },
  social: { label: 'Social', color: '#14B8A6', icon: '👥' },
  other: { label: 'Other', color: '#6B7280', icon: '📌' },
} as const;

export const HABIT_FREQUENCIES = {
  daily: 'Every day',
  weekly: 'Weekly',
  custom: 'Custom',
} as const;

export const WEEKDAYS = [
  { value: 1, label: 'Mon', short: 'M' },
  { value: 2, label: 'Tue', short: 'T' },
  { value: 3, label: 'Wed', short: 'W' },
  { value: 4, label: 'Thu', short: 'T' },
  { value: 5, label: 'Fri', short: 'F' },
  { value: 6, label: 'Sat', short: 'S' },
  { value: 7, label: 'Sun', short: 'S' },
] as const;

export const DEFAULT_HABIT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
] as const;

export const NAVIGATION_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
] as const;
