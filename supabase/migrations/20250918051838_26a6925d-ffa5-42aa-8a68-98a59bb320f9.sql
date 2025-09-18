-- Fix likes table privacy issue
-- Drop the overly permissive policy that allows everyone to see all likes
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;

-- Create a more secure policy that only allows users to see their own likes
-- This prevents user behavior tracking while maintaining functionality
CREATE POLICY "Users can only view their own likes" 
ON public.likes 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Note: Aggregated like counts will still be visible through the like_count 
-- column on community_uploads table, which is updated by triggers