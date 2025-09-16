import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useCulturalEvents } from '@/hooks/useCulturalEvents';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Music, 
  Palette, 
  Camera,
  Heart,
  Share2,
  Clock,
  Star
} from 'lucide-react';
import heritageImage from '@/assets/heritage-site.jpg';

const Culture = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { events, loading } = useCulturalEvents();
  
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar },
    { id: 'festival', name: 'Festivals', icon: Music },
    { id: 'workshop', name: 'Workshops', icon: Palette },
    { id: 'exhibition', name: 'Exhibitions', icon: Camera },
    { id: 'performance', name: 'Performances', icon: Users },
  ];

  const handleJoinEvent = (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to join cultural events",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Event Registration",
      description: "You have successfully joined the cultural event!",
    });
  };

  const handleShareEvent = (eventTitle: string) => {
    navigator.clipboard.writeText(`Check out this amazing cultural event: ${eventTitle}`);
    toast({
      title: "Event Shared",
      description: "Event link copied to clipboard",
    });
  };

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(event => event.event_type === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Cultural Heritage
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground"
            >
              Discover the rich tribal heritage, traditional arts, and vibrant festivals of Jharkhand
            </motion.p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 mb-12 justify-center"
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </Button>
            ))}
          </motion.div>

          {/* Featured Cultural Experiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Cultural Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Sarhul Festival',
                  description: 'Celebrate the vibrant spring festival with traditional dance and music',
                  category: 'Festival',
                  rating: 4.8,
                  participants: '5000+',
                  image: heritageImage
                },
                {
                  title: 'Tribal Art Workshop',
                  description: 'Learn traditional Warli and Sohrai art techniques from local artists',
                  category: 'Workshop',
                  rating: 4.9,
                  participants: '30',
                  image: heritageImage
                },
                {
                  title: 'Folk Dance Performance',
                  description: 'Experience authentic Jharkhand folk dances including Jhumar and Paika',
                  category: 'Performance',
                  rating: 4.7,
                  participants: '200',
                  image: heritageImage
                }
              ].map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <Badge className="absolute top-4 right-4 bg-primary/90 text-white">
                        {activity.category}
                      </Badge>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{activity.rating}</span>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                      <p className="text-muted-foreground mb-4">{activity.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{activity.participants} participants</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleShareEvent(activity.title)}>
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <Button className="w-full" onClick={() => handleJoinEvent(activity.title)}>
                        Join Experience
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Cultural Events from Database */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    {event.image_url && (
                      <div className="relative">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {event.is_featured && (
                          <Badge className="absolute top-4 right-4 bg-primary/90 text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.start_date)}</span>
                          {event.end_date && <span> - {formatDate(event.end_date)}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {event.event_type}
                        </Badge>
                        <Button size="sm" onClick={() => handleJoinEvent(event.id)}>
                          Join Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cultural events found for the selected category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Culture;