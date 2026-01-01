import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
  code: string;
  name: string;
  credits: number;
  professor: string;
  progress: number;
  nextClass?: string;
  onClick?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  code,
  name,
  credits,
  professor,
  progress,
  nextClass,
  onClick,
}) => {
  return (
    <Card className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-foreground">{code}</span>
              <Badge variant="secondary" className="text-xs">
                {credits} credits
              </Badge>
            </div>
            <h3 className="font-medium text-base leading-tight">{name}</h3>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          Prof. {professor}
        </p>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {nextClass && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Clock className="h-4 w-4" />
            <span>Next: {nextClass}</span>
          </div>
        )}
        
        <Button
          variant="link"
          className="h-auto p-0 text-gold-primary hover:text-gold-primary/80"
          onClick={onClick}
        >
          Open Course <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
