-- Create food table for food and cuisine module
CREATE TABLE public.food (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'traditional',
  region TEXT,
  ingredients TEXT[],
  preparation_method TEXT,
  image_url TEXT,
  restaurant_locations TEXT[],
  price_range TEXT,
  spice_level TEXT DEFAULT 'medium',
  dietary_tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on food table
ALTER TABLE public.food ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing food items
CREATE POLICY "Food items are viewable by everyone" 
ON public.food 
FOR SELECT 
USING (true);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('community-uploads', 'community-uploads', true),
  ('food-images', 'food-images', true);

-- Create storage policies for community uploads
CREATE POLICY "Community uploads are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'community-uploads');

CREATE POLICY "Users can upload community content" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'community-uploads' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own uploads" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'community-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own uploads" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'community-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policies for food images
CREATE POLICY "Food images are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'food-images');

CREATE POLICY "Authenticated users can upload food images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'food-images' AND 
  auth.uid() IS NOT NULL
);

-- Add trigger for food table timestamps
CREATE TRIGGER update_food_updated_at
BEFORE UPDATE ON public.food
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample food data
INSERT INTO public.food (name, description, category, region, ingredients, preparation_method, image_url, restaurant_locations, price_range, spice_level, dietary_tags, is_featured) VALUES
('Litti Chokha', 'Traditional Bihari dish with roasted wheat balls served with spiced vegetables', 'traditional', 'Jharkhand', ARRAY['Wheat flour', 'Sattu', 'Onions', 'Tomatoes', 'Brinjal', 'Potatoes'], 'Wheat dough balls stuffed with sattu are roasted over coal fire. Served with mashed vegetables cooked with mustard oil and spices.', '/api/placeholder/400/300', ARRAY['Ranchi', 'Jamshedpur', 'Dhanbad'], '₹50-150', 'medium', ARRAY['vegetarian'], true),
('Handia', 'Traditional fermented rice beer popular in tribal communities', 'beverage', 'Jharkhand', ARRAY['Rice', 'Ranu tablets', 'Water'], 'Rice is boiled, mixed with ranu tablets (natural fermentation agent) and fermented for 2-3 days to create this mildly alcoholic beverage.', '/api/placeholder/400/300', ARRAY['Tribal areas', 'Local festivals'], '₹30-80', 'mild', ARRAY['traditional', 'fermented'], true),
('Rugra', 'Wild mushroom curry, a delicacy during monsoon season', 'curry', 'Jharkhand', ARRAY['Wild mushrooms', 'Onions', 'Garlic', 'Green chilies', 'Turmeric'], 'Fresh wild mushrooms are cleaned and cooked with minimal spices to retain their natural flavor. A monsoon specialty.', '/api/placeholder/400/300', ARRAY['Seasonal restaurants', 'Local homes'], '₹100-200', 'mild', ARRAY['vegetarian', 'seasonal'], false),
('Pua', 'Sweet deep-fried pancakes made during festivals', 'dessert', 'Jharkhand', ARRAY['Rice flour', 'Jaggery', 'Milk', 'Ghee'], 'Rice flour batter mixed with jaggery and milk, deep-fried until golden. Traditional festival sweet.', '/api/placeholder/400/300', ARRAY['Festival stalls', 'Sweet shops'], '₹40-100', 'sweet', ARRAY['vegetarian', 'festival'], false),
('Bamboo Shoot Curry', 'Traditional tribal curry made with fresh bamboo shoots', 'curry', 'Jharkhand', ARRAY['Bamboo shoots', 'Mustard oil', 'Dried red chilies', 'Garlic'], 'Fresh bamboo shoots are cleaned, boiled and cooked with mustard oil and spices. Rich in nutrients and fiber.', '/api/placeholder/400/300', ARRAY['Tribal restaurants', 'Eco resorts'], '₹120-250', 'medium', ARRAY['vegetarian', 'tribal'], false),
('Dhuska', 'Deep-fried lentil fritters served with chutney', 'snack', 'Jharkhand', ARRAY['Rice flour', 'Chana dal', 'Ginger', 'Green chilies'], 'Soaked chana dal is ground with spices, mixed with rice flour and deep-fried into crispy fritters.', '/api/placeholder/400/300', ARRAY['Street food stalls', 'Tea shops'], '₹30-80', 'medium', ARRAY['vegetarian'], false);