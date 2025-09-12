import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Destination } from '@/data/destinations';
import waterfallImage from '@/assets/waterfall-destination.jpg';
import heritageImage from '@/assets/heritage-site.jpg';

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export const DestinationCard = ({ destination, index }: DestinationCardProps) => {
  const getImage = () => {
    return destination.category === 'heritage' || destination.category === 'culture' || destination.category === 'adventure' 
      ? heritageImage 
      : waterfallImage;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Challenging': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="glass-card overflow-hidden h-full">
        <div className="relative overflow-hidden">
          <img
            src={getImage()}
            alt={destination.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <Badge 
            className={`absolute top-3 left-3 capitalize ${
              destination.category === 'waterfall' ? 'bg-water-primary' :
              destination.category === 'heritage' ? 'bg-earth-primary' :
              destination.category === 'culture' ? 'bg-sunset-primary' :
              destination.category === 'adventure' ? 'bg-forest-accent' :
              'bg-forest-primary'
            } text-white`}
          >
            {destination.category}
          </Badge>
          
          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-white text-sm font-semibold">{destination.rating}</span>
          </div>

          {/* Difficulty Badge */}
          <Badge 
            className={`absolute bottom-3 left-3 ${getDifficultyColor(destination.difficulty)} text-white`}
          >
            {destination.difficulty}
          </Badge>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-playfair font-bold text-foreground group-hover:text-primary transition-colors">
              {destination.name}
            </h3>
            <div className="flex items-center text-muted-foreground">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">{destination.reviews}</span>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{destination.location}</span>
          </div>

          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            {destination.description}
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {destination.highlights.slice(0, 3).map((highlight, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {highlight}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {destination.duration}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              ₹{destination.price.min}-{destination.price.max}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1 btn-nature">
              View Details
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-primary/10">
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                ❤️
              </motion.div>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};