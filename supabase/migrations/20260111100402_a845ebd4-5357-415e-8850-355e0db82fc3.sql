-- Add planned_budget column to booked_trips table for budget alerts
ALTER TABLE public.booked_trips 
ADD COLUMN planned_budget numeric DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.booked_trips.planned_budget IS 'User-defined budget limit for trip expense alerts';