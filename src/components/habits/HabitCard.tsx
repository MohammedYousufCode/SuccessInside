import { useState } from 'react';
import { getCategoryInfo, formatStreak, getStreakColor } from '../../utils/helpers';
import type { HabitWithCompletion } from '../../types/habit';

interface HabitCardProps {
  habit: HabitWithCompletion;
  onToggleComplete: (habitId: string, isCompleted: boolean) => Promise<{ error?: string | null } | void>;
  onEdit: (habit: HabitWithCompletion) => void;
  onDelete: (habitId: string) => void;
  onViewDetails: (habit: HabitWithCompletion) => void;
}

export function HabitCard({ habit, onToggleComplete, onEdit, onDelete, onViewDetails }: HabitCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const categoryInfo = getCategoryInfo(habit.category);

  const handleToggle = async () => {
    setIsProcessing(true);
    try {
      const result = await onToggleComplete(habit.id, habit.is_completed_today);
      if (result?.error) {
        console.error('Error toggling habit completion:', result.error);
      }
    } catch (error) {
      console.error('Error in handleToggle:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const progressPercentage = habit.total_completions > 0 
    ? Math.min((habit.current_streak / 30) * 100, 100) 
    : 0;

  return (
    <div 
      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
      style={{ 
        borderLeftWidth: '5px', 
        borderLeftColor: habit.color,
        boxShadow: isHovered ? `0 10px 40px ${habit.color}15` : undefined
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Completion Badge */}
      {habit.is_completed_today && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-green-400 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
          ✓ Done!
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Custom Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isProcessing}
          className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
            habit.is_completed_today
              ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg scale-110'
              : 'bg-white border-3 border-gray-300 hover:border-green-400 hover:scale-110 shadow-md'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            borderColor: !habit.is_completed_today ? habit.color : undefined,
            borderWidth: !habit.is_completed_today ? '3px' : undefined
          }}
        >
          {habit.is_completed_today ? (
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <div className="w-4 h-4 rounded-full bg-gray-200 group-hover:bg-green-200 transition-colors" />
          )}
        </button>

        {/* Habit Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <h3 className={`text-lg font-bold text-gray-900 ${habit.is_completed_today ? 'line-through text-gray-500' : ''}`}>
              {habit.name}
            </h3>
          </div>
          
          {habit.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{habit.description}</p>
          )}
          
          {/* Stats Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span 
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ 
                backgroundColor: `${habit.color}20`, 
                color: habit.color 
              }}
            >
              {categoryInfo.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              habit.current_streak > 0 ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              🔥 {habit.current_streak} day streak
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              ✓ {habit.total_completions} completions
            </span>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 font-medium">30-Day Progress</span>
              <button
                onClick={() => onViewDetails(habit)}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Details
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                style={{
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(90deg, ${habit.color}, ${habit.color}dd)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progressPercentage)}% Complete</span>
              <span>{habit.current_streak}/30 days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
            title="Edit habit"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${habit.name}"? This cannot be undone.`)) {
                onDelete(habit.id);
              }
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
            title="Delete habit"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
