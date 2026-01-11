import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Compass } from 'lucide-react';
import { destinations } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FeaturedPlaces() {
  const featuredDestinations = destinations.slice(0, 5);

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
        {featuredDestinations.slice(0, 3).map((destination, index) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/place/${destination.id}`}>
              <Card className="group overflow-hidden hover:shadow-travel-lg transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{destination.country}</span>
                    </div>
                    <h3 className="text-white font-display font-bold text-xl">
                      {destination.name}
                    </h3>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white/90 text-foreground">
                    <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                    {destination.rating}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {destination.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Second row - 2 cards + Explore More */}
        {featuredDestinations.slice(3, 5).map((destination, index) => (
          <motion.div
            key={destination.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index + 3) * 0.1 }}
          >
            <Link to={`/place/${destination.id}`}>
              <Card className="group overflow-hidden hover:shadow-travel-lg transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                      <MapPin className="w-3 h-3" />
                      <span>{destination.country}</span>
                    </div>
                    <h3 className="text-white font-display font-bold text-xl">
                      {destination.name}
                    </h3>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white/90 text-foreground">
                    <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                    {destination.rating}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {destination.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
