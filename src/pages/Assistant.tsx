import { motion } from 'framer-motion';
import { AIAssistant } from '@/components/AIAssistant';
import { Navigation } from '@/components/Navigation';

const AssistantPage = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-7xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                AI Travel Assistant
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              >
                Get personalized travel recommendations, itinerary planning, and instant answers 
                to all your Jharkhand travel questions
              </motion.p>
            </div>
          </section>

          <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <AIAssistant />
          </section>
        </motion.div>
      </main>
    </>
  );
};

export default AssistantPage;