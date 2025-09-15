import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Food {
  id: string;
  name: string;
  description: string;
  category: string;
  region: string;
  ingredients: string[];
  preparation_method: string;
  image_url: string;
  restaurant_locations: string[];
  price_range: string;
  spice_level: string;
  dietary_tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export const useFood = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('food')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setFoods(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  return {
    foods,
    loading,
    error,
    refetch: fetchFoods,
  };
};

export const useFoodByCategory = (category?: string) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoodsByCategory = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('food')
        .select('*')
        .order('is_featured', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setFoods(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodsByCategory();
  }, [category]);

  return {
    foods,
    loading,
    error,
    refetch: fetchFoodsByCategory,
  };
};