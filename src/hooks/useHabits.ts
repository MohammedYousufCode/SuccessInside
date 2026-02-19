import { useState, useEffect, useCallback } from 'react';
import { habitService } from '../services/habitService';
import { useAuth } from '../contexts/AuthContext';
import type { 
  HabitWithCompletion, 
  CreateHabitInput, 
  UpdateHabitInput 
} from '../types/habit';

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<HabitWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    const { habits: fetchedHabits, error: fetchError } = 
      await habitService.getHabitsWithCompletion(user.id);

    if (fetchError) {
      setError(fetchError);
    } else {
      setHabits(fetchedHabits || []);
    }

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const createHabit = async (input: CreateHabitInput) => {
    if (!user?.id) return { error: 'Not authenticated' };

    const { habit, error } = await habitService.createHabit(user.id, input);

    if (error) {
      return { error };
    }

    await fetchHabits();
    return { error: null };
  };

  const updateHabit = async (habitId: string, input: UpdateHabitInput) => {
    const { habit, error } = await habitService.updateHabit(habitId, input);

    if (error) {
      return { error };
    }

    await fetchHabits();
    return { error: null };
  };

  const deleteHabit = async (habitId: string) => {
    const { error } = await habitService.deleteHabit(habitId);

    if (error) {
      return { error };
    }

    await fetchHabits();
    return { error: null };
  };

  const archiveHabit = async (habitId: string) => {
    const { error } = await habitService.archiveHabit(habitId);

    if (error) {
      return { error };
    }

    await fetchHabits();
    return { error: null };
  };

  const toggleCompletion = async (habitId: string, isCompleted: boolean) => {
    if (!user?.id) return { error: 'Not authenticated' };

    const { error } = isCompleted
      ? await habitService.uncompleteHabit(user.id, habitId)
      : await habitService.completeHabit(user.id, habitId);

    if (error) {
      return { error };
    }

    await fetchHabits();
    return { error: null };
  };

  return {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    archiveHabit,
    toggleCompletion,
  };
}
