-- Create enum types for better data integrity
CREATE TYPE destination_category AS ENUM ('waterfall', 'heritage', 'adventure', 'culture', 'nature', 'museum', 'eco_park');
CREATE TYPE event_type AS ENUM ('festival', 'workshop', 'exhibition', 'performance', 'fair');
CREATE TYPE upload_type AS ENUM ('photo', 'video');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destinations table
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category destination_category NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB, -- {lat: number, lng: number}
  images TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  features TEXT[] DEFAULT '{}',
  best_time_to_visit TEXT,
  entry_fee TEXT,
  timings TEXT,
  how_to_reach TEXT,
  nearby_attractions TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cultural_events table
CREATE TABLE public.cultural_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type event_type NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  image_url TEXT,
  organizer TEXT,
  contact_info JSONB,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itineraries table
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  budget_estimate DECIMAL(10,2),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create itinerary_destinations junction table
CREATE TABLE public.itinerary_destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  visit_order INTEGER NOT NULL,
  notes TEXT,
  UNIQUE(itinerary_id, destination_id)
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  images TEXT[] DEFAULT '{}',
  visit_date DATE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

-- Create community_uploads table
CREATE TABLE public.community_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  upload_type upload_type NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  location TEXT,
  coordinates JSONB,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create likes table
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upload_id UUID NOT NULL REFERENCES public.community_uploads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, upload_id)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upload_id UUID NOT NULL REFERENCES public.community_uploads(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for destinations (public read)
CREATE POLICY "Destinations are viewable by everyone" 
ON public.destinations FOR SELECT USING (true);

-- Create RLS policies for cultural_events (public read)
CREATE POLICY "Cultural events are viewable by everyone" 
ON public.cultural_events FOR SELECT USING (true);

-- Create RLS policies for itineraries
CREATE POLICY "Users can view public itineraries or their own" 
ON public.itineraries FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own itineraries" 
ON public.itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own itineraries" 
ON public.itineraries FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own itineraries" 
ON public.itineraries FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for itinerary_destinations
CREATE POLICY "Users can view itinerary destinations if they can view the itinerary" 
ON public.itinerary_destinations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.itineraries i 
    WHERE i.id = itinerary_id 
    AND (i.is_public = true OR i.user_id = auth.uid())
  )
);

CREATE POLICY "Users can manage their own itinerary destinations" 
ON public.itinerary_destinations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.itineraries i 
    WHERE i.id = itinerary_id 
    AND i.user_id = auth.uid()
  )
);

-- Create RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" 
ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for community_uploads
CREATE POLICY "Approved uploads are viewable by everyone" 
ON public.community_uploads FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create their own uploads" 
ON public.community_uploads FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" 
ON public.community_uploads FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads" 
ON public.community_uploads FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.likes FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments" 
ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_destinations_category ON public.destinations(category);
CREATE INDEX idx_destinations_rating ON public.destinations(rating DESC);
CREATE INDEX idx_destinations_location ON public.destinations(location);
CREATE INDEX idx_cultural_events_date ON public.cultural_events(start_date);
CREATE INDEX idx_reviews_destination ON public.reviews(destination_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_community_uploads_user ON public.community_uploads(user_id);
CREATE INDEX idx_community_uploads_destination ON public.community_uploads(destination_id);
CREATE INDEX idx_community_uploads_created ON public.community_uploads(created_at DESC);
CREATE INDEX idx_likes_upload ON public.likes(upload_id);
CREATE INDEX idx_comments_upload ON public.comments(upload_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cultural_events_updated_at
  BEFORE UPDATE ON public.cultural_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_uploads_updated_at
  BEFORE UPDATE ON public.community_uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update destination ratings
CREATE OR REPLACE FUNCTION public.update_destination_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.destinations 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1) 
      FROM public.reviews 
      WHERE destination_id = COALESCE(NEW.destination_id, OLD.destination_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE destination_id = COALESCE(NEW.destination_id, OLD.destination_id)
    )
  WHERE id = COALESCE(NEW.destination_id, OLD.destination_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers to update destination ratings when reviews change
CREATE TRIGGER update_destination_rating_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_destination_rating();

CREATE TRIGGER update_destination_rating_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_destination_rating();

CREATE TRIGGER update_destination_rating_on_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_destination_rating();

-- Function to update upload counts
CREATE OR REPLACE FUNCTION public.update_upload_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'likes' THEN
    UPDATE public.community_uploads 
    SET like_count = (
      SELECT COUNT(*) FROM public.likes WHERE upload_id = COALESCE(NEW.upload_id, OLD.upload_id)
    )
    WHERE id = COALESCE(NEW.upload_id, OLD.upload_id);
  ELSIF TG_TABLE_NAME = 'comments' THEN
    UPDATE public.community_uploads 
    SET comment_count = (
      SELECT COUNT(*) FROM public.comments WHERE upload_id = COALESCE(NEW.upload_id, OLD.upload_id) AND parent_id IS NULL
    )
    WHERE id = COALESCE(NEW.upload_id, OLD.upload_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Triggers to update upload counts
CREATE TRIGGER update_like_count
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_upload_counts();

CREATE TRIGGER update_comment_count
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_upload_counts();