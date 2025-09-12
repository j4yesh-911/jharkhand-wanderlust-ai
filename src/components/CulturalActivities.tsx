import { motion } from 'framer-motion';
import { Calendar, Music, Palette, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import heritageImage from '@/assets/heritage-site.jpg';

export const CulturalActivities = () => {
  const activities = [
    {
      id: 1,
      name: 'Sarhul Festival',
      category: 'Festival',
      description: 'Celebrate the vibrant spring festival with traditional dance, music, and rituals.',
      date: 'March 15-17, 2024',
      participants: '5000+',
      icon: Music,
      color: 'bg-sunset-primary'
    },
    {
      id: 2,
      name: 'Tribal Art Workshop',
      category: 'Workshop',
      description: 'Learn traditional Warli and Sohrai art techniques from local artists.',
      date: 'Every Weekend',
      participants: '20-30',
      icon: Palette,
      color: 'bg-earth-primary'
    },
    {
      id: 3,
      name: 'Folk Dance Performance',
      category: 'Performance',
      description: 'Experience authentic Jharkhand folk dances including Jhumar and Paika.',
      date: 'Daily at 7 PM',
      participants: '100-200',
      icon: Users,
      color: 'bg-forest-primary'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gradient-sunset mb-6">
          Cultural Experiences
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Immerse yourself in the rich tribal heritage, traditional arts, and vibrant festivals of Jharkhand.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group"
          >
            <Card className="glass-card overflow-hidden h-full">
              <div className="relative">
                <img
                  src={heritageImage}
                  alt={activity.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Icon */}
                <div className={`absolute top-4 left-4 w-12 h-12 ${activity.color} rounded-full flex items-center justify-center`}>
                  <activity.icon className="w-6 h-6 text-white" />
                </div>

                {/* Category Badge */}
                <Badge className="absolute top-4 right-4 bg-black/20 text-white backdrop-blur-sm">
                  {activity.category}
                </Badge>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-playfair font-bold mb-3 group-hover:text-primary transition-colors">
                  {activity.name}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {activity.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {activity.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {activity.participants} participants
                  </div>
                </div>

                <Button className="w-full btn-nature">
                  Join Experience
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Featured Cultural Event */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="glass-card overflow-hidden bg-gradient-to-r from-sunset-primary/10 to-earth-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-12 flex items-center">
              <div>
                <Badge className="mb-4 bg-sunset-primary text-white">Featured Event</Badge>
                <h3 className="text-3xl font-playfair font-bold mb-4 text-gradient-sunset">
                  Karma Festival 2024
                </h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  Experience the grand celebration of Karma Festival with traditional music, dance performances, 
                  and authentic tribal cuisine. A three-day cultural extravaganza showcasing Jharkhand's rich heritage.
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-sunset-primary" />
                    <span className="font-semibold">September 12-14, 2024</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-sunset-primary" />
                    <span className="font-semibold">10,000+ Expected</span>
                  </div>
                </div>
                <Button className="btn-hero">
                  Register Now - ₹999
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heritageImage}
                alt="Karma Festival"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-sunset-primary/20" />
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};