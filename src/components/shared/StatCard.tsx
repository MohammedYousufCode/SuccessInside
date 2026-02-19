interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, color = '#3B82F6', subtitle }: StatCardProps) {
  return (
    <div 
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
    >
      {/* Decorative gradient background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}66)`
        }}
      />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">{title}</p>
          <p className="text-4xl font-black text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 font-medium mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
          style={{ 
            backgroundColor: `${color}15`,
            boxShadow: `0 8px 20px ${color}30`
          }}
        >
          {icon}
        </div>
      </div>

      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
