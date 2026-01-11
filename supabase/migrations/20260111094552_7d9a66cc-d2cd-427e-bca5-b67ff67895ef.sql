-- Create expenses table to track trip expenses
CREATE TABLE public.trip_expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booked_trip_id UUID NOT NULL REFERENCES public.booked_trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  category TEXT NOT NULL, -- 'flight', 'hotel', 'activity', 'food', 'transport', 'other'
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  expense_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their expenses"
ON public.trip_expenses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their expenses"
ON public.trip_expenses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their expenses"
ON public.trip_expenses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their expenses"
ON public.trip_expenses
FOR DELETE
USING (auth.uid() = user_id);