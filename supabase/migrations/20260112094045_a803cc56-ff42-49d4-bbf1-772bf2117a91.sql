-- Fix: User emails exposed as public usernames
-- This creates privacy risks and enables email harvesting

-- Step 1: Update the handle_new_user function to generate anonymous usernames
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id, 
    'user_' || SUBSTR(MD5(RANDOM()::TEXT || NEW.id::TEXT), 1, 10),
    split_part(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 2: Migrate existing users who have email-based usernames
-- Replace emails with anonymous usernames (pattern: contains @ symbol)
UPDATE public.profiles
SET username = 'user_' || SUBSTR(MD5(RANDOM()::TEXT || user_id::TEXT), 1, 10)
WHERE username LIKE '%@%';