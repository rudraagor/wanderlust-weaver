import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPlaces } from '@/components/home/FeaturedPlaces';
import { Footer } from '@/components/layout/Footer';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Destinations */}
      <FeaturedPlaces />

      {/* AI Recommendations */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl gradient-sky p-8 md:p-12 text-primary-foreground"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="font-display font-bold text-2xl md:text-3xl">
              AI Travel Assistant
            </h2>
          </div>
          <p className="text-primary-foreground/80 mb-6 max-w-xl">
            Get personalized recommendations, real-time travel updates, and smart itinerary 
            suggestions powered by our AI assistant.
          </p>
          <div className="flex flex-wrap gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full bg-primary-foreground/20 text-sm font-medium"
            >
              🗺️ Smart Itineraries
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full bg-primary-foreground/20 text-sm font-medium"
            >
              🎯 Personalized Tips
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full bg-primary-foreground/20 text-sm font-medium"
            >
              📍 Offline Maps
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full bg-primary-foreground/20 text-sm font-medium"
            >
              🌍 GPS Tracking
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default Index;
