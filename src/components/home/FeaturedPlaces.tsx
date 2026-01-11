import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Compass, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFeaturedPlaces } from '@/hooks/usePlaces';

// Import local images as fallback
import santorini from '@/assets/santorini.jpg';
import tokyo from '@/assets/tokyo.jpg';
import machuPicchu from '@/assets/machu-picchu.jpg';
import maldives from '@/assets/maldives.jpg';
import paris from '@/assets/paris.jpg';
import bali from '@/assets/bali.jpg';

const imageMap: Record<string, string> = {
  'santorini': santorini,
  'tokyo': tokyo,
  'machu picchu': machuPicchu,
  'maldives': maldives,
  'paris': paris,
  'bali': bali,
};

export function FeaturedPlaces() {
  const { data: featuredPlaces, isLoading } = useFeaturedPlaces();

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
            Featured Destinations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover handpicked destinations loved by travelers worldwide.
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const places = featuredPlaces || [];

  const getPlaceImage = (place: any) => {
    return imageMap[place.name.toLowerCase()] || place.image_url || '/placeholder.svg';
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
          Featured Destinations
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover handpicked destinations loved by travelers worldwide. From tropical paradises to cultural capitals.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First row - 3 cards */}
        {places.slice(0, 3).map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/place/${place.id}`}>
              <Card className="group overflow-hidden hover:shadow-travel-lg transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getPlaceImage(place)}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{place.country}</span>
                    </div>
                    <h3 className="text-white font-display font-bold text-xl">
                      {place.name}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {place.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Second row - 2 cards + Explore More */}
        {places.slice(3, 5).map((place, index) => (
          <motion.div
            key={place.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index + 3) * 0.1 }}
          >
            <Link to={`/place/${place.id}`}>
              <Card className="group overflow-hidden hover:shadow-travel-lg transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getPlaceImage(place)}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{place.country}</span>
                    </div>
                    <h3 className="text-white font-display font-bold text-xl">
                      {place.name}
                    </h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {place.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Explore More Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/explore">
            <Card className="group overflow-hidden hover:shadow-travel-lg transition-all duration-300 h-full gradient-sunset">
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-display font-bold text-2xl mb-2">
                  Explore More
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Discover all destinations and find your perfect trip
                </p>
                <div className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                  <span>View All</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
