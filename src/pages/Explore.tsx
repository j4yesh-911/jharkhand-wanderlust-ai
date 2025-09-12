import { Navigation } from '@/components/Navigation';
import { DestinationExplorer } from '@/components/DestinationExplorer';

const Explore = () => {
  return (
    <div className="min-h-screen">
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
        <DestinationExplorer />
      </div>
    </div>
  );
};

export default Explore;