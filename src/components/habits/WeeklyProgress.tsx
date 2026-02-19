import { getDayName } from '../../utils/date';

interface WeeklyProgressProps {
  progress: Array<{ date: string; completed: boolean }>;
}

export function WeeklyProgress({ progress }: WeeklyProgressProps) {
  return (
    <div className="flex gap-1 mt-3">
      {progress.map((day, index) => (
        <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full h-12 rounded-lg transition-all ${
              day.completed
                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-md'
                : 'bg-gray-100 border-2 border-dashed border-gray-300'
            }`}
            title={day.date}
          >
            {day.completed && (
              <div className="flex items-center justify-center h-full text-white text-xl">
                ✓
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {getDayName(day.date)}
          </span>
        </div>
      ))}
    </div>
  );
}
