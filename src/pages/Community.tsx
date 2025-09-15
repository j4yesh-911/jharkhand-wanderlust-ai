import { motion } from 'framer-motion';
import { CommunityUpload } from '@/components/CommunityUpload';
import { Navigation } from '@/components/Navigation';

const CommunityPage = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/5 to-background">
            <div className="max-w-7xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                Community Hub
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              >
                Share your travel stories, photos, and experiences with fellow explorers. 
                Connect with the Jharkhand travel community
              </motion.p>
            </div>
          </section>

          <CommunityUpload />
        </motion.div>
      </main>
    </>
  );
};

export default CommunityPage;