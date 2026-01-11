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
import { useCreateItinerary, useItinerary } from '@/hooks/useItineraries';
import { useCreateExpense } from '@/hooks/useExpenses';
import { useToast } from '@/hooks/use-toast';
import { resolveImageUrl } from '@/hooks/usePlaces';

// Flight and hotel interfaces with extended properties
interface Flight {
  id: string;
  from: string;
  to: string;
  time: string;
  duration: string;
  price: number;
  airline?: string;
  flightNumber?: string;
  class?: string;
}

interface HotelInfo {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  nights: number;
  image: string;
  roomType?: string;
  amenities?: string[];
}

interface ActivityItem {
  id: string;
  name: string;
  time: string;
  category: string;
  price: number;
}

interface ItineraryData {
  flights: Flight[];
  hotels: HotelInfo[];
  activities: { day: number; items: ActivityItem[] }[];
}

// Mock itinerary data
const mockItinerary: ItineraryData = {
  flights: [
    { id: '1', from: 'New York (JFK)', to: 'Athens (ATH)', time: '10:30 AM', duration: '10h 30m', price: 850, airline: 'Delta', flightNumber: 'DL456' },
    { id: '2', from: 'Athens (ATH)', to: 'Santorini (JTR)', time: '2:00 PM', duration: '45m', price: 120, airline: 'Aegean', flightNumber: 'A3201' },
  ],
  hotels: [
    { id: '1', name: 'Canaves Oia Suites', rating: 5, pricePerNight: 450, nights: 5, image: '', roomType: 'Luxury Suite', amenities: ['Pool', 'Spa', 'Gym', 'Free WiFi'] },
    { id: '2', name: 'Grace Santorini', rating: 5, pricePerNight: 380, nights: 5, image: '', roomType: 'Deluxe Room', amenities: ['Pool', 'Restaurant', 'Bar'] },
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
const generateCustomItinerary = (selectedPlaces: any[], placeName: string): ItineraryData => {
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
      { id: '1', from: 'Your City', to: placeName, time: '8:00 AM', duration: '4h 30m', price: 650, airline: 'United', flightNumber: 'UA123' },
      { id: '2', from: placeName, to: 'Your City', time: '6:00 PM', duration: '4h 30m', price: 650, airline: 'United', flightNumber: 'UA456' },
    ],
    hotels: [
      { id: '1', name: `Premium ${placeName} Resort`, rating: 5, pricePerNight: 350, nights: days, image: '', roomType: 'Deluxe Suite', amenities: ['Pool', 'Spa', 'Gym'] },
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
  const createExpense = useCreateExpense();

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

  // Check if this is an existing itinerary (UUID format)
  const isExistingItinerary = id && id !== 'generated' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // Fetch existing itinerary from database
  const { data: dbItinerary, isLoading: isLoadingItinerary } = useItinerary(isExistingItinerary ? id : undefined);

  // Get destination data
  let destination: { id: string; name: string; country: string; image: string; rating: number; budget: string } | undefined;
  let itinerary: ItineraryData = mockItinerary;
  
  // If we have database data, transform it to the UI format
  if (isExistingItinerary && dbItinerary) {
    destination = {
      id: dbItinerary.id,
      name: dbItinerary.destination,
      country: dbItinerary.country || '',
      image: resolveImageUrl(dbItinerary.cover_image, dbItinerary.destination),
      rating: 4.8,
      budget: dbItinerary.budget || '$$$',
    };

    // Transform database flights to UI format
    const dbFlights = (dbItinerary.itinerary_flights || []).map((f: any) => ({
      id: f.id,
      from: f.departure_airport,
      to: f.arrival_airport,
      time: f.departure_time || '8:00 AM',
      duration: '4h 30m',
      price: f.price || 0,
      airline: f.airline || undefined,
      flightNumber: f.flight_number || undefined,
    }));

    // Transform database hotels to UI format
    const dbHotels = (dbItinerary.itinerary_hotels || []).map((h: any) => ({
      id: h.id,
      name: h.name,
      rating: h.rating || 4,
      pricePerNight: h.price_per_night || 0,
      nights: dbItinerary.nights || 5,
      image: h.image_url || '',
    }));

    // Transform database days/activities to UI format
    const dbActivities = (dbItinerary.itinerary_days || []).map((day: any) => ({
      day: day.day_number,
      items: (day.itinerary_activities || []).map((a: any) => ({
        id: a.id,
        name: a.name,
        time: a.time || '10:00 AM',
        category: a.category || 'Activity',
        price: a.price || 0,
      })),
    }));

    itinerary = {
      flights: dbFlights.length > 0 ? dbFlights : mockItinerary.flights,
      hotels: dbHotels.length > 0 ? dbHotels : mockItinerary.hotels,
      activities: dbActivities.length > 0 ? dbActivities : mockItinerary.activities,
    };
  } else if (generatedState) {
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
    const sourceCity = searchFilters.sourceCity || 'New York (JFK)';
    const destinationCountry = searchFilters.country || 'Your Destination';
    
    // Generate realistic airport codes based on country
    const airportCodes: Record<string, string> = {
      'Greece': 'ATH', 'Japan': 'NRT', 'Peru': 'LIM', 'Maldives': 'MLE', 'France': 'CDG',
      'Indonesia': 'DPS', 'Italy': 'FCO', 'Spain': 'MAD', 'Thailand': 'BKK', 'Australia': 'SYD',
      'USA': 'LAX', 'Mexico': 'MEX', 'United Kingdom': 'LHR', 'Germany': 'FRA',
      'Switzerland': 'ZRH', 'Portugal': 'LIS', 'Turkey': 'IST', 'Egypt': 'CAI',
      'Morocco': 'CMN', 'South Africa': 'JNB', 'Kenya': 'NBO', 'India': 'DEL',
      'Vietnam': 'SGN', 'Singapore': 'SIN', 'New Zealand': 'AKL', 'Canada': 'YYZ',
      'Brazil': 'GRU', 'Argentina': 'EZE', 'United Arab Emirates': 'DXB', 'South Korea': 'ICN'
    };
    const destAirport = airportCodes[destinationCountry] || 'INT';
    
    // Generate flight details with airline names
    const airlines = ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'Lufthansa', 'British Airways', 'Air France', 'Delta', 'United'];
    const randomAirline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = `${randomAirline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 900) + 100}`;
    
    // Calculate flight price based on distance/destination
    const baseFlightPrice = destinationCountry.includes('Europe') ? 650 : 
                           destinationCountry.includes('Asia') ? 850 : 
                           destinationCountry.includes('Australia') ? 1200 : 550;
    const flightPrice = baseFlightPrice + Math.floor(Math.random() * 200);
    
    // Calculate duration
    const flightDurations: Record<string, string> = {
      'Greece': '10h 30m', 'Japan': '14h 15m', 'Peru': '8h 45m', 'Maldives': '18h 20m',
      'France': '7h 30m', 'Indonesia': '20h 15m', 'Italy': '8h 45m', 'Spain': '7h 50m',
      'Thailand': '17h 30m', 'Australia': '22h 15m', 'United Kingdom': '7h 15m',
      'Germany': '8h 20m', 'Switzerland': '8h 35m', 'United Arab Emirates': '13h 45m'
    };
    const duration = flightDurations[destinationCountry] || '10h 30m';

    destination = {
      id: 'ai-generated',
      name: destinationCountry,
      country: destinationCountry,
      image: destinations[0]?.image || '/placeholder.svg',
      rating: 4.9,
      budget: searchFilters.budget ? `$${searchFilters.budget[0]} - $${searchFilters.budget[1]}` : '$$$',
    };
    
    // Generate itinerary based on search filters
    const days = searchFilters.dateFrom && searchFilters.dateTo 
      ? Math.ceil((new Date(searchFilters.dateTo).getTime() - new Date(searchFilters.dateFrom).getTime()) / (1000 * 60 * 60 * 24))
      : 5;
    
    // Hotel names based on rating
    const hotelNames: Record<number, string[]> = {
      5: ['The Ritz-Carlton', 'Four Seasons Resort', 'Mandarin Oriental', 'St. Regis', 'Park Hyatt'],
      4: ['Marriott Resort', 'Hilton Garden Inn', 'Hyatt Regency', 'InterContinental', 'Westin'],
      3: ['Holiday Inn', 'Best Western Plus', 'Courtyard by Marriott', 'Novotel', 'Radisson'],
      2: ['Comfort Inn', 'Hampton Inn', 'La Quinta', 'Days Inn', 'Quality Inn'],
    };
    const hotelRating = searchFilters.hotelRating || 4;
    const hotelNameOptions = hotelNames[hotelRating] || hotelNames[4];
    const selectedHotel = hotelNameOptions[Math.floor(Math.random() * hotelNameOptions.length)];
    
    // Price per night based on rating and destination
    const basePricePerNight = hotelRating === 5 ? 450 : hotelRating === 4 ? 220 : hotelRating === 3 ? 120 : 80;
    const pricePerNight = basePricePerNight + Math.floor(Math.random() * 50);
    
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
        { 
          id: 'ai-f1', 
          from: sourceCity, 
          to: `${destinationCountry} (${destAirport})`, 
          time: '8:00 AM', 
          duration, 
          price: flightPrice,
          airline: randomAirline,
          flightNumber,
          class: 'Economy'
        },
        { 
          id: 'ai-f2', 
          from: `${destinationCountry} (${destAirport})`, 
          to: sourceCity, 
          time: '6:00 PM', 
          duration, 
          price: flightPrice,
          airline: randomAirline,
          flightNumber: `${randomAirline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 900) + 100}`,
          class: 'Economy'
        },
      ],
      hotels: [
        { 
          id: 'ai-h1', 
          name: `${selectedHotel} ${destinationCountry}`, 
          rating: hotelRating, 
          pricePerNight, 
          nights: days, 
          image: '',
          roomType: hotelRating >= 4 ? 'Deluxe Suite' : 'Standard Room',
          amenities: hotelRating >= 4 ? ['Pool', 'Spa', 'Gym', 'Free WiFi', 'Breakfast'] : ['Free WiFi', 'Breakfast']
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
      const bookedTrip = await bookTrip.mutateAsync({
        itineraryId,
        flightsBooked: bookingFlights.length > 0,
        hotelsBooked: bookingHotels.length > 0,
        activitiesBooked: bookingActivities.length > 0,
      });

      // Add expenses for the booked trip
      const expensePromises = [];
      
      // Add flight expenses
      for (const flight of itinerary.flights) {
        expensePromises.push(
          createExpense.mutateAsync({
            booked_trip_id: bookedTrip.id,
            category: 'flight',
            description: `Flight: ${flight.from} → ${flight.to}${flight.airline ? ` (${flight.airline} ${flight.flightNumber})` : ''}`,
            amount: flight.price,
          })
        );
      }
      
      // Add hotel expenses
      for (const hotel of itinerary.hotels) {
        expensePromises.push(
          createExpense.mutateAsync({
            booked_trip_id: bookedTrip.id,
            category: 'hotel',
            description: `${hotel.name}${hotel.roomType ? ` - ${hotel.roomType}` : ''} (${hotel.nights} nights)`,
            amount: hotel.pricePerNight * (hotel.nights || 1),
          })
        );
      }
      
      // Add activity expenses
      for (const day of itinerary.activities) {
        for (const activity of day.items) {
          if (activity.price > 0) {
            expensePromises.push(
              createExpense.mutateAsync({
                booked_trip_id: bookedTrip.id,
                category: 'activity',
                description: `Day ${day.day}: ${activity.name}`,
                amount: activity.price,
              })
            );
          }
        }
      }
      
      await Promise.all(expensePromises);

      toast({ 
        title: 'Trip Booked!', 
        description: 'Your trip has been booked successfully. View it in My Trips.',
      });
      
      // Navigate to my trips page
      navigate('/my-trips');
    } catch (error: any) {
      toast({ 
        title: 'Booking Failed', 
        description: error.message || 'Failed to book trip', 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  // Show loading state for existing itineraries
  if (isExistingItinerary && isLoadingItinerary) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading trip details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle missing destination gracefully
  if (!destination) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl font-semibold mb-2">Trip not found</p>
            <p className="text-muted-foreground mb-4">The trip you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/my-trips')} className="gradient-sky text-primary-foreground">
              Go to My Trips
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
