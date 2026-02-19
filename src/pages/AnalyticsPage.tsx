import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { habitService } from '../services/habitService';
import { HeatmapCalendar } from '../components/analytics/HeatmapCalendar';
import { CategoryChart } from '../components/analytics/CategoryChart';
import { StreakGraph } from '../components/analytics/StreakGraph';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await habitService.getAnalyticsData(user.id);
    
    if (fetchError) {
      setError(fetchError);
      console.error('Analytics error:', fetchError);
    } else {
      setAnalyticsData(data);
      console.log('Analytics data loaded:', data); // Debug
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const habits = analyticsData?.habits || [];
  const heatmapData = analyticsData?.heatmapData || [];
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum: number, h: any) => sum + (h.total_completions || 0), 0);
  const currentStreak = Math.max(...habits.map((h: any) => h.current_streak || 0), 0);
  const longestStreak = Math.max(...habits.map((h: any) => h.longest_streak || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          📊 Analytics Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Deep insights into your habit journey
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2 uppercase">Total Habits</div>
          <div className="text-4xl font-black text-blue-600">{totalHabits}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Active habits tracked</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2 uppercase">Completions</div>
          <div className="text-4xl font-black text-green-600">{totalCompletions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">All-time completions</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2 uppercase">Current Streak</div>
          <div className="text-4xl font-black text-orange-600">{currentStreak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Days in a row</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2 uppercase">Longest Streak</div>
          <div className="text-4xl font-black text-purple-600">{longestStreak}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Personal best</div>
        </div>
      </div>

      {/* Empty State */}
      {totalHabits === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-lg text-center">
          <div className="text-7xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Analytics Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create some habits and start completing them to see your analytics!
          </p>
          <a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Go to Dashboard
          </a>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HeatmapCalendar heatmapData={heatmapData} />
            <CategoryChart habits={habits} />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <StreakGraph habits={habits} />
          </div>

          {/* Debug Info (remove in production) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <summary className="font-bold cursor-pointer">Debug Info</summary>
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify({ totalHabits, totalCompletions, heatmapDataLength: heatmapData.length }, null, 2)}
              </pre>
            </details>
          )}
        </>
      )}
    </div>
  );
}
