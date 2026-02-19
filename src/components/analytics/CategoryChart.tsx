import { useMemo } from 'react';
import { HABIT_CATEGORIES } from '../../config/constants';

interface CategoryChartProps {
  habits: any[];
}

export function CategoryChart({ habits }: CategoryChartProps) {
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    habits.forEach(habit => {
      counts[habit.category] = (counts[habit.category] || 0) + 1;
    });

    return Object.entries(counts).map(([category, count]) => ({
      category,
      count,
      percentage: habits.length > 0 ? (count / habits.length) * 100 : 0,
      color: HABIT_CATEGORIES[category as keyof typeof HABIT_CATEGORIES]?.color || '#6B7280',
      label: HABIT_CATEGORIES[category as keyof typeof HABIT_CATEGORIES]?.label || category,
      icon: HABIT_CATEGORIES[category as keyof typeof HABIT_CATEGORIES]?.icon || '📌',
    }));
  }, [habits]);

  const total = habits.length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📈 Habits by Category
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Distribution of your {total} active habits
      </p>

      {categoryData.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No habits yet
        </div>
      ) : (
        <div className="space-y-4">
          {categoryData.map(({ category, count, percentage, color, label, icon }) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {count} habits
                  </span>
                  <span className="text-sm font-bold" style={{ color }}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
