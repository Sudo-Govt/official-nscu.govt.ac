import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileText, Clock } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'submitted' | 'graded';
}

interface AssignmentListProps {
  assignments: Assignment[];
}

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">High</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Medium</Badge>;
    case 'low':
      return <Badge variant="outline">Low</Badge>;
    default:
      return null;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-orange-600 border-orange-200">Pending</Badge>;
    case 'submitted':
      return <Badge variant="outline" className="text-blue-600 border-blue-200">Submitted</Badge>;
    case 'graded':
      return <Badge variant="outline" className="text-green-600 border-green-200">Graded</Badge>;
    default:
      return null;
  }
};

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming assignments
          </p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-muted">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm truncate">{assignment.title}</p>
                  {getPriorityBadge(assignment.priority)}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{assignment.course}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Due: {assignment.dueDate}</span>
                  {getStatusBadge(assignment.status)}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentList;
