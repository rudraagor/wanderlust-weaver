import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  country: string | null;
  cover_image: string | null;
  start_date: string | null;
  end_date: string | null;
  nights: number | null;
  budget: string | null;
  is_public: boolean;
  is_ai_generated: boolean;
  total_cost: number | null;
  likes_count: number;
  created_at: string;
  updated_at: string;
  place_id: string | null;
}

export interface ItineraryWithDetails extends Itinerary {
  profiles?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  flights?: ItineraryFlight[];
  hotels?: ItineraryHotel[];
  days?: ItineraryDay[];
  photos?: ItineraryPhoto[];
}

export interface ItineraryFlight {
  id: string;
  itinerary_id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string | null;
  arrival_time: string | null;
  airline: string | null;
  flight_number: string | null;
  price: number | null;
}

export interface ItineraryHotel {
  id: string;
  itinerary_id: string;
  name: string;
  rating: number | null;
  price_per_night: number | null;
  check_in: string | null;
  check_out: string | null;
  image_url: string | null;
}

export interface ItineraryDay {
  id: string;
  itinerary_id: string;
  day_number: number;
  date: string | null;
  activities?: ItineraryActivity[];
  restaurants?: ItineraryRestaurant[];
}

export interface ItineraryActivity {
  id: string;
  day_id: string;
  name: string;
  time: string | null;
  duration: string | null;
  price: number | null;
  category: string | null;
  description: string | null;
}

export interface ItineraryRestaurant {
  id: string;
  day_id: string;
  name: string;
  cuisine: string | null;
  meal_type: string | null;
  price_range: string | null;
}

export interface ItineraryPhoto {
  id: string;
  itinerary_id: string;
  photo_url: string;
  caption: string | null;
}

// Fetch public itineraries for explore page
export function usePublicItineraries() {
  return useQuery({
    queryKey: ['public-itineraries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('is_public', true)
        .order('likes_count', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch profiles for each itinerary
      const enrichedData = await Promise.all(
        (data || []).map(async (itinerary) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username, avatar_url')
            .eq('user_id', itinerary.user_id)
            .single();
          return { ...itinerary, profiles: profile };
        })
      );

      return enrichedData as ItineraryWithDetails[];
    },
  });
}

// Fetch itineraries by place ID
export function useItinerariesByPlace(placeId: string | undefined) {
  return useQuery({
    queryKey: ['itineraries-by-place', placeId],
    queryFn: async () => {
      if (!placeId) return [];
      
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('place_id', placeId)
        .eq('is_public', true)
        .order('likes_count', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each itinerary
      const enrichedData = await Promise.all(
        (data || []).map(async (itinerary) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username, avatar_url')
            .eq('user_id', itinerary.user_id)
            .single();
          return { ...itinerary, profiles: profile };
        })
      );

      return enrichedData as ItineraryWithDetails[];
    },
    enabled: !!placeId,
  });
}

// Fetch user's own itineraries
export function useMyItineraries() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-itineraries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Itinerary[];
    },
    enabled: !!user,
  });
}

// Fetch a single itinerary with full details
export function useItinerary(id: string | undefined) {
  return useQuery({
    queryKey: ['itinerary', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: itinerary, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url')
        .eq('user_id', itinerary.user_id)
        .single();

      // Fetch related data
      const [flightsRes, hotelsRes, daysRes, photosRes] = await Promise.all([
        supabase.from('itinerary_flights').select('*').eq('itinerary_id', id),
        supabase.from('itinerary_hotels').select('*').eq('itinerary_id', id),
        supabase.from('itinerary_days').select('*').eq('itinerary_id', id).order('day_number'),
        supabase.from('itinerary_photos').select('*').eq('itinerary_id', id),
      ]);

      // Fetch activities and restaurants for each day
      const daysWithDetails = await Promise.all(
        (daysRes.data || []).map(async (day) => {
          const [activitiesRes, restaurantsRes] = await Promise.all([
            supabase.from('itinerary_activities').select('*').eq('day_id', day.id),
            supabase.from('itinerary_restaurants').select('*').eq('day_id', day.id),
          ]);
          return {
            ...day,
            itinerary_activities: activitiesRes.data || [],
            itinerary_restaurants: restaurantsRes.data || [],
          };
        })
      );

      return {
        ...itinerary,
        profiles: profile,
        itinerary_flights: flightsRes.data || [],
        itinerary_hotels: hotelsRes.data || [],
        itinerary_days: daysWithDetails,
        itinerary_photos: photosRes.data || [],
      };
    },
    enabled: !!id,
  });
}

// Alias for useItinerary
export const useItineraryById = useItinerary;

// Get user likes
export function useUserLikes(userId: string) {
  return useQuery({
    queryKey: ['user-likes', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('itinerary_likes')
        .select('itinerary_id')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// Get user saved itineraries IDs
export function useUserSavedItineraries(userId: string) {
  return useQuery({
    queryKey: ['user-saved', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('saved_itineraries')
        .select('itinerary_id')
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// Create a new itinerary
export function useCreateItinerary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      destination: string;
      country?: string;
      cover_image?: string;
      start_date?: string;
      end_date?: string;
      nights?: number;
      budget?: string;
      is_public?: boolean;
      is_ai_generated?: boolean;
      total_cost?: number;
      place_id?: string;
      flights?: Omit<ItineraryFlight, 'id' | 'itinerary_id'>[];
      hotels?: Omit<ItineraryHotel, 'id' | 'itinerary_id'>[];
      days?: {
        day_number: number;
        date?: string;
        activities?: Omit<ItineraryActivity, 'id' | 'day_id'>[];
        restaurants?: Omit<ItineraryRestaurant, 'id' | 'day_id'>[];
      }[];
      photos?: { photo_url: string; caption?: string }[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Create the itinerary
      const { data: itinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          user_id: user.id,
          title: data.title,
          destination: data.destination,
          country: data.country,
          cover_image: data.cover_image,
          start_date: data.start_date,
          end_date: data.end_date,
          nights: data.nights,
          budget: data.budget,
          is_public: data.is_public ?? false,
          is_ai_generated: data.is_ai_generated ?? false,
          total_cost: data.total_cost,
          place_id: data.place_id,
        })
        .select()
        .single();

      if (itineraryError) throw itineraryError;

      // Insert flights
      if (data.flights?.length) {
        const { error: flightsError } = await supabase
          .from('itinerary_flights')
          .insert(data.flights.map(f => ({ ...f, itinerary_id: itinerary.id })));
        if (flightsError) throw flightsError;
      }

      // Insert hotels
      if (data.hotels?.length) {
        const { error: hotelsError } = await supabase
          .from('itinerary_hotels')
          .insert(data.hotels.map(h => ({ ...h, itinerary_id: itinerary.id })));
        if (hotelsError) throw hotelsError;
      }

      // Insert days with activities and restaurants
      if (data.days?.length) {
        for (const day of data.days) {
          const { data: dayData, error: dayError } = await supabase
            .from('itinerary_days')
            .insert({
              itinerary_id: itinerary.id,
              day_number: day.day_number,
              date: day.date,
            })
            .select()
            .single();

          if (dayError) throw dayError;

          if (day.activities?.length) {
            const { error: activitiesError } = await supabase
              .from('itinerary_activities')
              .insert(day.activities.map(a => ({ ...a, day_id: dayData.id })));
            if (activitiesError) throw activitiesError;
          }

          if (day.restaurants?.length) {
            const { error: restaurantsError } = await supabase
              .from('itinerary_restaurants')
              .insert(day.restaurants.map(r => ({ ...r, day_id: dayData.id })));
            if (restaurantsError) throw restaurantsError;
          }
        }
      }

      // Insert photos
      if (data.photos?.length) {
        const { error: photosError } = await supabase
          .from('itinerary_photos')
          .insert(data.photos.map(p => ({ ...p, itinerary_id: itinerary.id })));
        if (photosError) throw photosError;
      }

      return itinerary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['itineraries-by-place'] });
    },
  });
}

// Toggle itinerary public/private
export function useToggleItineraryVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_public }: { id: string; is_public: boolean }) => {
      const { error } = await supabase
        .from('itineraries')
        .update({ is_public })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
    },
  });
}

// Like an itinerary
export function useLikeItinerary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (itineraryId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('itinerary_likes')
        .insert({ itinerary_id: itineraryId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['user-likes'] });
    },
  });
}

// Unlike an itinerary
export function useUnlikeItinerary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (itineraryId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('itinerary_likes')
        .delete()
        .eq('itinerary_id', itineraryId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['public-itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['user-likes'] });
    },
  });
}

// Check if user liked itineraries
export function useLikedItineraries() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['liked-itineraries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('itinerary_likes')
        .select('itinerary_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(d => d.itinerary_id);
    },
    enabled: !!user,
  });
}

// Save an itinerary
export function useSaveItinerary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (itineraryId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_itineraries')
        .insert({ itinerary_id: itineraryId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-itineraries'] });
    },
  });
}

// Unsave an itinerary
export function useUnsaveItinerary() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (itineraryId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('saved_itineraries')
        .delete()
        .eq('itinerary_id', itineraryId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-itineraries'] });
      queryClient.invalidateQueries({ queryKey: ['user-saved'] });
    },
  });
}

// Get saved itineraries with full details
export interface SavedItinerary {
  id: string;
  itinerary_id: string;
  itinerary: Itinerary | null;
}

export function useSavedItineraries() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['saved-itineraries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('saved_itineraries')
        .select(`
          id,
          itinerary_id,
          itineraries(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Return the full structure with id, itinerary_id, and nested itinerary
      return data.map(d => ({
        id: d.id,
        itinerary_id: d.itinerary_id,
        itinerary: d.itineraries as Itinerary | null,
      })) as SavedItinerary[];
    },
    enabled: !!user,
  });
}

// Upload itinerary photo
export function useUploadItineraryPhoto() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('itinerary-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('itinerary-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    },
  });
}
