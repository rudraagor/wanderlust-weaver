import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Star, MapPin, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { Footer } from '@/components/layout/Footer';
import { usePlaces, resolveImageUrl } from '@/hooks/usePlaces';
import { usePublicItineraries, useLikeItinerary, useUnlikeItinerary, useSaveItinerary, useUnsaveItinerary, useSavedItineraries } from '@/hooks/useItineraries';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('destinations');
  
  const { data: places, isLoading: isLoadingPlaces } = usePlaces();
  const { data: itineraries, isLoading: isLoadingItineraries } = usePublicItineraries();
  const { data: savedItineraries } = useSavedItineraries();
  const likeItinerary = useLikeItinerary();
  const unlikeItinerary = useUnlikeItinerary();
  const saveItinerary = useSaveItinerary();
  const unsaveItinerary = useUnsaveItinerary();

  // Fetch user's likes
  const { data: userLikes } = useQuery({
    queryKey: ['user-likes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('itinerary_likes')
        .select('itinerary_id')
        .eq('user_id', user.id);
      if (error) throw error;
      return data.map(l => l.itinerary_id);
    },
    enabled: !!user,
  });

  const isLiked = (itineraryId: string) => userLikes?.includes(itineraryId) || false;
  const isSaved = (itineraryId: string) => savedItineraries?.some((s: any) => s.id === itineraryId) || false;

  const getPlaceImage = (place: any) => {
    return imageMap[place.name.toLowerCase()] || place.image_url || '/placeholder.svg';
  };

  const handleLike = async (e: React.MouseEvent, itineraryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to like itineraries.', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    try {
      if (isLiked(itineraryId)) {
        await unlikeItinerary.mutateAsync(itineraryId);
      } else {
        await likeItinerary.mutateAsync(itineraryId);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleSave = async (e: React.MouseEvent, itineraryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to save itineraries.', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    try {
      if (isSaved(itineraryId)) {
        await unsaveItinerary.mutateAsync(itineraryId);
        toast({ title: 'Removed from saved' });
      } else {
        await saveItinerary.mutateAsync(itineraryId);
        toast({ title: 'Saved!', description: 'Itinerary added to your saved items.' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Filter places by search
  const filteredPlaces = places?.filter(
    place => place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             place.country.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Filter itineraries by search
  const filteredItineraries = itineraries?.filter(
    it => it.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          it.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          it.country?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">Explore</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amazing destinations and travel itineraries from the community
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search destinations or itineraries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 rounded-full"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="destinations" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          </TabsList>

          {/* Destinations Tab */}
          <TabsContent value="destinations">
            {isLoadingPlaces ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlaces.map((place, index) => (
                  <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/place/${place.id}`}>
                      <Card className="group overflow-hidden hover:shadow-travel-lg transition-all duration-300 h-full">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={getPlaceImage(place)}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                              <MapPin className="w-3 h-3" />
                              <span>{place.country}</span>
                            </div>
                            <h3 className="text-white font-display font-bold text-xl">
                              {place.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-white/20 text-white border-0">
                                {place.best_time_period || 'Year-round'}
                              </Badge>
                            </div>
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
              </div>
            )}
          </TabsContent>

          {/* Itineraries Tab */}
          <TabsContent value="itineraries">
            {isLoadingItineraries ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredItineraries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItineraries.map((itinerary, index) => (
                  <motion.div
                    key={itinerary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/itinerary/${itinerary.id}`}>
                      <Card className="group overflow-hidden hover:shadow-travel-lg transition-all duration-300 h-full">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={resolveImageUrl(itinerary.cover_image, itinerary.destination)}
                            alt={itinerary.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          
                          {/* Action Buttons */}
                          <div className="absolute top-3 right-3 flex gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                              onClick={(e) => handleLike(e, itinerary.id)}
                            >
                              <Heart className={`w-4 h-4 ${isLiked(itinerary.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                              onClick={(e) => handleSave(e, itinerary.id)}
                            >
                              <Bookmark className={`w-4 h-4 ${isSaved(itinerary.id) ? 'fill-current' : ''}`} />
                            </Button>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-1 text-white/90 text-sm mb-1">
                              <MapPin className="w-3 h-3" />
                              <span>{itinerary.destination}</span>
                            </div>
                            <h3 className="text-white font-semibold line-clamp-1">
                              {itinerary.title}
                            </h3>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                {itinerary.nights || 0} nights
                              </Badge>
                              {itinerary.budget && (
                                <Badge variant="outline">{itinerary.budget}</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Heart className="w-4 h-4" />
                              {itinerary.likes_count}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {itinerary.profiles?.display_name?.[0] || 'U'}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {itinerary.profiles?.display_name || 'Traveler'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">No itineraries found</h3>
                <p className="text-muted-foreground mb-4">Be the first to share your travel adventures!</p>
                <Button onClick={() => navigate('/create')} className="rounded-xl gradient-sky">
                  Create Itinerary
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </Layout>
  );
}
