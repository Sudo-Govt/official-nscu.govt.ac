import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  type: 'class' | 'meeting' | 'exam' | 'event';
  location?: string;
}

interface CalendarWidgetProps {
  date: Date;
  schedule: ScheduleItem[];
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'class':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'meeting':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'exam':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'event':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ date, schedule }) => {
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </CardHeader>
      <CardContent>
        {schedule.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No events scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className={cn('w-1 h-full min-h-[40px] rounded-full', getTypeColor(item.type).split(' ')[0])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{item.title}</p>
                    <Badge variant="outline" className={cn('text-xs', getTypeColor(item.type))}>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                    {item.location && (
                      <>
                        <span>•</span>
                        <span>{item.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;
