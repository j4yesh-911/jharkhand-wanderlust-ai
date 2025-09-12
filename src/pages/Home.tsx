import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { DestinationExplorer } from '@/components/DestinationExplorer';
import { CulturalActivities } from '@/components/CulturalActivities';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <DestinationExplorer />
        <CulturalActivities />
      </main>
    </div>
  );
};

export default Home;