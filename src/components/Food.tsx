import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFood } from '@/hooks/useFood';
import { MapPin, Clock, Users, ChefHat } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Food', icon: '🍽️' },
  { id: 'traditional', name: 'Traditional', icon: '🏺' },
  { id: 'curry', name: 'Curry', icon: '🍛' },
  { id: 'snack', name: 'Snacks', icon: '🥨' },
  { id: 'dessert', name: 'Desserts', icon: '🍰' },
  { id: 'beverage', name: 'Beverages', icon: '🥤' },
];

const spiceLevelColors = {
  mild: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hot: 'bg-red-100 text-red-800',
  sweet: 'bg-pink-100 text-pink-800'
};

export const Food = () => {
  const { foods, loading, error } = useFood();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<string | null>(null);

  const filteredFoods = foods.filter(food => 
    selectedCategory === 'all' || food.category === selectedCategory
  );

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center text-muted-foreground">
          Error loading food items: {error}
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
          Flavors of <span className="text-primary">Jharkhand</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the rich culinary heritage of Jharkhand, from traditional tribal cuisine to modern fusion delights
        </p>
      </motion.div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ChefHat className="w-16 h-16 text-primary/30" />
                      </div>
                      {food.is_featured && (
                        <Badge className="absolute top-2 right-2" variant="default">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{food.name}</h3>
                        <Badge 
                          className={spiceLevelColors[food.spice_level as keyof typeof spiceLevelColors] || 'bg-gray-100 text-gray-800'}
                        >
                          {food.spice_level}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {food.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        {food.region && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{food.region}</span>
                          </div>
                        )}
                        {food.price_range && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>💰</span>
                            <span>{food.price_range}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {food.dietary_tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSelectedFood(selectedFood === food.id ? null : food.id)}
                        className="w-full"
                      >
                        {selectedFood === food.id ? 'Hide Details' : 'View Recipe'}
                      </Button>

                      {selectedFood === food.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium mb-2">Ingredients:</h4>
                              <ul className="text-sm text-muted-foreground list-disc list-inside">
                                {food.ingredients.map((ingredient, i) => (
                                  <li key={i}>{ingredient}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Preparation:</h4>
                              <p className="text-sm text-muted-foreground">{food.preparation_method}</p>
                            </div>

                            {food.restaurant_locations.length > 0 && (
                              <div>
                                <h4 className="font-medium mb-2">Where to find:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {food.restaurant_locations.map((location, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {location}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredFoods.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No food items found in this category.</p>
        </div>
      )}
    </section>
  );
};