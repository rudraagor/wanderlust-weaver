import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Star, 
  Plane, Hotel, Camera, Utensils, DollarSign,
  ChevronDown, ChevronUp, Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { destinations } from '@/data/mockData';

// Mock itinerary data
const mockItinerary = {
  flights: [
    { id: '1', from: 'New York (JFK)', to: 'Athens (ATH)', time: '10:30 AM', duration: '10h 30m', price: 850 },
    { id: '2', from: 'Athens (ATH)', to: 'Santorini (JTR)', time: '2:00 PM', duration: '45m', price: 120 },
  ],
  hotels: [
    { id: '1', name: 'Canaves Oia Suites', rating: 5, pricePerNight: 450, image: '' },
    { id: '2', name: 'Grace Santorini', rating: 5, pricePerNight: 380, image: '' },
  ],
  activities: [
    { day: 1, items: [
      { id: '1', name: 'Sunset at Oia Castle', time: '6:00 PM', category: 'Sightseeing' },
      { id: '2', name: 'Traditional Greek Dinner', time: '8:30 PM', category: 'Food' },
    ]},
    { day: 2, items: [
      { id: '3', name: 'Caldera Boat Tour', time: '10:00 AM', category: 'Adventure' },
      { id: '4', name: 'Wine Tasting Tour', time: '4:00 PM', category: 'Food' },
    ]},
    { day: 3, items: [
      { id: '5', name: 'Ancient Akrotiri Visit', time: '9:00 AM', category: 'History' },
      { id: '6', name: 'Red Beach', time: '2:00 PM', category: 'Beach' },
    ]},
  ]
};

export default function TravelPlanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expandedDays, setExpandedDays] = useState<number[]>([1, 2, 3]);

  const destination = destinations.find(d => d.id === id) || destinations[0];

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const totalCost = mockItinerary.flights.reduce((sum, f) => sum + f.price, 0) +
    mockItinerary.hotels.reduce((sum, h) => sum + h.pricePerNight * 5, 0);

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
                  {destination.budget}
                </Badge>
                <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">
                  {destination.name}, {destination.country}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Jan 15 - Jan 22, 2024
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
                  <p className="text-sm font-medium">2 Flights</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Hotel className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-sm font-medium">5 Nights</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Camera className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-sm font-medium">6 Activities</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <Utensils className="w-5 h-5 mx-auto mb-1 text-accent" />
                  <p className="text-sm font-medium">4 Restaurants</p>
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
                {mockItinerary.flights.map((flight) => (
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
                {mockItinerary.hotels.map((hotel) => (
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
              {mockItinerary.activities.map(({ day, items }) => (
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
                            <Badge variant="outline">{item.category}</Badge>
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
              <Button className="w-full gradient-sunset text-accent-foreground shadow-accent-glow rounded-xl py-6 text-lg">
                Book This Trip - ${totalCost.toLocaleString()}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
