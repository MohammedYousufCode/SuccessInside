import type { User } from '@supabase/supabase-js';

export * from './database';

export interface AuthUser extends User {
  email: string;
}

export interface HabitWithStats {
  id: string;
  name: string;
  description: string | null;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  completion_rate: number;
  last_completed: string | null;
  completed_today: boolean;
}

export interface DailyHabitProgress {
  habit_id: string;
  habit_name: string;
  completed: boolean;
  completion_id: string | null;
}

export interface WeeklyProgress {
  week_start: string;
  week_end: string;
  total_habits: number;
  completed_habits: number;
  completion_rate: number;
}

export interface MonthlyProgress {
  month: string;
  year: number;
  total_habits: number;
  completed_habits: number;
  completion_rate: number;
  best_streak: number;
}

export interface StreakData {
  current_streak: number;
  longest_streak: number;
  streak_dates: string[];
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}
// Re-export all types
export * from './auth';
export * from './database';
export * from './habit';

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
