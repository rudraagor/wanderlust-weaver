import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

// Get users the current user is following
export function useFollowing() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['following', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_connections')
        .select('*')
        .eq('follower_id', user.id);

      if (error) throw error;

      // Fetch profiles for each connection
      const enrichedData = await Promise.all(
        data.map(async (conn) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username, avatar_url, bio')
            .eq('user_id', conn.following_id)
            .single();
          return { ...conn, profile };
        })
      );

      return enrichedData as Connection[];
    },
    enabled: !!user,
  });
}

// Get users following the current user
export function useFollowers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['followers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_connections')
        .select('*')
        .eq('following_id', user.id);

      if (error) throw error;

      // Fetch profiles for each connection
      const enrichedData = await Promise.all(
        data.map(async (conn) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username, avatar_url, bio')
            .eq('user_id', conn.follower_id)
            .single();
          return { ...conn, profile };
        })
      );

      return enrichedData as Connection[];
    },
    enabled: !!user,
  });
}

// Check if following a specific user
export function useIsFollowing(targetUserId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['is-following', user?.id, targetUserId],
    queryFn: async () => {
      if (!user || !targetUserId) return false;

      const { data, error } = await supabase
        .from('user_connections')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!targetUserId,
  });
}

// Follow a user
export function useFollowUser() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_connections')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        });

      if (error) throw error;
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['is-following', user?.id, targetUserId] });
    },
  });
}

// Unfollow a user
export function useUnfollowUser() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);

      if (error) throw error;
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['is-following', user?.id, targetUserId] });
    },
  });
}

// Get follower count
export function useFollowerCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['follower-count', userId],
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
}

// Get following count
export function useFollowingCount(userId: string | undefined) {
  return useQuery({
    queryKey: ['following-count', userId],
    queryFn: async () => {
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
}
