import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface ItineraryDestination {
  id: string;
  itinerary_id: string;
  destination_id: string;
  day_number: number;
  visit_order: number;
  notes?: string;
  destination?: {
    id: string;
    name: string;
    location: string;
    description: string;
    category: string;
  };
}

export interface Itinerary {
  id: string;
  title: string;
  description?: string;
  duration_days: number;
  budget_estimate?: number;
  is_public: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  destinations?: ItineraryDestination[];
}

export const useItinerary = () => {
  const { user } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('itineraries')
        .select(`
          *,
          destinations:itinerary_destinations(
            *,
            destination:destinations(id, name, location, description, category)
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setItineraries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createItinerary = async (itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) {
      setError('User must be logged in to create itinerary');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          ...itinerary,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }

      await fetchItineraries();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const addDestinationToItinerary = async (
    itineraryId: string,
    destinationId: string,
    dayNumber: number,
    visitOrder: number,
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from('itinerary_destinations')
        .insert({
          itinerary_id: itineraryId,
          destination_id: destinationId,
          day_number: dayNumber,
          visit_order: visitOrder,
          notes,
        });

      if (error) {
        setError(error.message);
        return false;
      }

      await fetchItineraries();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const generateAIItinerary = async (preferences: {
    duration: number;
    interests: string[];
    budget?: string;
    groupSize?: number;
  }) => {
    try {
      // This will call our AI edge function once the OpenAI key is added
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: `Create a ${preferences.duration}-day itinerary for Jharkhand focusing on ${preferences.interests.join(', ')}. Budget: ${preferences.budget || 'moderate'}. Group size: ${preferences.groupSize || 2} people. Please provide a detailed day-by-day plan.`,
          type: 'itinerary'
        }
      });

      if (error) {
        console.error('AI generation error:', error);
        // Return a fallback itinerary
        return {
          title: `${preferences.duration}-Day Jharkhand Adventure`,
          description: 'AI-generated itinerary will be available once OpenAI integration is configured.',
          suggestions: [
            'Day 1: Explore Ranchi - Tagore Hill, Rock Garden',
            'Day 2: Visit Hundru Falls and Jonha Falls',
            'Day 3: Cultural tour - Tribal museums and local markets'
          ]
        };
      }

      return data;
    } catch (err) {
      console.error('Error generating AI itinerary:', err);
      return {
        title: 'Suggested Itinerary',
        description: 'Basic itinerary suggestion',
        suggestions: ['Explore major attractions', 'Experience local culture', 'Visit natural wonders']
      };
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  return {
    itineraries,
    loading,
    error,
    refetch: fetchItineraries,
    createItinerary,
    addDestinationToItinerary,
    generateAIItinerary,
  };
};