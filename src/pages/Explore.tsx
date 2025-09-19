// src/pages/Explore.jsx
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { DestinationExplorer } from '@/components/DestinationExplorer';
import { DistrictList } from '@/components/DistrictList';

const Explore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />
      <div className="pt-16">
        <div className="bg-gradient-hero py-24 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-7xl font-playfair font-bold mb-6"
            >
              Explore Destinations
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl font-light max-w-2xl mx-auto"
            >
              Discover the most breathtaking places Jharkhand has to offer
            </motion.p>
          </div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
        </div>

        {/* existing explorer (keeps whatever features you already had) */}
        <DestinationExplorer />

        {/* New district-wise categorized section */}
        <DistrictList />
      </div>
    </div>
  );
};

export default Explore;
