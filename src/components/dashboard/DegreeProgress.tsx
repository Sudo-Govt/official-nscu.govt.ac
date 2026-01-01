import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GraduationCap } from 'lucide-react';

interface CategoryProgress {
  name: string;
  earned: number;
  required: number;
}

interface DegreeProgressProps {
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  expectedGraduation: string;
  categories: CategoryProgress[];
}

const DegreeProgress: React.FC<DegreeProgressProps> = ({
  totalCreditsEarned,
  totalCreditsRequired,
  expectedGraduation,
  categories,
}) => {
  const overallProgress = Math.round((totalCreditsEarned / totalCreditsRequired) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Degree Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Circular Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-muted stroke-current"
                strokeWidth="10"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
              <circle
                className="text-gold-primary stroke-current"
                strokeWidth="10"
                strokeLinecap="round"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
                style={{
                  strokeDasharray: `${2 * Math.PI * 40}`,
                  strokeDashoffset: `${2 * Math.PI * 40 * (1 - overallProgress / 100)}`,
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{overallProgress}%</span>
              <span className="text-xs text-muted-foreground">Complete</span>
            </div>
          </div>
        </div>

        {/* Credits Summary */}
        <div className="text-center mb-4 p-3 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Credits</p>
          <p className="text-lg font-semibold">
            {totalCreditsEarned} / {totalCreditsRequired}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Expected Graduation: {expectedGraduation}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          {categories.map((category, index) => {
            const categoryProgress = Math.round((category.earned / category.required) * 100);
            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{category.name}</span>
                  <span className="font-medium">
                    {category.earned}/{category.required}
                  </span>
                </div>
                <Progress value={categoryProgress} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DegreeProgress;
