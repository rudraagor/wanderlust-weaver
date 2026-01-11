import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedPlaces } from '@/components/home/FeaturedPlaces';
import { Footer } from '@/components/layout/Footer';
import { Sparkles } from 'lucide-react';
const Index = () => {
  return <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Destinations */}
      <FeaturedPlaces />

      {/* AI Recommendations */}
      <section className="container mx-auto px-4 py-12">
        
      </section>

      {/* Footer */}
      <Footer />
    </Layout>;
};
export default Index;