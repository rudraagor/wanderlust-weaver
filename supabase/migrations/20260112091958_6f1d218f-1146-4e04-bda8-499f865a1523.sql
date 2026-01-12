-- First, drop ALL existing policies on these tables to start fresh
DROP POLICY IF EXISTS "Users can view participants in their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can add participants to conversations they created" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can leave their conversations" ON public.conversation_participants;
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages to their conversations" ON public.messages;

-- Drop old functions
DROP FUNCTION IF EXISTS public.is_conversation_participant(uuid, uuid);
DROP FUNCTION IF EXISTS public.get_user_conversation_ids(uuid);

-- Create a simpler security definer function that checks if user is in a conversation
CREATE OR REPLACE FUNCTION public.user_is_participant(_user_id uuid, _conversation_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.conversation_participants
    WHERE user_id = _user_id
      AND conversation_id = _conversation_id
  );
END;
$$;

-- CONVERSATION_PARTICIPANTS policies - use direct user_id match where possible
-- Policy for SELECT: Users can see participants in conversations where they are a member
CREATE POLICY "view_participants_policy"
ON public.conversation_participants
FOR SELECT
USING (public.user_is_participant(auth.uid(), conversation_id));

-- Policy for INSERT: Only conversation creator OR adding yourself
CREATE POLICY "insert_participants_policy"
ON public.conversation_participants
FOR INSERT
WITH CHECK (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = conversation_id AND c.created_by = auth.uid()
  )
);

-- Policy for DELETE: Users can only remove themselves
CREATE POLICY "delete_participants_policy"
ON public.conversation_participants
FOR DELETE
USING (user_id = auth.uid());

-- Policy for UPDATE: Allow users to update their own participation (e.g., last_read_at)
CREATE POLICY "update_participants_policy"
ON public.conversation_participants
FOR UPDATE
USING (user_id = auth.uid());

-- CONVERSATIONS policies
-- Policy for SELECT: Users can view conversations they're part of
CREATE POLICY "view_conversations_policy"
ON public.conversations
FOR SELECT
USING (public.user_is_participant(auth.uid(), id));

-- Policy for INSERT: Anyone can create a conversation
CREATE POLICY "create_conversations_policy"
ON public.conversations
FOR INSERT
WITH CHECK (created_by = auth.uid());

-- Policy for UPDATE: Participants can update conversations
CREATE POLICY "update_conversations_policy"
ON public.conversations
FOR UPDATE
USING (public.user_is_participant(auth.uid(), id));

-- MESSAGES policies
-- Policy for SELECT: Users can view messages in conversations they're part of
CREATE POLICY "view_messages_policy"
ON public.messages
FOR SELECT
USING (public.user_is_participant(auth.uid(), conversation_id));

-- Policy for INSERT: Users can send messages to conversations they're part of
CREATE POLICY "send_messages_policy"
ON public.messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  public.user_is_participant(auth.uid(), conversation_id)
);