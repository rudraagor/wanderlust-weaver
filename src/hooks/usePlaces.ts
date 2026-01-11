import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlaceToVisit {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  display_order: number | null;
}

export interface PlaceEvent {
  id: string;
  month: string;
  events: string[];
}

export interface PlaceRule {
  id: string;
  rule: string;
  display_order: number | null;
}

export interface PlaceTip {
  id: string;
  tip: string;
  display_order: number | null;
}

export interface Place {
  id: string;
  name: string;
  country: string;
  image_url: string | null;
  description: string | null;
  long_description: string | null;
  best_time_period: string | null;
  best_time_description: string | null;
  best_time_weather: string | null;
  is_featured: boolean;
  display_order: number | null;
}

export interface PlaceWithDetails extends Place {
  places_to_visit: PlaceToVisit[];
  place_events: PlaceEvent[];
  place_rules: PlaceRule[];
  place_tips: PlaceTip[];
}

// Fetch all places
export function usePlaces() {
  return useQuery({
    queryKey: ['places'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Place[];
    },
  });
}

// Fetch featured places for home page
export function useFeaturedPlaces() {
  return useQuery({
    queryKey: ['places', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data as Place[];
    },
  });
}

// Fetch single place with all details
export function usePlaceDetails(placeId: string | undefined) {
  return useQuery({
    queryKey: ['places', placeId],
    queryFn: async () => {
      if (!placeId) return null;

      // Fetch place
      const { data: place, error: placeError } = await supabase
        .from('places')
        .select('*')
        .eq('id', placeId)
        .maybeSingle();
      
      if (placeError) throw placeError;
      if (!place) return null;

      // Fetch related data in parallel
      const [placesToVisit, events, rules, tips] = await Promise.all([
        supabase
          .from('places_to_visit')
          .select('*')
          .eq('place_id', placeId)
          .order('display_order', { ascending: true }),
        supabase
          .from('place_events')
          .select('*')
          .eq('place_id', placeId),
        supabase
          .from('place_rules')
          .select('*')
          .eq('place_id', placeId)
          .order('display_order', { ascending: true }),
        supabase
          .from('place_tips')
          .select('*')
          .eq('place_id', placeId)
          .order('display_order', { ascending: true }),
      ]);

      if (placesToVisit.error) throw placesToVisit.error;
      if (events.error) throw events.error;
      if (rules.error) throw rules.error;
      if (tips.error) throw tips.error;

      return {
        ...place,
        places_to_visit: placesToVisit.data || [],
        place_events: events.data || [],
        place_rules: rules.data || [],
        place_tips: tips.data || [],
      } as PlaceWithDetails;
    },
    enabled: !!placeId,
  });
}

// Get image URL for a place (handles both local assets and URLs)
export function getPlaceImageUrl(imageUrl: string | null, placeName: string): string {
  if (!imageUrl) {
    // Fallback to local assets based on place name
    const nameToAsset: Record<string, string> = {
      'santorini': '/src/assets/santorini.jpg',
      'tokyo': '/src/assets/tokyo.jpg',
      'machu picchu': '/src/assets/machu-picchu.jpg',
      'maldives': '/src/assets/maldives.jpg',
      'paris': '/src/assets/paris.jpg',
      'bali': '/src/assets/bali.jpg',
    };
    return nameToAsset[placeName.toLowerCase()] || '/placeholder.svg';
  }
  return imageUrl;
}
