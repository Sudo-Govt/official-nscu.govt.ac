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

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  { label: 'Register Courses', icon: BookOpen },
  { label: 'Book Advisor', icon: Calendar },
  { label: 'Request Transcript', icon: FileText },
  { label: 'Reserve Study Room', icon: Building2 },
  { label: 'Pay Fees', icon: CreditCard },
  { label: 'Find Study Group', icon: Users },
  { label: 'Contact Support', icon: MessageSquare },
  { label: 'Get Help', icon: HelpCircle },
];

const QuickActions: React.FC<QuickActionsProps> = ({ actions = defaultActions }) => {
  const { toast } = useToast();

  const handleClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
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
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto py-4 flex-col gap-2 hover:bg-gold-light hover:border-gold-primary hover:text-gold-primary transition-all"
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
