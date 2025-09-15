import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface Destination {
  id: string;
  name: string;
  description: string;
  category: 'waterfall' | 'heritage' | 'adventure' | 'culture' | 'nature' | 'museum' | 'eco_park';
  location: string;
  coordinates?: Json;
  images: string[];
  rating: number;
  review_count: number;
  features: string[];
  best_time_to_visit?: string;
  entry_fee?: string;
  timings?: string;
  how_to_reach?: string;
  nearby_attractions: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseDestinationsResult {
  destinations: Destination[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDestinations = (): UseDestinationsResult => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('destinations')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false });


      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setDestinations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  return {
    destinations,
    loading,
    error,
    refetch: fetchDestinations,
  };
};

export const useDestination = (id: string) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('destinations')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        setDestination(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  return { destination, loading, error };
};