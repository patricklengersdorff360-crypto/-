import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface StatBarProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  className?: string;
}

export default function StatBar({ label, value, icon, color, className }: StatBarProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center text-sm font-bold px-1">
        <span>{icon} {label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner p-0.5">
        <motion.div 
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', damping: 20 }}
        />
      </div>
    </div>
  );
}
