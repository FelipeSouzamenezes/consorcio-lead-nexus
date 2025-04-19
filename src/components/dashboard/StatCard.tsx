
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-x-2">
              <h3 className="text-3xl font-semibold tracking-tight">{value}</h3>
              {trend && (
                <span
                  className={`text-xs font-medium ${
                    trend.direction === 'up'
                      ? 'text-emerald-600 bg-emerald-100'
                      : 'text-red-600 bg-red-100'
                  } px-2 py-1 rounded-full`}
                >
                  {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
                </span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="rounded-full p-2 bg-primary/10">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};
