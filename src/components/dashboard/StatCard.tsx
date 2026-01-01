import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'gold';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all hover:shadow-md',
        variant === 'gold' && 'bg-gold-primary text-white border-gold-primary',
        variant === 'primary' && 'bg-primary text-primary-foreground',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p
              className={cn(
                'text-sm font-medium',
                variant === 'default' ? 'text-muted-foreground' : 'text-white/80'
              )}
            >
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p
                className={cn(
                  'text-sm',
                  variant === 'default' ? 'text-muted-foreground' : 'text-white/70'
                )}
              >
                {subtitle}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-1">
                <span
                  className={cn(
                    'text-xs font-medium',
                    trend.isPositive ? 'text-green-500' : 'text-red-500',
                    variant !== 'default' && 'text-white/80'
                  )}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span
                  className={cn(
                    'text-xs',
                    variant === 'default' ? 'text-muted-foreground' : 'text-white/60'
                  )}
                >
                  from last month
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'p-2 rounded-full',
                variant === 'default' ? 'bg-muted' : 'bg-white/20'
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
