// src/pages/Explore.jsx
import { Navigation } from '@/components/Navigation';
import { DestinationExplorer } from '@/components/DestinationExplorer';
import { DistrictList } from '@/components/DistrictList';

const Explore = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Navigation />
      <div className="pt-16">
        <div className="bg-gradient-nature py-20 text-white text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl font-playfair font-bold mb-6">
              Explore Destinations
            </h1>
            <p className="text-xl">
              Discover the most beautiful places Jharkhand has to offer
            </p>
          </div>
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
