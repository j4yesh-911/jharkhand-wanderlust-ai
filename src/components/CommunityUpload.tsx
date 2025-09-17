import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useCommunityUploads } from '@/hooks/useCommunityUploads';
import { useAuth } from '@/hooks/useAuth';
import { Upload, Image, Video, FileText, Heart, MessageCircle, MapPin, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const CommunityUpload = () => {
  const { user } = useAuth();
  const { uploads, loading, uploading, uploadFile, likeUpload } = useCommunityUploads();
  const { toast } = useToast();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    location: '',
    tags: '',
    upload_type: 'photo' as 'photo' | 'video',
    category: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (20MB limit)
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 20MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Auto-detect upload type based on file
      if (file.type.startsWith('image/')) {
        setUploadData(prev => ({ ...prev, upload_type: 'photo' }));
      } else if (file.type.startsWith('video/')) {
        setUploadData(prev => ({ ...prev, upload_type: 'video' }));
      }
    }
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to upload content",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!uploadData.category) {
      toast({
        title: "Category Required",
        description: "Please select a category for your upload",
        variant: "destructive",
      });
      return;
    }

    const result = await uploadFile(selectedFile, {
      ...uploadData,
      tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });

    if (result) {
      toast({
        title: "Upload Successful",
        description: "Your content has been uploaded and is pending approval",
      });
      setShowUploadForm(false);
      setUploadData({
        title: '',
        description: '',
        location: '',
        tags: '',
        upload_type: 'photo',
        category: '',
      });
      clearPreview();
    }
  };

  const handleLike = async (uploadId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to like content",
        variant: "destructive",
      });
      return;
    }

    await likeUpload(uploadId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64 mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold mb-4">
          Community <span className="text-primary">Experiences</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Share your travel memories and discover amazing experiences from fellow travelers
        </p>
      </motion.div>

      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Share Your Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showUploadForm ? (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setShowUploadForm(true);
                      setUploadData(prev => ({ ...prev, upload_type: 'photo' }));
                    }}
                    className="flex-1"
                    variant="outline"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowUploadForm(true);
                      setUploadData(prev => ({ ...prev, upload_type: 'video' }));
                    }}
                    className="flex-1"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="file"
                      accept="image/*,video/mp4,video/webm,video/ogg,video/quicktime"
                      onChange={handleFileChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload images or short videos (MP4, WebM, MOV - max 20MB)
                    </p>
                    
                    {previewUrl && selectedFile && (
                      <div className="mt-4 relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Preview:</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            onClick={clearPreview}
                          >
                            Clear
                          </Button>
                        </div>
                        {selectedFile.type.startsWith('image/') ? (
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-md border"
                          />
                        ) : (
                          <video 
                            src={previewUrl} 
                            controls 
                            className="w-full h-48 rounded-md border"
                            preload="metadata"
                          >
                            Your browser does not support video playback.
                          </video>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          File: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Input
                    placeholder="Title for your upload"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />

                  <div>
                    <Select value={uploadData.category} onValueChange={(value) => setUploadData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waterfalls">Waterfalls</SelectItem>
                        <SelectItem value="heritage">Heritage Sites</SelectItem>
                        <SelectItem value="food">Food & Cuisine</SelectItem>
                        <SelectItem value="culture">Cultural Experience</SelectItem>
                        <SelectItem value="adventure">Adventure Sports</SelectItem>
                        <SelectItem value="nature">Nature & Wildlife</SelectItem>
                        <SelectItem value="festivals">Festivals & Events</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea
                    placeholder="Describe your experience..."
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  />
                  
                  <Input
                    placeholder="Location (optional)"
                    value={uploadData.location}
                    onChange={(e) => setUploadData(prev => ({ ...prev, location: e.target.value }))}
                  />
                  
                  <Input
                    placeholder="Tags (comma separated)"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                  />

                  <div className="flex gap-2">
                    <Button type="submit" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setShowUploadForm(false);
                        clearPreview();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploads.map((upload, index) => (
          <motion.div
            key={upload.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative bg-muted">
                {upload.file_url && upload.upload_type === 'photo' && (
                  <img 
                    src={upload.file_url} 
                    alt={upload.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {upload.file_url && upload.upload_type === 'video' && (
                  <video 
                    src={upload.file_url}
                    className="w-full h-full object-cover"
                    controls={false}
                    preload="metadata"
                    poster={upload.thumbnail_url}
                  >
                    <source src={upload.file_url} />
                    Your browser does not support video playback.
                  </video>
                )}
                {!upload.file_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    {upload.upload_type === 'photo' ? (
                      <Image className="w-16 h-16 text-primary/30" />
                    ) : (
                      <Video className="w-16 h-16 text-primary/30" />
                    )}
                  </div>
                )}
                
                {/* Video overlay indicator */}
                {upload.upload_type === 'video' && upload.file_url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                       onClick={(e) => {
                         const video = e.currentTarget.parentElement?.querySelector('video');
                         if (video) {
                           if (video.paused) {
                             video.play();
                             video.setAttribute('controls', 'true');
                           } else {
                             video.pause();
                           }
                         }
                       }}>
                    <div className="bg-white/90 rounded-full p-3">
                      <Video className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                )}
                
                {upload.is_featured && (
                  <Badge className="absolute top-2 right-2" variant="default">
                    Featured
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{upload.title}</h3>
                
                {upload.description && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {upload.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {upload.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{upload.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(upload.created_at)}</span>
                  </div>
                </div>

                 {upload.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1 mb-4">
                     {upload.tags.slice(0, 3).map((tag) => (
                       <Badge key={tag} variant="secondary" className="text-xs">
                         #{tag}
                       </Badge>
                     ))}
                   </div>
                 )}

                 <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                   <span className="capitalize font-medium">Category: {upload.category || 'General'}</span>
                 </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button
                      onClick={() => handleLike(upload.id)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{upload.like_count}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{upload.comment_count}</span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="capitalize">
                    {upload.upload_type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {uploads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No community uploads yet. Be the first to share!</p>
        </div>
      )}
    </section>
  );
};