import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Itinerary } from './useItineraries';

export interface BookedTrip {
  id: string;
  user_id: string;
  itinerary_id: string;
  flights_booked: boolean;
  hotels_booked: boolean;
  activities_booked: boolean;
  booking_status: string;
  is_private: boolean;
  booking_reference: string | null;
  created_at: string;
  updated_at: string;
  itinerary?: Itinerary;
}

// Fetch user's booked trips
export function useBookedTrips() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['booked-trips', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('booked_trips')
        .select(`
          *,
          itineraries(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(d => ({
        ...d,
        itinerary: d.itineraries,
      })) as BookedTrip[];
    },
    enabled: !!user,
  });
}

// Book a trip
export function useBookTrip() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      itineraryId, 
      flightsBooked = false, 
      hotelsBooked = false, 
      activitiesBooked = false,
      isPrivate = false,
      plannedBudget = null
    }: { 
      itineraryId: string; 
      flightsBooked?: boolean;
      hotelsBooked?: boolean;
      activitiesBooked?: boolean;
      isPrivate?: boolean;
      plannedBudget?: number | null;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('booked_trips')
        .insert({
          user_id: user.id,
          itinerary_id: itineraryId,
          flights_booked: flightsBooked,
          hotels_booked: hotelsBooked,
          activities_booked: activitiesBooked,
          is_private: isPrivate,
          booking_status: 'booked',
          planned_budget: plannedBudget,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booked-trips'] });
    },
  });
}

// Update booked trip
export function useUpdateBookedTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<{
        flights_booked: boolean;
        hotels_booked: boolean;
        activities_booked: boolean;
        is_private: boolean;
        booking_status: string;
      }>;
    }) => {
      const { error } = await supabase
        .from('booked_trips')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booked-trips'] });
    },
  });
}

// Toggle trip privacy
export function useToggleTripPrivacy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isPrivate }: { id: string; isPrivate: boolean }) => {
      const { error } = await supabase
        .from('booked_trips')
        .update({ is_private: isPrivate })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booked-trips'] });
    },
  });
}

// Delete booked trip
export function useDeleteBookedTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('booked_trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booked-trips'] });
    },
  });
}
