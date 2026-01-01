import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp } from 'lucide-react';

interface GPAOverviewProps {
  cumulativeGPA: number;
  semesterGPA: number;
  creditsEarned: number;
  creditsRequired: number;
  isDeansList?: boolean;
}

const GPAOverview: React.FC<GPAOverviewProps> = ({
  cumulativeGPA,
  semesterGPA,
  creditsEarned,
  creditsRequired,
  isDeansList = false,
}) => {
  const gpaPercentage = (cumulativeGPA / 4) * 100;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">GPA Overview</CardTitle>
          {isDeansList && (
            <Badge className="bg-gold-primary text-white">
              <Award className="h-3 w-3 mr-1" />
              Dean's List
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">Cumulative GPA</p>
            <p className="text-3xl font-bold text-gold-primary">{cumulativeGPA.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">This Semester</p>
            <p className="text-3xl font-bold">{semesterGPA.toFixed(2)}</p>
          </div>
        </div>

        {/* GPA Scale */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>0.0</span>
            <span>1.0</span>
            <span>2.0</span>
            <span>3.0</span>
            <span>4.0</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full transition-all"
              style={{ width: `${gpaPercentage}%` }}
            />
          </div>
        </div>

        {/* Credits */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div>
            <p className="text-sm font-medium">Credits Progress</p>
            <p className="text-xs text-muted-foreground">
              {creditsEarned} of {creditsRequired} credits earned
            </p>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">
              {Math.round((creditsEarned / creditsRequired) * 100)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GPAOverview;
