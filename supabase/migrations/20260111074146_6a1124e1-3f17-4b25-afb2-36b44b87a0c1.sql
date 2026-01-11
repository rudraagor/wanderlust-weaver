-- Add place_id column to itineraries table to link itineraries to places
ALTER TABLE public.itineraries 
ADD COLUMN place_id uuid REFERENCES public.places(id);

-- Create index for efficient queries by place_id
CREATE INDEX idx_itineraries_place_id ON public.itineraries(place_id);