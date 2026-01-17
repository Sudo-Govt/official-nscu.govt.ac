import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calendar,
  FileText,
  Building2,
  CreditCard,
  Users,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  route?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  disabled?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, disabled = false }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const defaultActions: QuickAction[] = [
    { label: 'Register Courses', icon: BookOpen, route: '/academics/course-catalog' },
    { label: 'Book Advisor', icon: Calendar, route: '/student-life/career-services' },
    { label: 'Request Transcript', icon: FileText, route: '/forms/transcript-request' },
    { label: 'Reserve Study Room', icon: Building2, route: '/services/libraries' },
    { label: 'Pay Fees', icon: CreditCard, route: '/admissions/financial-aid' },
    { label: 'Find Study Group', icon: Users, route: '/student-life/student-organizations' },
    { label: 'Contact Support', icon: MessageSquare, route: '/contact' },
    { label: 'Get Help', icon: HelpCircle, route: '/services/it-help-desk' },
  ];

  const actionsToRender = actions || defaultActions;

  const handleClick = (action: QuickAction) => {
    if (disabled) {
      toast({
        title: 'View Only Mode',
        description: 'This is a test account. Actions are disabled.',
        variant: 'destructive',
      });
      return;
    }
    if (action.onClick) {
      action.onClick();
    } else if (action.route) {
      navigate(action.route);
    } else {
      toast({
        title: action.label,
        description: 'This feature is coming soon!',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {actionsToRender.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                disabled={disabled}
                className="h-auto py-4 flex-col gap-2 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => handleClick(action)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
