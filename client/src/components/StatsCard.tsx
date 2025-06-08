import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, icon: Icon, iconColor, trend }: StatsCardProps) {
  return (
    <div className="glass-card rounded-xl p-6 workflow-node">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${iconColor} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
