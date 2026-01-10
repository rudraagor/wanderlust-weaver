import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Layout } from '@/components/layout/Layout';
import { usePublicItineraries, useLikeItinerary, useUnlikeItinerary, useSaveItinerary, useUnsaveItinerary, useSavedItineraries } from '@/hooks/useItineraries';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: itineraries, isLoading } = usePublicItineraries();
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

  // Get profiles for itinerary creators
  const { data: profiles } = useQuery({
    queryKey: ['itinerary-profiles', itineraries?.map(i => i.user_id)],
    queryFn: async () => {
      if (!itineraries || itineraries.length === 0) return {};
      const userIds = [...new Set(itineraries.map(i => i.user_id))];
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);
      if (error) throw error;
      return data.reduce((acc: Record<string, any>, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {});
    },
    enabled: !!itineraries && itineraries.length > 0,
  });

  const isLiked = (itineraryId: string) => userLikes?.includes(itineraryId) || false;
  const isSaved = (itineraryId: string) => savedItineraries?.some((s: any) => s.itinerary_id === itineraryId) || false;

  const handleLike = async (itineraryId: string) => {
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

  const handleSave = async (itineraryId: string) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to save itineraries.', variant: 'destructive' });
      navigate('/auth');
      return;
    }
    try {
      if (isSaved(itineraryId)) {
        const savedItem = savedItineraries?.find((s: any) => s.itinerary_id === itineraryId);
        if (savedItem) {
          await unsaveItinerary.mutateAsync(savedItem.id);
          toast({ title: 'Removed from saved' });
        }
      } else {
        await saveItinerary.mutateAsync(itineraryId);
        toast({ title: 'Saved!', description: 'Itinerary added to your saved items.' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-3xl mb-2">Explore</h1>
            <p className="text-muted-foreground">Discover amazing travel itineraries from the community</p>
          </motion.div>

          {/* Feed */}
          {itineraries && itineraries.length > 0 ? (
            <div className="space-y-6">
              {itineraries.map((itinerary, index) => {
                const profile = profiles?.[itinerary.user_id];
                return (
                  <motion.article
                    key={itinerary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl shadow-travel overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4">
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate(`/profile/${itinerary.user_id}`)}
                      >
                        <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                          <AvatarImage src={profile?.avatar_url} />
                          <AvatarFallback>{profile?.display_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{profile?.display_name || 'Traveler'}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {itinerary.destination}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Image */}
                    <div 
                      className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/plan/${itinerary.id}`)}
                    >
                      {itinerary.cover_image ? (
                        <img 
                          src={itinerary.cover_image} 
                          alt={itinerary.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <MapPin className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-semibold text-lg">{itinerary.title}</h3>
                        {itinerary.nights && (
                          <p className="text-white/80 text-sm">{itinerary.nights} nights</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleLike(itinerary.id)}
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                          >
                            <Heart 
                              className={`w-6 h-6 transition-colors ${
                                isLiked(itinerary.id) 
                                  ? 'fill-accent text-accent' 
                                  : 'text-foreground'
                              }`} 
                            />
                          </motion.button>
                          <button 
                            className="p-2 hover:bg-muted rounded-full transition-colors"
                            onClick={() => navigate(`/plan/${itinerary.id}`)}
                          >
                            <MessageCircle className="w-6 h-6" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-full transition-colors">
                            <Share2 className="w-6 h-6" />
                          </button>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSave(itinerary.id)}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <Bookmark 
                            className={`w-6 h-6 transition-colors ${
                              isSaved(itinerary.id) 
                                ? 'fill-foreground' 
                                : ''
                            }`} 
                          />
                        </motion.button>
                      </div>

                      {/* Likes */}
                      <p className="font-semibold text-sm mb-2">
                        {itinerary.likes_count.toLocaleString()} likes
                      </p>

                      {/* Info */}
                      <p className="text-sm">
                        <span className="font-semibold">@{profile?.username || 'user'}</span>{' '}
                        {itinerary.country && `Trip to ${itinerary.country}`}
                        {itinerary.budget && ` • ${itinerary.budget} budget`}
                      </p>

                      {/* Date */}
                      <p className="text-xs text-muted-foreground mt-2 uppercase">
                        {new Date(itinerary.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">No itineraries yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your travel adventures!</p>
              <Button onClick={() => navigate('/create')} className="rounded-xl gradient-sky">
                Create Itinerary
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
