
-- Add missing columns that the code expects
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'direct';
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS created_by UUID;
