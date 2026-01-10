-- Create itineraries table
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT,
  cover_image TEXT,
  start_date DATE,
  end_date DATE,
  nights INTEGER,
  budget TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  is_ai_generated BOOLEAN NOT NULL DEFAULT false,
  total_cost DECIMAL(10,2),
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itinerary_flights table
CREATE TABLE public.itinerary_flights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  departure_airport TEXT NOT NULL,
  arrival_airport TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE,
  arrival_time TIMESTAMP WITH TIME ZONE,
  airline TEXT,
  flight_number TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itinerary_hotels table
CREATE TABLE public.itinerary_hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rating INTEGER,
  price_per_night DECIMAL(10,2),
  check_in DATE,
  check_out DATE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itinerary_days table
CREATE TABLE public.itinerary_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itinerary_activities table
CREATE TABLE public.itinerary_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  time TEXT,
  duration TEXT,
  category TEXT,
  price DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itinerary_restaurants table
CREATE TABLE public.itinerary_restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT,
  cuisine TEXT,
  price_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itinerary_photos table
CREATE TABLE public.itinerary_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_itineraries table
CREATE TABLE public.saved_itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, itinerary_id)
);

-- Create itinerary_likes table
CREATE TABLE public.itinerary_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, itinerary_id)
);

-- Create booked_trips table (My Trips)
CREATE TABLE public.booked_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  is_private BOOLEAN NOT NULL DEFAULT false,
  booking_status TEXT NOT NULL DEFAULT 'booked',
  flights_booked BOOLEAN NOT NULL DEFAULT false,
  hotels_booked BOOLEAN NOT NULL DEFAULT false,
  activities_booked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table for chat
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'direct', -- 'direct' or 'group'
  name TEXT, -- For group chats
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversation_participants table
CREATE TABLE public.conversation_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(conversation_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'like', 'save', 'follow', 'message', 'booking'
  title TEXT NOT NULL,
  message TEXT,
  related_id UUID, -- Reference to related entity
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_connections table (follow system for Connect feature)
CREATE TABLE public.user_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS on all tables
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booked_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;

-- Itineraries policies
CREATE POLICY "Users can view public itineraries" ON public.itineraries FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view their own itineraries" ON public.itineraries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own itineraries" ON public.itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own itineraries" ON public.itineraries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own itineraries" ON public.itineraries FOR DELETE USING (auth.uid() = user_id);

-- Itinerary related tables policies (cascade from itinerary access)
CREATE POLICY "Users can view flights for accessible itineraries" ON public.itinerary_flights FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND (is_public = true OR user_id = auth.uid()))
);
CREATE POLICY "Users can manage their itinerary flights" ON public.itinerary_flights FOR ALL USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view hotels for accessible itineraries" ON public.itinerary_hotels FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND (is_public = true OR user_id = auth.uid()))
);
CREATE POLICY "Users can manage their itinerary hotels" ON public.itinerary_hotels FOR ALL USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view days for accessible itineraries" ON public.itinerary_days FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND (is_public = true OR user_id = auth.uid()))
);
CREATE POLICY "Users can manage their itinerary days" ON public.itinerary_days FOR ALL USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view activities for accessible days" ON public.itinerary_activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itinerary_days d JOIN public.itineraries i ON i.id = d.itinerary_id WHERE d.id = day_id AND (i.is_public = true OR i.user_id = auth.uid()))
);
CREATE POLICY "Users can manage their activities" ON public.itinerary_activities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.itinerary_days d JOIN public.itineraries i ON i.id = d.itinerary_id WHERE d.id = day_id AND i.user_id = auth.uid())
);

CREATE POLICY "Users can view restaurants for accessible days" ON public.itinerary_restaurants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itinerary_days d JOIN public.itineraries i ON i.id = d.itinerary_id WHERE d.id = day_id AND (i.is_public = true OR i.user_id = auth.uid()))
);
CREATE POLICY "Users can manage their restaurants" ON public.itinerary_restaurants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.itinerary_days d JOIN public.itineraries i ON i.id = d.itinerary_id WHERE d.id = day_id AND i.user_id = auth.uid())
);

CREATE POLICY "Users can view photos for accessible itineraries" ON public.itinerary_photos FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND (is_public = true OR user_id = auth.uid()))
);
CREATE POLICY "Users can manage their itinerary photos" ON public.itinerary_photos FOR ALL USING (
  EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND user_id = auth.uid())
);

-- Saved itineraries policies
CREATE POLICY "Users can view their saved itineraries" ON public.saved_itineraries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save itineraries" ON public.saved_itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave itineraries" ON public.saved_itineraries FOR DELETE USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Anyone can see likes" ON public.itinerary_likes FOR SELECT USING (true);
CREATE POLICY "Users can like itineraries" ON public.itinerary_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike itineraries" ON public.itinerary_likes FOR DELETE USING (auth.uid() = user_id);

-- Booked trips policies
CREATE POLICY "Users can view their booked trips" ON public.booked_trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public booked trips" ON public.booked_trips FOR SELECT USING (
  is_private = false AND EXISTS (SELECT 1 FROM public.itineraries WHERE id = itinerary_id AND is_public = true)
);
CREATE POLICY "Users can book trips" ON public.booked_trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their bookings" ON public.booked_trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their bookings" ON public.booked_trips FOR DELETE USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);
CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Participants can update conversations" ON public.conversations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);

-- Conversation participants policies
CREATE POLICY "Participants can view other participants" ON public.conversation_participants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants cp WHERE cp.conversation_id = conversation_id AND cp.user_id = auth.uid())
);
CREATE POLICY "Conversation creator can add participants" ON public.conversation_participants FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid()) OR auth.uid() = user_id
);
CREATE POLICY "Users can leave conversations" ON public.conversation_participants FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Participants can view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Participants can send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- User connections policies
CREATE POLICY "Anyone can view connections" ON public.user_connections FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.user_connections FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.user_connections FOR DELETE USING (auth.uid() = follower_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create trigger for updating itinerary likes count
CREATE OR REPLACE FUNCTION public.update_itinerary_likes_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.itineraries SET likes_count = likes_count + 1 WHERE id = NEW.itinerary_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.itineraries SET likes_count = likes_count - 1 WHERE id = OLD.itinerary_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trigger_update_likes_count
AFTER INSERT OR DELETE ON public.itinerary_likes
FOR EACH ROW EXECUTE FUNCTION public.update_itinerary_likes_count();

-- Create storage bucket for itinerary photos
INSERT INTO storage.buckets (id, name, public) VALUES ('itinerary-photos', 'itinerary-photos', true);

-- Storage policies for itinerary photos
CREATE POLICY "Public can view itinerary photos" ON storage.objects FOR SELECT USING (bucket_id = 'itinerary-photos');
CREATE POLICY "Authenticated users can upload itinerary photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'itinerary-photos' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own photos" ON storage.objects FOR UPDATE USING (bucket_id = 'itinerary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own photos" ON storage.objects FOR DELETE USING (bucket_id = 'itinerary-photos' AND auth.uid()::text = (storage.foldername(name))[1]);