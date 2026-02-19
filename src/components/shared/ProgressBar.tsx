interface ProgressBarProps {
  percentage: number;
  color?: string;
  showLabel?: boolean;
}

export function ProgressBar({ percentage, color = '#10B981', showLabel = true }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {showLabel && (
          <span className="text-sm font-semibold text-gray-700">
            {percentage}% Complete
          </span>
        )}
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
