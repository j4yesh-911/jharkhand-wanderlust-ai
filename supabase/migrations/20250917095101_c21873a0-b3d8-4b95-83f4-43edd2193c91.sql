-- Create public storage bucket for community uploads (idempotent)
insert into storage.buckets (id, name, public)
select 'community-uploads', 'community-uploads', true
where not exists (
  select 1 from storage.buckets where id = 'community-uploads'
);

-- Allow public read access to files in this bucket
create policy if not exists "Public can view community uploads"
on storage.objects for select
using (bucket_id = 'community-uploads');

-- Allow authenticated users to upload files to their own folder (userId/filename)
create policy if not exists "Users can upload to their folder"
on storage.objects for insert
with check (
  bucket_id = 'community-uploads'
  and auth.role() = 'authenticated'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own files
create policy if not exists "Users can update their own files"
on storage.objects for update
using (
  bucket_id = 'community-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own files
create policy if not exists "Users can delete their own files"
on storage.objects for delete
using (
  bucket_id = 'community-uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);