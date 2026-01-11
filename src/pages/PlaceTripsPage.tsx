import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Footer } from '@/components/layout/Footer';
import { usePlaceDetails, getPlaceImageUrl } from '@/hooks/usePlaces';
import { useItinerariesByPlace } from '@/hooks/useItineraries';

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

export default function PlaceTripsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: place, isLoading: placeLoading } = usePlaceDetails(id);
  const { data: itineraries, isLoading: itinerariesLoading } = useItinerariesByPlace(id);

  const isLoading = placeLoading || itinerariesLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading trips...</p>
        </div>
      </Layout>
    );
  }

  if (!place) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Place not found</h1>
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const placeImage = imageMap[place.name.toLowerCase()] || place.image_url || '/placeholder.svg';

  return (
    <Layout showFooter={false}>
      {/* Header */}
      <div className="relative h-[30vh] min-h-[250px]">
        <img
          src={placeImage}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to={`/place/${id}`}>
              <Button variant="ghost" className="text-white mb-4 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {place.name}
              </Button>
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{place.country}</span>
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white">
                Trips to {place.name}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-muted-foreground">
            Explore {itineraries?.length || 0} itineraries created by fellow travelers for {place.name}
          </p>
        </motion.div>

        {!itineraries || itineraries.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to create an itinerary for {place.name}!
            </p>
            <Link to={`/place/${id}`}>
              <Button className="gradient-sky text-white">
                Create Itinerary
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary, index) => (
              <motion.div
                key={itinerary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/itinerary/${itinerary.id}`}>
                  <Card className="group hover:shadow-travel-lg transition-all duration-300 overflow-hidden">
                    {itinerary.cover_image && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={itinerary.cover_image}
                          alt={itinerary.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {itinerary.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{itinerary.nights || 0} nights</span>
                        </div>
                        {itinerary.likes_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span>{itinerary.likes_count}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={itinerary.profiles?.avatar_url || ''} />
                          <AvatarFallback>
                            {itinerary.profiles?.display_name?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {itinerary.profiles?.display_name || 'Anonymous'}
                          </p>
                          {itinerary.profiles?.username && (
                            <p className="text-xs text-muted-foreground">
                              @{itinerary.profiles.username}
                            </p>
                          )}
                        </div>
                      </div>

                      {itinerary.budget && (
                        <Badge className="mt-3" variant="secondary">
                          {itinerary.budget}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </Layout>
  );
}