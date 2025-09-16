import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { DestinationExplorer } from '@/components/DestinationExplorer';
import { CulturalActivities } from '@/components/CulturalActivities';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Users, Camera, MessageCircle, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <DestinationExplorer />
        <CulturalActivities />
        
        {/* Quick Access Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Plan Your <span className="text-primary">Perfect Trip</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Use our powerful tools to create, share, and discover amazing travel experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Explore Destinations',
                description: 'Discover amazing places, read reviews, and find your next adventure',
                icon: MapPin,
                href: '/explore',
                color: 'from-primary to-primary/80'
              },
              {
                title: 'AI Itinerary Planner',
                description: 'Let AI create the perfect travel plan based on your preferences',
                icon: Calendar,
                href: '/itinerary',
                color: 'from-accent to-accent/80'
              },
              {
                title: 'Cultural Experiences',
                description: 'Join local festivals, workshops, and cultural events',
                icon: Users,
                href: '/culture',
                color: 'from-secondary to-secondary/80'
              },
              {
                title: 'Community Hub',
                description: 'Share your travel photos and connect with fellow travelers',
                icon: Camera,
                href: '/community',
                color: 'from-primary to-accent'
              },
              {
                title: 'AI Travel Assistant',
                description: 'Get instant answers to all your travel questions',
                icon: MessageCircle,
                href: '/assistant',
                color: 'from-accent to-secondary'
              },
              {
                title: 'Local Cuisine',
                description: 'Discover authentic Jharkhand dishes and restaurants',
                icon: Utensils,
                href: '/food',
                color: 'from-secondary to-primary'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={feature.href}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;