-- Fix: Travel Plans and Booking Details exposed to public
-- The current policy allows public viewing of non-private trips, which exposes sensitive travel info

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view public booked trips" ON public.booked_trips;

-- Create a more restrictive policy - only authenticated users can view public trips
-- This prevents anonymous scraping while still allowing social features for logged-in users
CREATE POLICY "Authenticated users can view public booked trips"
ON public.booked_trips
FOR SELECT
USING (
  -- Users can always see their own trips
  auth.uid() = user_id
  OR
  -- Authenticated users can see non-private trips linked to public itineraries
  (
    auth.uid() IS NOT NULL
    AND is_private = false 
    AND EXISTS (
      SELECT 1 FROM public.itineraries 
      WHERE itineraries.id = booked_trips.itinerary_id 
      AND itineraries.is_public = true
    )
  )
);