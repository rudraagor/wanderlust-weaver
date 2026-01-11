import { useExpenses } from '@/hooks/useExpenses';
import { Plane, Hotel, Activity, Utensils, Car, MoreHorizontal, DollarSign } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  flight: Plane,
  hotel: Hotel,
  activity: Activity,
  food: Utensils,
  transport: Car,
  other: MoreHorizontal,
};

export function TripExpenses({ bookedTripId }: { bookedTripId: string }) {
  const { data: expenses, isLoading } = useExpenses(bookedTripId);

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading expenses...</div>;
  if (!expenses?.length) return <div className="text-sm text-muted-foreground">No expenses recorded</div>;

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-3 mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Trip Expenses
        </h4>
        <span className="font-bold text-primary">${totalExpenses.toLocaleString()}</span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {expenses.map((expense) => {
          const Icon = categoryIcons[expense.category] || MoreHorizontal;
          return (
            <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{expense.description}</span>
              </div>
              <span className="text-sm font-medium">${Number(expense.amount).toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
