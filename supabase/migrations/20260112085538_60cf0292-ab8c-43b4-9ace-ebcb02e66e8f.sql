-- Enable realtime for conversations only (messages already enabled)
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;