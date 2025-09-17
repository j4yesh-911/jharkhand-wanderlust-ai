-- Create public storage bucket for community uploads (idempotent)
INSERT INTO storage.buckets (id, name, public)
SELECT 'community-uploads', 'community-uploads', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'community-uploads'
);

-- Allow public read access to files in this bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view community uploads'
  ) THEN
    CREATE POLICY "Public can view community uploads"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'community-uploads');
  END IF;
END $$;

-- Allow authenticated users to upload files to their own folder (userId/filename)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload to their folder'
  ) THEN
    CREATE POLICY "Users can upload to their folder"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'community-uploads'
      AND auth.role() = 'authenticated'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Allow authenticated users to update their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their own files'
  ) THEN
    CREATE POLICY "Users can update their own files"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'community-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Allow authenticated users to delete their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete their own files'
  ) THEN
    CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'community-uploads'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;