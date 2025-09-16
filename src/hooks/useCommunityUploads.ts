import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CommunityUpload {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  thumbnail_url?: string;
  upload_type: 'photo' | 'video';
  location?: string;
  coordinates?: any;
  tags: string[];
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  is_approved: boolean;
  user_id: string;
  destination_id?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export const useCommunityUploads = () => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<CommunityUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('community_uploads')
        .select('*')
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setUploads(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
  uploadData: {
    title: string;
    description?: string;
    upload_type: 'photo' | 'video';
    location?: string;
    tags: string[];
    destination_id?: string;
    category?: string;
  }
  ) => {
    if (!user) {
      setError('User must be logged in to upload');
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('community-uploads')
        .upload(fileName, file);

      if (uploadError) {
        setError(uploadError.message);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('community-uploads')
        .getPublicUrl(fileName);

      // Create database record
      const { data, error: dbError } = await supabase
        .from('community_uploads')
        .insert({
          ...uploadData,
          file_url: publicUrl,
          user_id: user.id,
        })
        .select()
        .single();

      if (dbError) {
        setError(dbError.message);
        return null;
      }

      await fetchUploads();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const likeUpload = async (uploadId: string) => {
    if (!user) {
      setError('User must be logged in to like');
      return false;
    }

    try {
      const { error } = await supabase
        .from('likes')
        .insert({
          upload_id: uploadId,
          user_id: user.id,
        });

      if (error) {
        // Check if already liked
        if (error.code === '23505') {
          // Remove like if already exists
          const { error: deleteError } = await supabase
            .from('likes')
            .delete()
            .eq('upload_id', uploadId)
            .eq('user_id', user.id);

          if (deleteError) {
            setError(deleteError.message);
            return false;
          }
        } else {
          setError(error.message);
          return false;
        }
      }

      await fetchUploads();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return {
    uploads,
    loading,
    error,
    uploading,
    refetch: fetchUploads,
    uploadFile,
    likeUpload,
  };
};