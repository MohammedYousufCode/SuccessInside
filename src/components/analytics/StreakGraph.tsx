import { useMemo } from 'react';

interface StreakGraphProps {
  habits: any[];
}

export function StreakGraph({ habits }: StreakGraphProps) {
  const streakData = useMemo(() => {
    return habits
      .map(habit => ({
        name: habit.name,
        streak: habit.current_streak || 0,
        color: habit.color,
      }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 10);
  }, [habits]);

  const maxStreak = Math.max(...streakData.map(d => d.streak), 1);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        🔥 Top Streaks
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Your most consistent habits
      </p>

      {streakData.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Start completing habits to build streaks
        </div>
      ) : (
        <div className="space-y-4">
          {streakData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-4">
              <div className="w-8 text-center">
                <span className="text-xl font-bold text-gray-400 dark:text-gray-600">
                  #{index + 1}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </span>
                  <span className="text-sm font-bold ml-2" style={{ color: item.color }}>
                    {item.streak} days
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.streak / maxStreak) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
