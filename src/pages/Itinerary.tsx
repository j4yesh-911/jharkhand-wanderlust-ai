import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useItinerary } from '@/hooks/useItinerary';
import { useDestinations } from '@/hooks/useDestinations';
import { useAuth } from '@/hooks/useAuth';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus, 
  Sparkles,
  Loader2,
  Route,
  DollarSign
} from 'lucide-react';

const Itinerary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { itineraries, loading, createItinerary, generateAIItinerary } = useItinerary();
  const { destinations } = useDestinations();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAIForm, setShowAIForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  
  const [newItinerary, setNewItinerary] = useState({
    title: '',
    description: '',
    duration_days: 3,
    budget_estimate: 10000,
    is_public: false,
  });

  const [aiPreferences, setAiPreferences] = useState({
    duration: 3,
    interests: [] as string[],
    budget: 'moderate',
    groupSize: 2,
  });

  const handleCreateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to create itineraries",
        variant: "destructive",
      });
      return;
    }

    const result = await createItinerary(newItinerary);
    if (result) {
      toast({
        title: "Itinerary Created",
        description: "Your itinerary has been created successfully",
      });
      setShowCreateForm(false);
      setNewItinerary({
        title: '',
        description: '',
        duration_days: 3,
        budget_estimate: 10000,
        is_public: false,
      });
    }
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const suggestions = await generateAIItinerary(aiPreferences);
      setAiSuggestions(suggestions);
      
      toast({
        title: "AI Itinerary Generated",
        description: "Your personalized itinerary is ready!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again or create a manual itinerary",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setAiPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const interests = [
    'Waterfalls', 'Culture', 'Adventure', 'Nature', 'Heritage', 'Food', 'Photography'
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <div className="bg-gradient-water py-20 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-playfair font-bold mb-6"
            >
              Plan Your Journey
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl"
            >
              AI-powered smart itinerary builder for the perfect Jharkhand experience
            </motion.p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Itinerary Builder */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-8 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gradient-nature">Your Itinerary</h2>
                  <Button className="btn-nature">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Destination
                  </Button>
                </div>

                <div className="space-y-4">
                  {[
                    { day: 1, place: 'Hundru Falls', time: '09:00 AM', duration: '4 hours' },
                    { day: 1, place: 'Jagannath Temple', time: '02:00 PM', duration: '2 hours' },
                    { day: 2, place: 'Tribal Village Tour', time: '10:00 AM', duration: 'Full Day' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-nature rounded-full flex items-center justify-center text-white font-bold">
                              {item.day}
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.place}</h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 mr-1" />
                                {item.time} • {item.duration}
                              </div>
                            </div>
                          </div>
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6 rounded-2xl"
            >
              <h3 className="text-xl font-bold mb-4 text-gradient-water">AI Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm text-muted-foreground">
                    💡 Add Dassam Falls between your current destinations for a perfect nature trail experience.
                  </p>
                </div>
                <div className="p-4 bg-sunset-primary/5 rounded-lg border border-sunset-primary/10">
                  <p className="text-sm text-muted-foreground">
                    🍽️ Try local tribal cuisine at the village - it's a unique cultural experience!
                  </p>
                </div>
                <div className="p-4 bg-water-primary/5 rounded-lg border border-water-primary/10">
                  <p className="text-sm text-muted-foreground">
                    📸 Best photography time at Hundru Falls is during golden hour (6-7 AM).
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;