import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
}

export function useSearchProfiles(query: string) {
  const [results, setResults] = useState<SearchProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchProfiles = async () => {
      if (!query || query.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchTerm = `%${query.trim()}%`;
        const { data, error } = await supabase
          .from('profiles')
          .select('id, user_id, display_name, username, avatar_url')
          .or(`display_name.ilike.${searchTerm},username.ilike.${searchTerm}`)
          .limit(10);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching profiles:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(searchProfiles, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading };
}
