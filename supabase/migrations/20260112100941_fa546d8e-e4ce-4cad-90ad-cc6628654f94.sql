
-- Add last_read_at column that the code expects
ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP WITH TIME ZONE;
