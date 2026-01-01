import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Grade {
  course: string;
  code: string;
  grade: string;
  score: number;
  credits: number;
}

interface GradeCardProps {
  grades: Grade[];
}

const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'bg-green-100 text-green-700 border-green-200';
  if (grade.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (grade.startsWith('D')) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

const GradeCard: React.FC<GradeCardProps> = ({ grades }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Current Grades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {grades.map((grade, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{grade.code}</p>
                <p className="text-xs text-muted-foreground">{grade.course}</p>
              </div>
              <Badge
                variant="outline"
                className={cn('font-bold text-sm px-3 py-1', getGradeColor(grade.grade))}
              >
                {grade.grade}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={grade.score} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground w-10 text-right">
                {grade.score}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GradeCard;
