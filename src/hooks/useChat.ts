import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export interface Conversation {
  id: string;
  name: string | null;
  type: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  lastMessage?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

// Fetch all conversations for current user
export function useConversations() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('conversations-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get conversations where user is a participant
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (partError) throw partError;

      const conversationIds = participations.map(p => p.conversation_id);
      if (conversationIds.length === 0) return [];

      // Fetch conversations
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      // Fetch participants and last messages for each conversation
      const enrichedConversations = await Promise.all(
        conversations.map(async (conv) => {
          const [participantsRes, messagesRes] = await Promise.all([
            supabase
              .from('conversation_participants')
              .select('*')
              .eq('conversation_id', conv.id),
            supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: false })
              .limit(1),
          ]);

          // Fetch profiles for participants
          const participantProfiles = await Promise.all(
            (participantsRes.data || []).map(async (p) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, username, avatar_url')
                .eq('user_id', p.user_id)
                .single();
              return { ...p, profile };
            })
          );

          return {
            ...conv,
            participants: participantProfiles,
            lastMessage: messagesRes.data?.[0] || null,
          };
        })
      );

      return enrichedConversations as Conversation[];
    },
    enabled: !!user,
  });
}

// Fetch messages for a conversation with realtime
export function useMessages(conversationId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Set up realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch sender profiles
      const enrichedMessages = await Promise.all(
        messages.map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username, avatar_url')
            .eq('user_id', msg.sender_id)
            .single();
          return { ...msg, sender: profile };
        })
      );

      return enrichedMessages as Message[];
    },
    enabled: !!conversationId && !!user,
  });
}

// Send a message
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// Create a new conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      name, 
      type, 
      participantIds 
    }: { 
      name?: string; 
      type: 'direct' | 'group'; 
      participantIds: string[] 
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          name,
          type,
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add all participants including current user
      const allParticipants = [...new Set([user.id, ...participantIds])];
      const { error: partError } = await supabase
        .from('conversation_participants')
        .insert(
          allParticipants.map(userId => ({
            conversation_id: conversation.id,
            user_id: userId,
          }))
        );

      if (partError) throw partError;

      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// Find or create a direct conversation with a user
export function useFindOrCreateConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Not authenticated');

      // First, find if a direct conversation already exists between these two users
      const { data: myParticipations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (partError) throw partError;

      if (myParticipations && myParticipations.length > 0) {
        const conversationIds = myParticipations.map(p => p.conversation_id);
        
        // Check which of these conversations also have the target user
        const { data: targetParticipations, error: targetError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', targetUserId)
          .in('conversation_id', conversationIds);

        if (targetError) throw targetError;

        if (targetParticipations && targetParticipations.length > 0) {
          // Check if any of these is a direct conversation (only 2 participants)
          for (const tp of targetParticipations) {
            const { data: conv, error: convError } = await supabase
              .from('conversations')
              .select('*')
              .eq('id', tp.conversation_id)
              .eq('type', 'direct')
              .single();

            if (!convError && conv) {
              return conv;
            }
          }
        }
      }

      // No existing conversation, create a new one
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          type: 'direct',
          created_by: user.id,
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add both participants
      const { error: addPartError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user.id },
          { conversation_id: conversation.id, user_id: targetUserId },
        ]);

      if (addPartError) throw addPartError;

      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

// Search users for chat
export function useSearchUsers(query: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['search-users', query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];

      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, username, avatar_url')
        .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq('user_id', user?.id)
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!query && query.length >= 2 && !!user,
  });
}
