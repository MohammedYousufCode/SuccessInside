import type { HabitCategory, HabitFrequency } from './database';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: HabitCategory;
  color: string;
  icon: string | null;
  frequency: HabitFrequency;
  target_days: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  completion_date: string;
  notes: string | null;
  created_at: string;
}

export interface HabitWithCompletion extends Habit {
  is_completed_today: boolean;
  current_streak: number;
  total_completions: number;
}

export interface CreateHabitInput {
  name: string;
  description?: string;
  category: HabitCategory;
  color?: string;
  icon?: string;
  frequency?: HabitFrequency;
  target_days?: number[];
}

export interface UpdateHabitInput {
  name?: string;
  description?: string;
  category?: HabitCategory;
  color?: string;
  icon?: string;
  frequency?: HabitFrequency;
  target_days?: number[];
  is_active?: boolean;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_habits: number;
  active_habits: number;
  total_completions: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}
