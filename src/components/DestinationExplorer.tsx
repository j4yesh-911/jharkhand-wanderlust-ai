import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DestinationCard } from './DestinationCard';
import { useDestinations } from '@/hooks/useDestinations';
import { Destination as UIDestination } from '@/data/destinations';

const categories = [
  { id: 'all', name: 'All Destinations', icon: '🌍' },
  { id: 'waterfall', name: 'Waterfalls', icon: '💧' },
  { id: 'heritage', name: 'Heritage Sites', icon: '🏛️' },
  { id: 'culture', name: 'Cultural Experiences', icon: '🎭' },
  { id: 'adventure', name: 'Adventure Sports', icon: '⛰️' },
  { id: 'nature', name: 'Nature & Wildlife', icon: '🌿' },
  { id: 'museum', name: 'Museums', icon: '🏛️' },
  { id: 'eco_park', name: 'Eco Parks', icon: '🌳' }
];

export const DestinationExplorer = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { destinations, loading, error, refetch } = useDestinations();

  const filteredDestinations = useMemo(() => {
    return destinations.filter(destination => {
      const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
      const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           destination.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           destination.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [destinations, selectedCategory, searchQuery]);

  const uiDestinations = useMemo<UIDestination[]>(() => {
    const allowedCategories = ['waterfall','heritage','culture','adventure','nature'] as const;
    return filteredDestinations.map((d) => {
      const category = (allowedCategories as readonly string[]).includes(d.category as any)
        ? (d.category as typeof allowedCategories[number])
        : 'nature';
      return {
        id: d.id,
        name: d.name,
        category,
        description: d.description,
        image: '/src/assets/waterfall-destination.jpg',
        location: d.location,
        rating: Number(d.rating ?? 0),
        reviews: d.review_count ?? 0,
        highlights: Array.isArray(d.features) ? d.features : [],
        bestTime: d.best_time_to_visit || 'Year Round',
        duration: d.timings || 'Flexible',
        difficulty: 'Easy',
        price: { min: 0, max: 0 },
      };
    });
  }, [filteredDestinations]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gradient-nature mb-6">
          Explore Jharkhand's Treasures
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover breathtaking waterfalls, ancient heritage sites, vibrant culture, 
          and thrilling adventures across the heart of India.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search destinations, locations, activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-12 w-12"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-12 w-12"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge
                variant={selectedCategory === category.id ? 'default' : 'secondary'}
                className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-nature text-white shadow-glow'
                    : 'glass hover:bg-primary/10'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <p className="text-muted-foreground">
          Found <span className="font-semibold text-primary">{filteredDestinations.length}</span> destinations
          {selectedCategory !== 'all' && (
            <span> in <span className="font-semibold">{categories.find(c => c.id === selectedCategory)?.name}</span></span>
          )}
        </p>
      </motion.div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            Failed to load destinations: {error}
            <Button onClick={refetch} variant="outline" size="sm" className="ml-2">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading amazing destinations...</p>
        </motion.div>
      )}

      {/* Destinations Grid/List */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
          }
        >
          {uiDestinations.map((destination, index) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {filteredDestinations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="glass-card p-12 rounded-2xl inline-block">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filters to discover more places
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        </motion.div>
      )}
    </section>
  );
};