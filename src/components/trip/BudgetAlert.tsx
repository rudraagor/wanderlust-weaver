import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BudgetAlertProps {
  totalExpenses: number;
  plannedBudget: number | null;
  className?: string;
}

export function BudgetAlert({ totalExpenses, plannedBudget, className }: BudgetAlertProps) {
  if (!plannedBudget || plannedBudget <= 0) {
    return null;
  }

  const percentUsed = Math.round((totalExpenses / plannedBudget) * 100);
  const isOverBudget = percentUsed > 100;
  const isWarning = percentUsed >= 80 && percentUsed <= 100;
  const isHealthy = percentUsed < 80;

  const remaining = plannedBudget - totalExpenses;

  return (
    <div className={cn(
      "p-4 rounded-xl border",
      isOverBudget && "bg-destructive/10 border-destructive/30",
      isWarning && "bg-yellow-500/10 border-yellow-500/30",
      isHealthy && "bg-green-500/10 border-green-500/30",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isOverBudget ? (
            <AlertTriangle className="w-5 h-5 text-destructive" />
          ) : isWarning ? (
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <span className="font-semibold text-sm">
            {isOverBudget ? 'Over Budget!' : isWarning ? 'Approaching Limit' : 'On Track'}
          </span>
        </div>
        <span className={cn(
          "text-sm font-bold",
          isOverBudget && "text-destructive",
          isWarning && "text-yellow-600",
          isHealthy && "text-green-600"
        )}>
          {percentUsed}%
        </span>
      </div>
      
      <Progress 
        value={Math.min(percentUsed, 100)} 
        className={cn(
          "h-2 mb-3",
          isOverBudget && "[&>div]:bg-destructive",
          isWarning && "[&>div]:bg-yellow-500",
          isHealthy && "[&>div]:bg-green-500"
        )}
      />
      
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Spent: ${totalExpenses.toLocaleString()}</span>
        <span>Budget: ${plannedBudget.toLocaleString()}</span>
      </div>
      
      {isOverBudget ? (
        <p className="text-xs text-destructive mt-2">
          ⚠️ You've exceeded your budget by ${Math.abs(remaining).toLocaleString()}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground mt-2">
          ${remaining.toLocaleString()} remaining
        </p>
      )}
    </div>
  );
}
