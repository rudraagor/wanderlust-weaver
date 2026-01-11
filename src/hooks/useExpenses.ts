import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TripExpense {
  id: string;
  booked_trip_id: string;
  user_id: string;
  category: 'flight' | 'hotel' | 'activity' | 'food' | 'transport' | 'other';
  description: string;
  amount: number;
  currency: string;
  expense_date: string | null;
  created_at: string;
}

export function useExpenses(bookedTripId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['expenses', bookedTripId],
    queryFn: async () => {
      let query = supabase
        .from('trip_expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookedTripId) {
        query = query.eq('booked_trip_id', bookedTripId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TripExpense[];
    },
    enabled: !!user,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (expense: {
      booked_trip_id: string;
      category: string;
      description: string;
      amount: number;
      currency?: string;
      expense_date?: string;
    }) => {
      if (!user) throw new Error('User must be logged in');

      const { data, error } = await supabase
        .from('trip_expenses')
        .insert({
          ...expense,
          user_id: user.id,
          currency: expense.currency || 'USD',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.booked_trip_id] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expenseId: string) => {
      const { error } = await supabase
        .from('trip_expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
