import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Star, 
  Plane, Hotel, Camera, Utensils, DollarSign,
  ChevronDown, ChevronUp, Edit2, Loader2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { destinations } from '@/data/mockData';
import { getPlaceById } from '@/data/placeDetails';
import { BookingDialog } from '@/components/booking/BookingDialog';
import { useAuth } from '@/contexts/AuthContext';
import { useBookTrip } from '@/hooks/useBookedTrips';
import { useCreateItinerary } from '@/hooks/useItineraries';
import { useToast } from '@/hooks/use-toast';
// Mock itinerary data
const mockItinerary = {
  flights: [
    { id: '1', from: 'New York (JFK)', to: 'Athens (ATH)', time: '10:30 AM', duration: '10h 30m', price: 850 },
    { id: '2', from: 'Athens (ATH)', to: 'Santorini (JTR)', time: '2:00 PM', duration: '45m', price: 120 },
  ],
  hotels: [
    { id: '1', name: 'Canaves Oia Suites', rating: 5, pricePerNight: 450, nights: 5, image: '' },
    { id: '2', name: 'Grace Santorini', rating: 5, pricePerNight: 380, nights: 5, image: '' },
  ],
  activities: [
    { day: 1, items: [
      { id: '1', name: 'Sunset at Oia Castle', time: '6:00 PM', category: 'Sightseeing', price: 0 },
      { id: '2', name: 'Traditional Greek Dinner', time: '8:30 PM', category: 'Food', price: 85 },
    ]},
    { day: 2, items: [
      { id: '3', name: 'Caldera Boat Tour', time: '10:00 AM', category: 'Adventure', price: 120 },
      { id: '4', name: 'Wine Tasting Tour', time: '4:00 PM', category: 'Food', price: 65 },
    ]},
    { day: 3, items: [
      { id: '5', name: 'Ancient Akrotiri Visit', time: '9:00 AM', category: 'History', price: 25 },
      { id: '6', name: 'Red Beach', time: '2:00 PM', category: 'Beach', price: 0 },
    ]},
  ]
};

// Generate custom itinerary based on selected places
const generateCustomItinerary = (selectedPlaces: any[], placeName: string) => {
  const days = Math.max(3, selectedPlaces.length);
  const activities = [];
  
  for (let i = 0; i < days; i++) {
    const dayItems = [];
    if (selectedPlaces[i]) {
      dayItems.push({
        id: `custom-${i}-1`,
        name: `Visit ${selectedPlaces[i].name}`,
        time: '10:00 AM',
        category: selectedPlaces[i].type,
        price: Math.floor(Math.random() * 50) + 10,
      });
      dayItems.push({
        id: `custom-${i}-2`,
        name: `Explore around ${selectedPlaces[i].name}`,
        time: '2:00 PM',
        category: 'Sightseeing',
        price: Math.floor(Math.random() * 30),
      });
    }
    dayItems.push({
      id: `custom-${i}-3`,
      name: 'Local Dining Experience',
      time: '7:00 PM',
      category: 'Food',
      price: Math.floor(Math.random() * 50) + 30,
    });
    activities.push({ day: i + 1, items: dayItems });
  }
  
  return {
    flights: [
      { id: '1', from: 'Your City', to: placeName, time: '8:00 AM', duration: '4h 30m', price: 650 },
      { id: '2', from: placeName, to: 'Your City', time: '6:00 PM', duration: '4h 30m', price: 650 },
    ],
    hotels: [
      { id: '1', name: `Premium ${placeName} Resort`, rating: 5, pricePerNight: 350, nights: days, image: '' },
    ],
    activities,
  };
};

export default function TravelPlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedDays, setExpandedDays] = useState<number[]>([1, 2, 3]);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  
  const bookTrip = useBookTrip();
  const createItinerary = useCreateItinerary();

  // Check if this is a generated trip
  const generatedState = location.state as { 
    placeId?: string; 
    placeName?: string; 
    selectedPlaces?: any[]; 
    isCustom?: boolean;
  } | null;

  // Check if this is an AI generated trip from search
  const searchFilters = location.pathname === '/plan/generated' && !generatedState 
    ? JSON.parse(localStorage.getItem('searchFilters') || 'null')
    : null;

  const isGeneratedTrip = location.pathname === '/plan/generated' && (generatedState || searchFilters);

  // Get destination data
  let destination;
  let itinerary = mockItinerary;
  
  if (generatedState) {
    const placeData = getPlaceById(generatedState.placeId || '');
    if (placeData) {
      destination = {
        id: placeData.id,
        name: placeData.name,
        country: placeData.country,
        image: placeData.image,
        rating: 4.8,
        budget: '$$$',
      };
      if (generatedState.isCustom && generatedState.selectedPlaces) {
        itinerary = generateCustomItinerary(generatedState.selectedPlaces, placeData.name);
      }
    } else {
      destination = destinations[0];
    }
  } else if (searchFilters) {
    // AI Generated trip from search page
    destination = {
      id: 'ai-generated',
      name: searchFilters.country || 'Your Destination',
      country: searchFilters.country || 'World',
      image: destinations[0]?.image || '/placeholder.svg',
      rating: 4.9,
      budget: searchFilters.budget ? `$${searchFilters.budget[0]} - $${searchFilters.budget[1]}` : '$$$',
    };
    
    // Generate itinerary based on search filters
    const days = searchFilters.dateFrom && searchFilters.dateTo 
      ? Math.ceil((new Date(searchFilters.dateTo).getTime() - new Date(searchFilters.dateFrom).getTime()) / (1000 * 60 * 60 * 24))
      : 5;
    
    const generatedActivities = [];
    for (let i = 1; i <= days; i++) {
      const dayItems = [];
      // Morning activity based on preferences
      if (searchFilters.activities?.includes('Cultural Experiences')) {
        dayItems.push({ id: `ai-${i}-1`, name: 'Cultural Walking Tour', time: '9:00 AM', category: 'Culture', price: 45 });
      } else if (searchFilters.activities?.includes('Adventure Sports')) {
        dayItems.push({ id: `ai-${i}-1`, name: 'Adventure Excursion', time: '9:00 AM', category: 'Adventure', price: 85 });
      } else {
        dayItems.push({ id: `ai-${i}-1`, name: 'City Exploration', time: '9:00 AM', category: 'Sightseeing', price: 25 });
      }
      
      // Afternoon activity
      if (searchFilters.activities?.includes('Beach Activities')) {
        dayItems.push({ id: `ai-${i}-2`, name: 'Beach & Water Sports', time: '2:00 PM', category: 'Beach', price: 60 });
      } else if (searchFilters.activities?.includes('Nature & Wildlife')) {
        dayItems.push({ id: `ai-${i}-2`, name: 'Nature Reserve Visit', time: '2:00 PM', category: 'Nature', price: 50 });
      } else {
        dayItems.push({ id: `ai-${i}-2`, name: 'Local Attractions', time: '2:00 PM', category: 'Sightseeing', price: 30 });
      }
      
      // Dinner based on food preferences
      const cuisineType = searchFilters.food?.[0] || 'Local';
      dayItems.push({ id: `ai-${i}-3`, name: `${cuisineType} Cuisine Dinner`, time: '7:30 PM', category: 'Food', price: 55 });
      
      generatedActivities.push({ day: i, items: dayItems });
    }
    
    itinerary = {
      flights: [
        { id: 'ai-f1', from: 'Your City', to: searchFilters.country, time: '8:00 AM', duration: '4h 30m', price: 550 },
        { id: 'ai-f2', from: searchFilters.country, to: 'Your City', time: '6:00 PM', duration: '4h 30m', price: 550 },
      ],
      hotels: [
        { 
          id: 'ai-h1', 
          name: `${searchFilters.hotelRating || 4}★ Premium Resort`, 
          rating: searchFilters.hotelRating || 4, 
          pricePerNight: searchFilters.hotelRating === 5 ? 350 : searchFilters.hotelRating === 4 ? 200 : 100, 
          nights: days, 
          image: '' 
        },
      ],
      activities: generatedActivities,
    };
  } else {
    destination = destinations.find(d => d.id === id) || destinations[0];
  }

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const totalFlightsCost = itinerary.flights.reduce((sum, f) => sum + f.price, 0);
  const totalHotelsCost = itinerary.hotels.reduce((sum, h) => sum + h.pricePerNight * (h.nights || 5), 0);
  const totalActivitiesCost = itinerary.activities.flatMap(d => d.items).reduce((sum, a) => sum + (a.price || 0), 0);
  const totalCost = totalFlightsCost + totalHotelsCost + totalActivitiesCost;

  // Prepare booking items
  const bookingFlights = itinerary.flights.map(f => ({
    id: f.id,
    name: `${f.from} → ${f.to}`,
    price: f.price,
    details: `${f.time} • ${f.duration}`,
  }));

  const bookingHotels = itinerary.hotels.map(h => ({
    id: h.id,
    name: h.name,
    price: h.pricePerNight * (h.nights || 5),
    details: `${h.nights || 5} nights @ $${h.pricePerNight}/night`,
  }));

  const bookingActivities = itinerary.activities.flatMap(day => 
    day.items.filter(item => (item.price || 0) > 0).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price || 0,
      details: `Day ${day.day} • ${item.time}`,
    }))
  );

  const handleConfirmBooking = async () => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to book a trip.', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    try {
      // First create the itinerary if it's a generated one
      let itineraryId = id;
      
      if (isGeneratedTrip) {
        const newItinerary = await createItinerary.mutateAsync({
          title: `Trip to ${destination.name}`,
          destination: destination.name,
          country: destination.country,
          cover_image: destination.image,
          nights: itinerary.activities.length,
          budget: typeof destination.budget === 'string' ? destination.budget : `$${totalCost}`,
          is_public: false,
          is_ai_generated: true,
          total_cost: totalCost,
          flights: itinerary.flights.map(f => ({
            departure_airport: f.from,
            arrival_airport: f.to,
            departure_time: f.time,
            arrival_time: null,
            airline: null,
            flight_number: null,
            price: f.price,
          })),
          hotels: itinerary.hotels.map(h => ({
            name: h.name,
            rating: h.rating,
            price_per_night: h.pricePerNight,
            check_in: null,
            check_out: null,
            image_url: h.image || null,
          })),
          days: itinerary.activities.map(day => ({
            day_number: day.day,
            activities: day.items.map(item => ({
              name: item.name,
              time: item.time,
              category: item.category,
              price: item.price,
              duration: null,
              description: null,
            })),
          })),
        });
        itineraryId = newItinerary.id;
      }

      if (!itineraryId) {
        throw new Error('No itinerary ID available');
      }

      // Book the trip
      await bookTrip.mutateAsync({
        itineraryId,
        flightsBooked: bookingFlights.length > 0,
        hotelsBooked: bookingHotels.length > 0,
        activitiesBooked: bookingActivities.length > 0,
      });

      toast({ 
        title: 'Trip Booked!', 
        description: 'Your trip has been booked successfully. View it in My Trips.',
      });
    } catch (error: any) {
      toast({ 
        title: 'Booking Failed', 
        description: error.message || 'Failed to book trip', 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  return (
    <Layout>
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Destination Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Badge className="gradient-sky text-primary-foreground mb-2">
                  {isGeneratedTrip ? (generatedState?.isCustom ? 'Custom Trip' : 'Generated Trip') : destination.budget}
                </Badge>
                <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
                  {destination.name}, {destination.country}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {itinerary.activities.length} Days
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    {destination.rating}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-card shadow-travel"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl">Trip Summary</h2>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {totalCost.toLocaleString()} Total
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Plane className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">{itinerary.flights.length} Flights</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Hotel className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">{itinerary.activities.length} Nights</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Camera className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-sm font-medium">{itinerary.activities.flatMap(d => d.items).length} Activities</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Utensils className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-sm font-medium">{itinerary.activities.flatMap(d => d.items).filter(i => i.category === 'Food').length} Restaurants</p>
                </div>
              </div>
            </motion.div>

            {/* Flights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card shadow-travel"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center">
                    <Plane className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h2 className="font-display font-bold text-xl">Flights</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Change
                </Button>
              </div>
              <div className="space-y-4">
                {itinerary.flights.map((flight) => (
                  <div key={flight.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold">{flight.from}</p>
                        <p className="text-sm text-muted-foreground">{flight.time}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-8 h-px bg-border" />
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">{flight.duration}</span>
                        <div className="w-8 h-px bg-border" />
                      </div>
                      <div>
                        <p className="font-semibold">{flight.to}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">${flight.price}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hotels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card shadow-travel"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h2 className="font-display font-bold text-xl">Hotels</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Change
                </Button>
              </div>
              <div className="space-y-4">
                {itinerary.hotels.map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                    <div>
                      <p className="font-semibold">{hotel.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(hotel.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary">${hotel.pricePerNight}/night</Badge>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="font-display font-bold text-xl">Daily Itinerary</h2>
              {itinerary.activities.map(({ day, items }) => (
                <div key={day} className="rounded-2xl bg-card shadow-travel overflow-hidden">
                  <button
                    onClick={() => toggleDay(day)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center text-primary-foreground font-bold">
                        {day}
                      </div>
                      <span className="font-semibold">Day {day}</span>
                    </div>
                    {expandedDays.includes(day) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  {expandedDays.includes(day) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-4 pb-4"
                    >
                      <div className="space-y-3 pl-4 border-l-2 border-primary/20">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between pl-4">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.time}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {(item.price || 0) > 0 && (
                                <Badge variant="secondary">${item.price}</Badge>
                              )}
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Book Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky bottom-20 md:bottom-4"
            >
              <Button 
                onClick={() => setShowBookingDialog(true)}
                className="w-full gradient-sunset text-accent-foreground shadow-accent-glow rounded-xl py-6 text-lg"
              >
                Book This Trip - ${totalCost.toLocaleString()}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        flights={bookingFlights}
        hotels={bookingHotels}
        activities={bookingActivities}
        totalCost={totalCost}
        destinationName={destination.name}
        onConfirmBooking={handleConfirmBooking}
      />
    </Layout>
  );
}
