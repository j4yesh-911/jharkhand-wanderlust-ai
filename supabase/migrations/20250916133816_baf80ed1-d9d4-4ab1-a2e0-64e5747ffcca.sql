-- Add category column to community_uploads table
ALTER TABLE public.community_uploads 
ADD COLUMN category text;

-- Update existing records to have a default category
UPDATE public.community_uploads 
SET category = 'general' 
WHERE category IS NULL;