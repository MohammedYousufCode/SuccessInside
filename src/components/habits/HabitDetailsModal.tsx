import { useEffect, useState } from 'react';
import { habitService } from '../../services/habitService';
import { WeeklyProgress } from './WeeklyProgress';
import { ProgressBar } from '../shared/ProgressBar';
import { formatStreak, getCategoryInfo } from '../../utils/helpers';
import type { HabitWithCompletion } from '../../types/habit';

interface HabitDetailsModalProps {
  habit: HabitWithCompletion | null;
  isOpen: boolean;
  onClose: () => void;
}

export function HabitDetailsModal({ habit, isOpen, onClose }: HabitDetailsModalProps) {
  const [weeklyProgress, setWeeklyProgress] = useState<Array<{ date: string; completed: boolean }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (habit && isOpen) {
      fetchWeeklyProgress();
    }
  }, [habit, isOpen]);

  const fetchWeeklyProgress = async () => {
    if (!habit) return;
    
    setLoading(true);
    const { progress } = await habitService.getWeeklyProgress(habit.id);
    if (progress) {
      setWeeklyProgress(progress);
    }
    setLoading(false);
  };

  if (!isOpen || !habit) return null;

  const categoryInfo = getCategoryInfo(habit.category);
  const completedDays = weeklyProgress.filter(d => d.completed).length;
  const weeklyCompletionRate = weeklyProgress.length > 0 
    ? Math.round((completedDays / weeklyProgress.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div 
          className="p-6 border-b border-gray-200"
          style={{ borderLeftWidth: '6px', borderLeftColor: habit.color }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{categoryInfo.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{habit.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{categoryInfo.label}</p>
                </div>
              </div>
              {habit.description && (
                <p className="text-gray-600 mt-3">{habit.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition ml-4"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6 grid grid-cols-3 gap-4 bg-gray-50 border-b border-gray-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{habit.current_streak}</div>
            <div className="text-sm text-gray-600 mt-1">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{habit.total_completions}</div>
            <div className="text-sm text-gray-600 mt-1">Total Completions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{completedDays}/7</div>
            <div className="text-sm text-gray-600 mt-1">This Week</div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📅 Weekly Progress</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <WeeklyProgress progress={weeklyProgress} />
              
              <div className="mt-6">
                <ProgressBar 
                  percentage={weeklyCompletionRate} 
                  color={habit.color}
                />
              </div>

              {/* Weekly Summary */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💪</span>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {completedDays === 7 
                        ? "Perfect week! You completed all 7 days!" 
                        : completedDays >= 5 
                        ? "Great job! Keep up the momentum!"
                        : completedDays >= 3
                        ? "Good progress! Try to complete more days."
                        : "Let's get started! Complete more days this week."}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {weeklyCompletionRate}% weekly completion rate
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
