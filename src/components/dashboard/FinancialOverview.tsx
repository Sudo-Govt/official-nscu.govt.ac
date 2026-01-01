import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CreditCard, DollarSign, Gift, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FinancialOverviewProps {
  totalDue: number;
  amountPaid: number;
  dueDate?: string;
  hasFinancialAid?: boolean;
  mealPlanBalance?: number;
  printCredits?: number;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  totalDue,
  amountPaid,
  dueDate,
  hasFinancialAid = false,
  mealPlanBalance = 0,
  printCredits = 0,
}) => {
  const { toast } = useToast();
  const balance = totalDue - amountPaid;
  const paymentProgress = (amountPaid / totalDue) * 100;

  const handlePayment = () => {
    toast({
      title: 'Payment Portal',
      description: 'Redirecting to payment portal...',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Financial Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Balance */}
        <div className="p-4 rounded-lg bg-gold-primary text-white">
          <p className="text-sm opacity-80">Current Balance</p>
          <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
          {dueDate && (
            <p className="text-sm opacity-80 mt-1">Due by {dueDate}</p>
          )}
        </div>

        {/* Payment Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment Progress</span>
            <span className="font-medium">{Math.round(paymentProgress)}%</span>
          </div>
          <Progress value={paymentProgress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Paid: ${amountPaid.toLocaleString()}</span>
            <span>Total: ${totalDue.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Meal Plan</span>
            </div>
            <p className="font-semibold">${mealPlanBalance}</p>
          </div>
          <div className="p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Print Credits</span>
            </div>
            <p className="font-semibold">${printCredits}</p>
          </div>
        </div>

        {/* Financial Aid */}
        {hasFinancialAid && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                <DollarSign className="h-3 w-3 mr-1" />
                Financial Aid Applied
              </Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button onClick={handlePayment} className="bg-gold-primary hover:bg-gold-primary/90">
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </Button>
          <Button variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;
