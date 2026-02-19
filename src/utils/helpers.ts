import { HABIT_CATEGORIES } from '../config/constants';
import type { HabitCategory } from '../types/database';

/**
 * Get category metadata
 */
export function getCategoryInfo(category: HabitCategory) {
  return HABIT_CATEGORIES[category];
}

/**
 * Generate random color from predefined set
 */
export function getRandomHabitColor(): string {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Calculate streak color based on count
 */
export function getStreakColor(streak: number): string {
  if (streak === 0) return 'text-gray-500';
  if (streak < 7) return 'text-blue-600';
  if (streak < 30) return 'text-green-600';
  if (streak < 100) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Format streak display
 */
export function formatStreak(streak: number): string {
  if (streak === 0) return 'No streak';
  if (streak === 1) return '1 day';
  return `${streak} days`;
}

/**
 * Check if habit should be done today
 */
export function isHabitDueToday(targetDays: number[]): boolean {
  const today = new Date().getDay();
  const dayNumber = today === 0 ? 7 : today; // Convert Sunday from 0 to 7
  return targetDays.includes(dayNumber);
}
