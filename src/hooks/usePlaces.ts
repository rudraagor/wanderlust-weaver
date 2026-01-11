import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Import images to get bundled URLs
import santoriniImg from '@/assets/santorini.jpg';
import tokyoImg from '@/assets/tokyo.jpg';
import machuPicchuImg from '@/assets/machu-picchu.jpg';
import maldivesImg from '@/assets/maldives.jpg';
import parisImg from '@/assets/paris.jpg';
import baliImg from '@/assets/bali.jpg';

// Image map for place names to bundled assets
const placeImageMap: Record<string, string> = {
  'santorini': santoriniImg,
  'tokyo': tokyoImg,
  'machu picchu': machuPicchuImg,
  'maldives': maldivesImg,
  'paris': parisImg,
  'bali': baliImg,
};

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
  // First, check if it's a bundled Vite asset or old-style path that needs resolution
  const lowerName = placeName.toLowerCase();
  
  // If imageUrl contains Vite bundled paths or src/assets paths, use the imported images instead
  if (!imageUrl || 
      imageUrl.startsWith('/assets/') || 
      imageUrl.startsWith('/src/assets/') ||
      imageUrl.startsWith('/santorini') ||
      imageUrl.startsWith('/tokyo') ||
      imageUrl.startsWith('/machu-picchu') ||
      imageUrl.startsWith('/maldives') ||
      imageUrl.startsWith('/paris') ||
      imageUrl.startsWith('/bali')) {
    return placeImageMap[lowerName] || '/placeholder.svg';
  }
  
  // If it's an external URL (http/https), use it directly
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // For any other case, try to match by name
  return placeImageMap[lowerName] || imageUrl || '/placeholder.svg';
}

// Resolve any image URL to a proper displayable URL
export function resolveImageUrl(imageUrl: string | null | undefined, fallbackPlaceName?: string): string {
  if (!imageUrl) {
    // Try to resolve by place name
    if (fallbackPlaceName) {
      const lowerName = fallbackPlaceName.toLowerCase();
      return placeImageMap[lowerName] || '/placeholder.svg';
    }
    return '/placeholder.svg';
  }
  
  // If it's already a valid URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a Supabase storage URL pattern, return it
  if (imageUrl.includes('supabase') || imageUrl.includes('storage')) {
    return imageUrl;
  }
  
  // Check for Vite bundled paths or src/assets paths - these need resolution
  if (imageUrl.startsWith('/assets/') || imageUrl.startsWith('/src/assets/')) {
    // Try to extract the place name from the path
    const pathParts = imageUrl.toLowerCase().split('/');
    const fileName = pathParts[pathParts.length - 1];
    
    // Map file names to places
    if (fileName.includes('santorini')) return placeImageMap['santorini'];
    if (fileName.includes('tokyo')) return placeImageMap['tokyo'];
    if (fileName.includes('machu-picchu')) return placeImageMap['machu picchu'];
    if (fileName.includes('maldives')) return placeImageMap['maldives'];
    if (fileName.includes('paris')) return placeImageMap['paris'];
    if (fileName.includes('bali')) return placeImageMap['bali'];
    
    // If we have a fallback name, use it
    if (fallbackPlaceName) {
      const lowerName = fallbackPlaceName.toLowerCase();
      return placeImageMap[lowerName] || '/placeholder.svg';
    }
    
    return '/placeholder.svg';
  }
  
  // For simple paths like /paris.jpg, try to resolve
  const simpleMatch = imageUrl.match(/\/([a-z-]+)\.(jpg|png|jpeg|webp)/i);
  if (simpleMatch) {
    const placeName = simpleMatch[1].toLowerCase().replace(/-/g, ' ');
    return placeImageMap[placeName] || imageUrl;
  }
  
  return imageUrl;
}
