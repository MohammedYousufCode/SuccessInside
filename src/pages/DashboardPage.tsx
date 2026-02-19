import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { useUserStats } from '../hooks/useUserStats';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitModal } from '../components/habits/HabitModal';
import { HabitDetailsModal } from '../components/habits/HabitDetailsModal';
import { StatCard } from '../components/shared/StatCard';
import { getGreeting } from '../utils/helpers';
import { getTodayDate, formatDate } from '../utils/date';
import type { HabitWithCompletion } from '../types/habit';

export default function DashboardPage() {
  const { habits, loading, error, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits();
  const { stats } = useUserStats();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithCompletion | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<HabitWithCompletion | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleCreateHabit = async (input: any) => {
    const result = await createHabit(input);
    return result;
  };

  const handleEditHabit = (habit: HabitWithCompletion) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleViewDetails = (habit: HabitWithCompletion) => {
    setSelectedHabit(habit);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedHabit(null);
  };

  const completedToday = habits.filter(h => h.is_completed_today).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {getGreeting()}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg font-medium">
          {formatDate(getTodayDate())}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Habits"
          value={stats?.active_habits || 0}
          icon="🎯"
          color="#3B82F6"
        />
        <StatCard
          title="Completed Today"
          value={`${completedToday}/${habits.length}`}
          icon="✅"
          color="#10B981"
          subtitle={`${completionRate}% completion rate`}
        />
        <StatCard
          title="Current Streak"
          value={stats?.current_streak || 0}
          icon="🔥"
          color="#F59E0B"
          subtitle="days in a row"
        />
        <StatCard
          title="Total Completions"
          value={stats?.total_completions || 0}
          icon="📈"
          color="#8B5CF6"
        />
      </div>

      {/* Habits Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Habits</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Habit
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading your habits...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && habits.length === 0 && (
          <div className="text-center py-16">
            <div className="text-7xl mb-6 animate-bounce">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No habits yet!</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start your journey to success by creating your first habit. Small steps lead to big changes!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-xl hover:scale-105"
            >
              Create Your First Habit
            </button>
          </div>
        )}

        {/* Habits Grid */}
        {!loading && !error && habits.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={toggleCompletion}
                onEdit={handleEditHabit}
                onDelete={deleteHabit}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateHabit}
        editHabit={editingHabit}
      />

      <HabitDetailsModal
        habit={selectedHabit}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
