import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'festival' | 'workshop' | 'exhibition' | 'performance' | 'fair';
  location: string;
  start_date: string;
  end_date?: string;
  image_url?: string;
  organizer?: string;
  contact_info?: any;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useCulturalEvents = () => {
  const [events, setEvents] = useState<CulturalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('cultural_events')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('start_date', { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
};