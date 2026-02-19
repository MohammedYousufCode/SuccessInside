import { getDayName } from '../../utils/date';

interface HeatmapCalendarProps {
  heatmapData: Array<{ date: string; count: number }>;
}

export function HeatmapCalendar({ heatmapData }: HeatmapCalendarProps) {
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-800';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900';
    if (count <= 4) return 'bg-green-400 dark:bg-green-700';
    if (count <= 6) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  // If no data, show placeholder
  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🗓️ Activity Heatmap
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Your completion activity over the last 12 weeks
        </p>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Start completing habits to see your activity heatmap
        </div>
      </div>
    );
  }

  const totalCompletions = heatmapData.reduce((sum, day) => sum + day.count, 0);
  const activeDays = heatmapData.filter(day => day.count > 0).length;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        🗓️ Activity Heatmap
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Your completion activity over the last 12 weeks
      </p>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          <div className="text-lg font-bold text-blue-600">{totalCompletions}</div>
        </div>
        <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-400">Active Days</div>
          <div className="text-lg font-bold text-green-600">{activeDays}</div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-12 gap-2">
        {heatmapData.map((day, index) => (
          <div
            key={day.date}
            className={`aspect-square rounded-lg transition-all hover:scale-110 cursor-pointer ${getColor(day.count)}`}
            title={`${day.date}: ${day.count} completion${day.count !== 1 ? 's' : ''}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-800" title="0 completions" />
          <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900" title="1-2 completions" />
          <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-700" title="3-4 completions" />
          <div className="w-4 h-4 rounded bg-green-600 dark:bg-green-500" title="5-6 completions" />
          <div className="w-4 h-4 rounded bg-green-800 dark:bg-green-300" title="7+ completions" />
        </div>
        <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
      </div>
    </div>
  );
}
