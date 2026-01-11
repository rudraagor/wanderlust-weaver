-- Create places table
CREATE TABLE public.places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  long_description TEXT,
  best_time_period TEXT,
  best_time_description TEXT,
  best_time_weather TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create places_to_visit table
CREATE TABLE public.places_to_visit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create place_events table
CREATE TABLE public.place_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create place_rules table
CREATE TABLE public.place_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  rule TEXT NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create place_tips table
CREATE TABLE public.place_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  tip TEXT NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places_to_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_tips ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (places are public)
CREATE POLICY "Places are viewable by everyone" ON public.places FOR SELECT USING (true);
CREATE POLICY "Places to visit are viewable by everyone" ON public.places_to_visit FOR SELECT USING (true);
CREATE POLICY "Place events are viewable by everyone" ON public.place_events FOR SELECT USING (true);
CREATE POLICY "Place rules are viewable by everyone" ON public.place_rules FOR SELECT USING (true);
CREATE POLICY "Place tips are viewable by everyone" ON public.place_tips FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_places_featured ON public.places(is_featured, display_order);
CREATE INDEX idx_places_to_visit_place_id ON public.places_to_visit(place_id, display_order);
CREATE INDEX idx_place_events_place_id ON public.place_events(place_id);
CREATE INDEX idx_place_rules_place_id ON public.place_rules(place_id, display_order);
CREATE INDEX idx_place_tips_place_id ON public.place_tips(place_id, display_order);

-- Add trigger for updated_at
CREATE TRIGGER update_places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();