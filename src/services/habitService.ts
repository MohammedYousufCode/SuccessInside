import { supabase } from '../lib/supabase';
import type { 
  Habit, 
  HabitCompletion, 
  CreateHabitInput, 
  UpdateHabitInput,
  HabitWithCompletion 
} from '../types/habit';

class HabitService {
  /**
   * Get all habits for the current user
   */
  async getUserHabits(userId: string) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { habits: data as Habit[], error: null };
    } catch (err) {
      return { 
        habits: null, 
        error: err instanceof Error ? err.message : 'Failed to fetch habits' 
      };
    }
  }

  /**
   * Get active habits for the current user
   */
  async getActiveHabits(userId: string) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { habits: data as Habit[], error: null };
    } catch (err) {
      return { 
        habits: null, 
        error: err instanceof Error ? err.message : 'Failed to fetch habits' 
      };
    }
  }

  /**
   * Get habits with today's completion status
   */
  async getHabitsWithCompletion(userId: string): Promise<{ 
    habits: HabitWithCompletion[] | null; 
    error: string | null 
  }> {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get all active habits
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Get today's completions
      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', userId)
        .eq('completion_date', today);

      if (completionsError) throw completionsError;

      const completedHabitIds = new Set(
        completions?.map(c => c.habit_id) || []
      );

      // Enrich habits with completion data
      const enrichedHabits: HabitWithCompletion[] = await Promise.all(
        (habits || []).map(async (habit) => {
          // Calculate streak
          const streak = await this.calculateStreak(habit.id);
          
          // Get total completions
          const { count } = await supabase
            .from('habit_completions')
            .select('*', { count: 'exact', head: true })
            .eq('habit_id', habit.id);

          return {
            ...habit,
            is_completed_today: completedHabitIds.has(habit.id),
            current_streak: streak,
            total_completions: count || 0,
          };
        })
      );

      return { habits: enrichedHabits, error: null };
    } catch (err) {
      return { 
        habits: null, 
        error: err instanceof Error ? err.message : 'Failed to fetch habits with completion' 
      };
    }
  }

  /**
   * Create a new habit
   */
  async createHabit(userId: string, input: CreateHabitInput) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: userId,
          name: input.name,
          description: input.description || null,
          category: input.category,
          color: input.color || '#3B82F6',
          icon: input.icon || null,
          frequency: input.frequency || 'daily',
          target_days: input.target_days || [1, 2, 3, 4, 5, 6, 7],
        })
        .select()
        .single();

      if (error) throw error;
      return { habit: data as Habit, error: null };
    } catch (err) {
      return { 
        habit: null, 
        error: err instanceof Error ? err.message : 'Failed to create habit' 
      };
    }
  }

  /**
   * Update an existing habit
   */
  async updateHabit(habitId: string, input: UpdateHabitInput) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update(input)
        .eq('id', habitId)
        .select()
        .single();

      if (error) throw error;
      return { habit: data as Habit, error: null };
    } catch (err) {
      return { 
        habit: null, 
        error: err instanceof Error ? err.message : 'Failed to update habit' 
      };
    }
  }

  /**
   * Delete a habit
   */
  async deleteHabit(habitId: string) {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Failed to delete habit' 
      };
    }
  }

  /**
   * Archive a habit (soft delete)
   */
  async archiveHabit(habitId: string) {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId)
        .select()
        .single();

      if (error) throw error;
      return { habit: data as Habit, error: null };
    } catch (err) {
      return { 
        habit: null, 
        error: err instanceof Error ? err.message : 'Failed to archive habit' 
      };
    }
  }

  /**
   * Mark habit as complete for today
   */
  async completeHabit(userId: string, habitId: string, notes?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('habit_completions')
        .insert({
          user_id: userId,
          habit_id: habitId,
          completion_date: today,
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return { completion: data as HabitCompletion, error: null };
    } catch (err) {
      return { 
        completion: null, 
        error: err instanceof Error ? err.message : 'Failed to complete habit' 
      };
    }
  }

  /**
   * Unmark habit completion for today
   */
  async uncompleteHabit(userId: string, habitId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .eq('completion_date', today);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { 
        error: err instanceof Error ? err.message : 'Failed to uncomplete habit' 
      };
    }
  }

  /**
   * Get habit completion history
   */
  async getHabitHistory(habitId: string, limit: number = 30) {
    try {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('habit_id', habitId)
        .order('completion_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { completions: data as HabitCompletion[], error: null };
    } catch (err) {
      return { 
        completions: null, 
        error: err instanceof Error ? err.message : 'Failed to fetch habit history' 
      };
    }
  }

  /**
   * Calculate current streak for a habit
   */
  async calculateStreak(habitId: string): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('calculate_habit_streak', {
        habit_uuid: habitId,
      });

      if (error) throw error;
      return data as number;
    } catch (err) {
      console.error('Streak calculation error:', err);
      return 0;
    }
  }

  /**
   * Get weekly progress for a habit (FIXED - removed duplicate)
   */
  async getWeeklyProgress(habitId: string) {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 6);

      const startDate = sevenDaysAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('habit_completions')
        .select('completion_date')
        .eq('habit_id', habitId)
        .gte('completion_date', startDate)
        .lte('completion_date', endDate)
        .order('completion_date', { ascending: true });

      if (error) throw error;

      // Create array of last 7 days
      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      const completedDates = new Set(data?.map(c => c.completion_date) || []);
      
      const progress = weekDays.map(date => ({
        date,
        completed: completedDates.has(date),
      }));

      return { progress, error: null };
    } catch (err) {
      return { 
        progress: null, 
        error: err instanceof Error ? err.message : 'Failed to fetch weekly progress' 
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { stats: data, error: null };
    } catch (err) {
      return { 
        stats: null, 
        error: err instanceof Error ? err.message : 'Failed to fetch user stats' 
      };
    }
  }

    /**
   * Get analytics data for a user (FIXED - proper column names)
   */
  async getAnalyticsData(userId: string) {
    try {
      // Get all habits with their stats
      const { data: habits, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (habitsError) {
        console.error('Error fetching habits:', habitsError);
        return { data: null, error: habitsError.message };
      }

      // Enrich habits with completion counts and streaks
      const enrichedHabits = await Promise.all(
        (habits || []).map(async (habit) => {
          const { count } = await supabase
            .from('habit_completions')
            .select('*', { count: 'exact', head: true })
            .eq('habit_id', habit.id);

          const streak = await this.calculateStreak(habit.id);

          return {
            id: habit.id,
            name: habit.name,
            category: habit.category,
            color: habit.color,
            current_streak: streak,
            longest_streak: habit.longest_streak || 0,
            total_completions: count || 0,
          };
        })
      );

      // Get completion history for last 84 days (12 weeks)
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 83);

      const { data: completions, error: completionsError } = await supabase
        .from('habit_completions')
        .select('habit_id, completion_date')
        .eq('user_id', userId)
        .gte('completion_date', startDate.toISOString().split('T')[0])
        .lte('completion_date', today.toISOString().split('T')[0]);

      if (completionsError) {
        console.error('Error fetching completions:', completionsError);
      }

      // Generate heatmap data for last 84 days
      const heatmapData = [];
      for (let i = 83; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const count = completions?.filter(
          (c) => c.completion_date === dateStr
        ).length || 0;

        heatmapData.push({ date: dateStr, count });
      }

      return {
        data: {
          habits: enrichedHabits,
          heatmapData,
          completions: completions || [],
        },
        error: null,
      };
    } catch (error) {
      console.error('Error in getAnalyticsData:', error);
      return { data: null, error: 'Failed to fetch analytics data' };
    }
  }
}

export const habitService = new HabitService();
