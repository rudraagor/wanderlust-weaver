-- Add booking_reference column to booked_trips
ALTER TABLE public.booked_trips ADD COLUMN IF NOT EXISTS booking_reference text;

-- Create function to generate booking reference
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.booking_reference := 'WDR-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8));
  RETURN NEW;
END;
$$;

-- Create trigger for booking reference
DROP TRIGGER IF EXISTS set_booking_reference ON public.booked_trips;
CREATE TRIGGER set_booking_reference
  BEFORE INSERT ON public.booked_trips
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_booking_reference();

-- Create function to notify on follow
CREATE OR REPLACE FUNCTION public.notify_on_follow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  follower_name TEXT;
BEGIN
  -- Get follower's name
  SELECT COALESCE(display_name, username, 'Someone') INTO follower_name
  FROM public.profiles
  WHERE user_id = NEW.follower_id;

  -- Create notification for the followed user
  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (
    NEW.following_id,
    'follow',
    'New Follower',
    follower_name || ' started following you',
    NEW.follower_id
  );

  RETURN NEW;
END;
$$;

-- Create trigger for follow notifications
DROP TRIGGER IF EXISTS on_follow_notify ON public.user_connections;
CREATE TRIGGER on_follow_notify
  AFTER INSERT ON public.user_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_follow();

-- Create function to notify on like
CREATE OR REPLACE FUNCTION public.notify_on_like()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  liker_name TEXT;
  itinerary_owner_id UUID;
  itinerary_title TEXT;
BEGIN
  -- Get liker's name
  SELECT COALESCE(display_name, username, 'Someone') INTO liker_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;

  -- Get itinerary info
  SELECT user_id, title INTO itinerary_owner_id, itinerary_title
  FROM public.itineraries
  WHERE id = NEW.itinerary_id;

  -- Don't notify if user liked their own itinerary
  IF itinerary_owner_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Create notification for the itinerary owner
  INSERT INTO public.notifications (user_id, type, title, message, related_id)
  VALUES (
    itinerary_owner_id,
    'like',
    'New Like',
    liker_name || ' liked your itinerary "' || itinerary_title || '"',
    NEW.itinerary_id
  );

  RETURN NEW;
END;
$$;

-- Create trigger for like notifications
DROP TRIGGER IF EXISTS on_like_notify ON public.itinerary_likes;
CREATE TRIGGER on_like_notify
  AFTER INSERT ON public.itinerary_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_like();