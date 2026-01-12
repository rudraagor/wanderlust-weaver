import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Plane, Hotel, Utensils, 
  Activity, ArrowLeft, Heart, Bookmark, Share2, Star, Loader2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Footer } from '@/components/layout/Footer';
import { SocialShareModal } from '@/components/share/SocialShareModal';
import { BookingDialog } from '@/components/booking/BookingDialog';
import { 
  useItineraryById, 
  useLikeItinerary, 
  useUnlikeItinerary,
  useSaveItinerary,
  useUnsaveItinerary,
  useUserLikes,
  useUserSavedItineraries
} from '@/hooks/useItineraries';
import { useBookTrip } from '@/hooks/useBookedTrips';
import { resolveImageUrl } from '@/hooks/usePlaces';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ItineraryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  const { data: itinerary, isLoading } = useItineraryById(id || '');
  const { data: userLikes } = useUserLikes(user?.id || '');
  const { data: userSaved } = useUserSavedItineraries(user?.id || '');
  
  const likeItinerary = useLikeItinerary();
  const unlikeItinerary = useUnlikeItinerary();
  const saveItinerary = useSaveItinerary();
  const unsaveItinerary = useUnsaveItinerary();
  const bookTrip = useBookTrip();

  const isLiked = userLikes?.some(like => like.itinerary_id === id);
  const isSaved = userSaved?.some(saved => saved.itinerary_id === id);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleLike = () => {
    if (!user) {
      toast.error('Please sign in to like itineraries');
      return;
    }
    if (isLiked) {
      unlikeItinerary.mutate(id!);
    } else {
      likeItinerary.mutate(id!);
    }
  };

  const handleSave = () => {
    if (!user) {
      toast.error('Please sign in to save itineraries');
      return;
    }
    if (isSaved) {
      const savedEntry = userSaved?.find(s => s.itinerary_id === id);
      if (savedEntry) unsaveItinerary.mutate(id!);
    } else {
      saveItinerary.mutate(id!);
    }
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-muted rounded-xl" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!itinerary) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Itinerary not found</h1>
          <Link to="/explore">
            <Button>Explore Itineraries</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      {/* Header */}
      <div className="relative h-[40vh] min-h-[300px]">
        <img
          src={resolveImageUrl(itinerary.cover_image, itinerary.destination)}
          alt={itinerary.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Button 
              variant="ghost" 
              className="text-white mb-4 hover:bg-white/10"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{itinerary.destination}, {itinerary.country}</span>
              </div>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
                {itinerary.title}
              </h1>
              <Link 
                to={`/profile/${itinerary.user_id}`}
                className="flex items-center gap-4 hover:opacity-80 transition-opacity"
              >
                <Avatar className="w-10 h-10 border-2 border-white">
                  <AvatarImage src={itinerary.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {itinerary.profiles?.display_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <p className="font-medium">{itinerary.profiles?.display_name || 'Anonymous'}</p>
                  {itinerary.profiles?.username && (
                    <p className="text-sm text-white/70">@{itinerary.profiles.username}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span>{itinerary.nights || 0} nights</span>
            </div>
            {itinerary.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>
                  {format(new Date(itinerary.start_date), 'MMM d')} - {' '}
                  {itinerary.end_date && format(new Date(itinerary.end_date), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            {itinerary.budget && (
              <Badge variant="secondary">{itinerary.budget}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={isLiked ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {itinerary.likes_count || 0}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className={isSaved ? 'text-primary border-primary' : ''}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Day by Day */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flights */}
            {itinerary.itinerary_flights && itinerary.itinerary_flights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Flights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itinerary.itinerary_flights.map((flight: any, index: number) => (
                    <div key={flight.id || index} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{flight.departure_airport} → {flight.arrival_airport}</p>
                          <p className="text-sm text-muted-foreground">
                            {flight.airline} {flight.flight_number && `• ${flight.flight_number}`}
                          </p>
                        </div>
                        {flight.price && (
                          <Badge variant="secondary">${flight.price}</Badge>
                        )}
                      </div>
                      {flight.departure_time && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {format(new Date(flight.departure_time), 'PPp')}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Hotels */}
            {itinerary.itinerary_hotels && itinerary.itinerary_hotels.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="w-5 h-5 text-primary" />
                    Accommodations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {itinerary.itinerary_hotels.map((hotel: any, index: number) => (
                    <div key={hotel.id || index} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-start gap-4">
                        {hotel.image_url && (
                          <img
                            src={hotel.image_url}
                            alt={hotel.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{hotel.name}</h4>
                          {hotel.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(hotel.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                          )}
                          {hotel.price_per_night && (
                            <p className="text-sm text-muted-foreground mt-2">
                              ${hotel.price_per_night}/night
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Day by Day Itinerary */}
            {itinerary.itinerary_days && itinerary.itinerary_days.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Day-by-Day Itinerary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {itinerary.itinerary_days
                    .sort((a: any, b: any) => a.day_number - b.day_number)
                    .map((day: any) => (
                      <div key={day.id} className="relative pl-8 pb-6 last:pb-0">
                        {/* Timeline */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                        <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-primary" />
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-lg">Day {day.day_number}</h4>
                          {day.date && (
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(day.date), 'EEEE, MMMM d')}
                            </p>
                          )}
                        </div>

                        {/* Activities */}
                        {day.itinerary_activities && day.itinerary_activities.length > 0 && (
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <Activity className="w-4 h-4" />
                              Activities
                            </div>
                            {day.itinerary_activities.map((activity: any, idx: number) => (
                              <div key={idx} className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{activity.name}</p>
                                    {activity.time && (
                                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                                    )}
                                  </div>
                                  {activity.category && (
                                    <Badge variant="outline" className="text-xs">
                                      {activity.category}
                                    </Badge>
                                  )}
                                </div>
                                {activity.description && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    {activity.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Restaurants */}
                        {day.itinerary_restaurants && day.itinerary_restaurants.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                              <Utensils className="w-4 h-4" />
                              Dining
                            </div>
                            {day.itinerary_restaurants.map((restaurant: any, idx: number) => (
                              <div key={idx} className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{restaurant.name}</p>
                                    {restaurant.cuisine && (
                                      <p className="text-sm text-muted-foreground">
                                        {restaurant.cuisine}
                                      </p>
                                    )}
                                  </div>
                                  {restaurant.meal_type && (
                                    <Badge variant="outline" className="text-xs">
                                      {restaurant.meal_type}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Photos */}
            {itinerary.itinerary_photos && itinerary.itinerary_photos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {itinerary.itinerary_photos.map((photo: any, index: number) => (
                      <div key={photo.id || index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={photo.photo_url}
                          alt={photo.caption || 'Trip photo'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Trip Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destination</span>
                    <span className="font-medium">{itinerary.destination}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{itinerary.nights} nights</span>
                  </div>
                  {itinerary.budget && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">{itinerary.budget}</span>
                      </div>
                    </>
                  )}
                  {itinerary.total_cost && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost</span>
                        <span className="font-medium">${itinerary.total_cost}</span>
                      </div>
                    </>
                  )}
                </div>

                <Button 
                  className="w-full mt-6 gradient-sky text-white"
                  onClick={() => {
                    if (!user) {
                      toast.error('Please sign in to book this trip');
                      navigate('/auth');
                      return;
                    }
                    setBookingDialogOpen(true);
                  }}
                >
                  Book This Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Social Share Modal */}
      <SocialShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        title={itinerary?.title || 'Check out this itinerary'}
        url={shareUrl}
        description={`${itinerary?.destination}, ${itinerary?.country} - ${itinerary?.nights || 0} nights`}
      />

      {/* Booking Dialog */}
      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        destinationName={`${itinerary?.destination}, ${itinerary?.country}`}
        departureCity="Your City"
        flights={itinerary?.itinerary_flights?.map((f: any) => ({
          id: f.id,
          name: `${f.departure_airport} → ${f.arrival_airport}`,
          price: f.price || 0,
          details: `${f.airline || 'Flight'} ${f.flight_number || ''}`
        })) || []}
        hotels={itinerary?.itinerary_hotels?.map((h: any) => ({
          id: h.id,
          name: h.name,
          price: (h.price_per_night || 0) * (itinerary?.nights || 1),
          details: `${h.price_per_night || 0}/night`
        })) || []}
        activities={itinerary?.itinerary_days?.flatMap((d: any) => 
          (d.itinerary_activities || []).map((a: any) => ({
            id: a.id,
            name: a.name,
            price: a.price || 0,
            details: a.category || 'Activity'
          }))
        ) || []}
        totalCost={itinerary?.total_cost || 0}
        onConfirmBooking={async (data) => {
          try {
            await bookTrip.mutateAsync({
              itineraryId: id!,
              flightsBooked: data.flights.length > 0,
              hotelsBooked: data.hotels.length > 0,
              activitiesBooked: data.activities.length > 0,
              plannedBudget: data.plannedBudget,
            });
            toast.success('Trip booked successfully!');
            navigate('/my-trips');
          } catch (error: any) {
            toast.error(error.message || 'Failed to book trip');
          }
        }}
      />
    </Layout>
  );
}
