import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Plane, Hotel, Calendar, Utensils,
  Camera, Plus, X, Check, MapPin, Clock, DollarSign, Star, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateItinerary, useUploadItineraryPhoto } from '@/hooks/useItineraries';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 'basic', title: 'Basic Info', icon: MapPin },
  { id: 'flights', title: 'Flights', icon: Plane },
  { id: 'hotels', title: 'Hotels', icon: Hotel },
  { id: 'itinerary', title: 'Daily Plan', icon: Calendar },
  { id: 'photos', title: 'Photos', icon: Camera },
];

interface FlightData {
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  airline: string;
  price: number;
}

interface HotelData {
  name: string;
  rating: number;
  price_per_night: number;
  check_in: string;
  check_out: string;
}

interface ActivityData {
  name: string;
  time: string;
  duration: string;
  price: number;
  category: string;
}

interface RestaurantData {
  name: string;
  cuisine: string;
  meal_type: string;
  price_range: string;
}

interface DayData {
  day_number: number;
  date: string;
  activities: ActivityData[];
  restaurants: RestaurantData[];
}

export default function CreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const createItinerary = useCreateItinerary();
  const uploadPhoto = useUploadItineraryPhoto();

  const [currentStep, setCurrentStep] = useState(0);
  
  // Basic info
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [nights, setNights] = useState(1);
  const [budget, setBudget] = useState<string>('mid-range');
  const [isPublic, setIsPublic] = useState(true);

  // Flights
  const [flights, setFlights] = useState<FlightData[]>([
    { departure_airport: '', arrival_airport: '', departure_time: '', airline: '', price: 0 }
  ]);

  // Hotels
  const [hotels, setHotels] = useState<HotelData[]>([
    { name: '', rating: 4, price_per_night: 0, check_in: '', check_out: '' }
  ]);

  // Days
  const [days, setDays] = useState<DayData[]>([
    { day_number: 1, date: '', activities: [], restaurants: [] }
  ]);

  // Photos
  const [photos, setPhotos] = useState<{ file?: File; url?: string; caption: string }[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');

  // Auth check
  if (!user) {
    navigate('/auth');
    return null;
  }

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const addFlight = () => {
    setFlights([...flights, { departure_airport: '', arrival_airport: '', departure_time: '', airline: '', price: 0 }]);
  };

  const removeFlight = (index: number) => {
    setFlights(flights.filter((_, i) => i !== index));
  };

  const updateFlight = (index: number, field: keyof FlightData, value: string | number) => {
    const updated = [...flights];
    updated[index] = { ...updated[index], [field]: value };
    setFlights(updated);
  };

  const addHotel = () => {
    setHotels([...hotels, { name: '', rating: 4, price_per_night: 0, check_in: '', check_out: '' }]);
  };

  const removeHotel = (index: number) => {
    setHotels(hotels.filter((_, i) => i !== index));
  };

  const updateHotel = (index: number, field: keyof HotelData, value: string | number) => {
    const updated = [...hotels];
    updated[index] = { ...updated[index], [field]: value };
    setHotels(updated);
  };

  const addDay = () => {
    setDays([...days, { day_number: days.length + 1, date: '', activities: [], restaurants: [] }]);
    setNights(days.length + 1);
  };

  const removeDay = (index: number) => {
    const updated = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, day_number: i + 1 }));
    setDays(updated);
    setNights(updated.length);
  };

  const addActivity = (dayIndex: number) => {
    const updated = [...days];
    updated[dayIndex].activities.push({ name: '', time: '', duration: '', price: 0, category: 'Sightseeing' });
    setDays(updated);
  };

  const updateActivity = (dayIndex: number, actIndex: number, field: keyof ActivityData, value: string | number) => {
    const updated = [...days];
    updated[dayIndex].activities[actIndex] = { ...updated[dayIndex].activities[actIndex], [field]: value };
    setDays(updated);
  };

  const removeActivity = (dayIndex: number, actIndex: number) => {
    const updated = [...days];
    updated[dayIndex].activities = updated[dayIndex].activities.filter((_, i) => i !== actIndex);
    setDays(updated);
  };

  const addRestaurant = (dayIndex: number) => {
    const updated = [...days];
    updated[dayIndex].restaurants.push({ name: '', cuisine: '', meal_type: 'Lunch', price_range: '$$' });
    setDays(updated);
  };

  const updateRestaurant = (dayIndex: number, restIndex: number, field: keyof RestaurantData, value: string) => {
    const updated = [...days];
    updated[dayIndex].restaurants[restIndex] = { ...updated[dayIndex].restaurants[restIndex], [field]: value };
    setDays(updated);
  };

  const removeRestaurant = (dayIndex: number, restIndex: number) => {
    const updated = [...days];
    updated[dayIndex].restaurants = updated[dayIndex].restaurants.filter((_, i) => i !== restIndex);
    setDays(updated);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, { file, url: reader.result as string, caption: '' }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const updatePhotoCaption = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index].caption = caption;
    setPhotos(updated);
  };

  const calculateTotalCost = () => {
    const flightsCost = flights.reduce((sum, f) => sum + (f.price || 0), 0);
    const hotelsCost = hotels.reduce((sum, h) => sum + (h.price_per_night || 0) * nights, 0);
    const activitiesCost = days.reduce((sum, d) => 
      sum + d.activities.reduce((s, a) => s + (a.price || 0), 0), 0);
    return flightsCost + hotelsCost + activitiesCost;
  };

  const handleSubmit = async () => {
    if (!title || !destination) {
      toast({ title: 'Error', description: 'Please fill in title and destination', variant: 'destructive' });
      return;
    }

    try {
      // Upload photos first
      const uploadedPhotos: { photo_url: string; caption?: string }[] = [];
      for (const photo of photos) {
        if (photo.file) {
          const url = await uploadPhoto.mutateAsync(photo.file);
          uploadedPhotos.push({ photo_url: url, caption: photo.caption });
          if (!coverImage) setCoverImage(url);
        }
      }

      // Create itinerary
      await createItinerary.mutateAsync({
        title,
        destination,
        country,
        cover_image: coverImage || uploadedPhotos[0]?.photo_url,
        start_date: startDate,
        end_date: endDate,
        nights,
        budget,
        is_public: isPublic,
        is_ai_generated: false,
        total_cost: calculateTotalCost(),
        flights: flights.filter(f => f.departure_airport && f.arrival_airport).map(f => ({
          ...f,
          arrival_time: null,
          flight_number: null,
        })),
        hotels: hotels.filter(h => h.name).map(h => ({
          ...h,
          image_url: null,
        })),
        days: days.map(d => ({
          day_number: d.day_number,
          date: d.date,
          activities: d.activities.filter(a => a.name).map(a => ({ ...a, description: null })),
          restaurants: d.restaurants.filter(r => r.name),
        })),
        photos: uploadedPhotos,
      });

      toast({ title: 'Success!', description: 'Your itinerary has been created' });
      navigate('/profile');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const nextStep = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(0, currentStep - 1));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display font-bold text-3xl mb-2">Create Your Itinerary</h1>
            <p className="text-muted-foreground">Share your travel experience with the community</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  index === currentStep
                    ? 'gradient-sky text-primary-foreground shadow-travel'
                    : index < currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Step 0: Basic Info */}
              {currentStep === 0 && (
                <div className="p-6 rounded-2xl bg-card shadow-travel space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Trip Title *</Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Amazing Greece Adventure"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Destination *</Label>
                      <Input
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Santorini"
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Greece"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Budget Category</Label>
                      <div className="flex gap-2">
                        {['budget', 'mid-range', 'luxury'].map((b) => (
                          <Badge
                            key={b}
                            variant={budget === b ? 'default' : 'outline'}
                            className={`cursor-pointer px-4 py-2 capitalize ${
                              budget === b ? 'gradient-sky text-primary-foreground' : ''
                            }`}
                            onClick={() => setBudget(b)}
                          >
                            {b}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={startDate}
                        min={getTodayDate()}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={endDate}
                        min={startDate || getTodayDate()}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nights</Label>
                      <Input
                        type="number"
                        value={nights}
                        min={1}
                        onChange={(e) => setNights(parseInt(e.target.value) || 1)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Make Public</p>
                      <p className="text-sm text-muted-foreground">Allow others to see this itinerary</p>
                    </div>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                </div>
              )}

              {/* Step 1: Flights */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {flights.map((flight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-card shadow-travel space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg gradient-sky flex items-center justify-center">
                            <Plane className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <span className="font-semibold">Flight {index + 1}</span>
                        </div>
                        {flights.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeFlight(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Departure Airport</Label>
                          <Input
                            value={flight.departure_airport}
                            onChange={(e) => updateFlight(index, 'departure_airport', e.target.value)}
                            placeholder="JFK - New York"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Arrival Airport</Label>
                          <Input
                            value={flight.arrival_airport}
                            onChange={(e) => updateFlight(index, 'arrival_airport', e.target.value)}
                            placeholder="ATH - Athens"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Departure Time</Label>
                          <Input
                            type="datetime-local"
                            value={flight.departure_time}
                            onChange={(e) => updateFlight(index, 'departure_time', e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Airline</Label>
                          <Input
                            value={flight.airline}
                            onChange={(e) => updateFlight(index, 'airline', e.target.value)}
                            placeholder="Delta Airlines"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price ($)</Label>
                          <Input
                            type="number"
                            value={flight.price || ''}
                            onChange={(e) => updateFlight(index, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="850"
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <Button variant="outline" onClick={addFlight} className="w-full rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add Another Flight
                  </Button>
                </div>
              )}

              {/* Step 2: Hotels */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {hotels.map((hotel, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-card shadow-travel space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg gradient-sunset flex items-center justify-center">
                            <Hotel className="w-4 h-4 text-accent-foreground" />
                          </div>
                          <span className="font-semibold">Hotel {index + 1}</span>
                        </div>
                        {hotels.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeHotel(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label>Hotel Name</Label>
                          <Input
                            value={hotel.name}
                            onChange={(e) => updateHotel(index, 'name', e.target.value)}
                            placeholder="Grand Hotel Santorini"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating</Label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => updateHotel(index, 'rating', star)}
                                className="p-1"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= hotel.rating
                                      ? 'fill-accent text-accent'
                                      : 'text-muted'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Price per Night ($)</Label>
                          <Input
                            type="number"
                            value={hotel.price_per_night || ''}
                            onChange={(e) => updateHotel(index, 'price_per_night', parseFloat(e.target.value) || 0)}
                            placeholder="200"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Check-in</Label>
                          <Input
                            type="date"
                            value={hotel.check_in}
                            min={getTodayDate()}
                            onChange={(e) => updateHotel(index, 'check_in', e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Check-out</Label>
                          <Input
                            type="date"
                            value={hotel.check_out}
                            min={hotel.check_in || getTodayDate()}
                            onChange={(e) => updateHotel(index, 'check_out', e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <Button variant="outline" onClick={addHotel} className="w-full rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add Another Hotel
                  </Button>
                </div>
              )}

              {/* Step 3: Daily Itinerary */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {days.map((day, dayIndex) => (
                    <motion.div
                      key={dayIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-card shadow-travel space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center text-primary-foreground font-bold">
                            {day.day_number}
                          </div>
                          <div>
                            <span className="font-semibold">Day {day.day_number}</span>
                            <Input
                              type="date"
                              value={day.date}
                              min={getTodayDate()}
                              onChange={(e) => {
                                const updated = [...days];
                                updated[dayIndex].date = e.target.value;
                                setDays(updated);
                              }}
                              className="rounded-lg h-8 w-40 mt-1"
                            />
                          </div>
                        </div>
                        {days.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => removeDay(dayIndex)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* Activities */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Activities
                          </Label>
                          <Button variant="ghost" size="sm" onClick={() => addActivity(dayIndex)}>
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        {day.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-muted/30">
                            <Input
                              value={activity.name}
                              onChange={(e) => updateActivity(dayIndex, actIndex, 'name', e.target.value)}
                              placeholder="Activity name"
                              className="rounded-lg col-span-2"
                            />
                            <Input
                              type="time"
                              value={activity.time}
                              onChange={(e) => updateActivity(dayIndex, actIndex, 'time', e.target.value)}
                              className="rounded-lg"
                            />
                            <Input
                              type="number"
                              value={activity.price || ''}
                              onChange={(e) => updateActivity(dayIndex, actIndex, 'price', parseFloat(e.target.value) || 0)}
                              placeholder="$"
                              className="rounded-lg"
                            />
                            <Button variant="ghost" size="icon" onClick={() => removeActivity(dayIndex, actIndex)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Restaurants */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Utensils className="w-4 h-4" /> Restaurants
                          </Label>
                          <Button variant="ghost" size="sm" onClick={() => addRestaurant(dayIndex)}>
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                        {day.restaurants.map((restaurant, restIndex) => (
                          <div key={restIndex} className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-muted/30">
                            <Input
                              value={restaurant.name}
                              onChange={(e) => updateRestaurant(dayIndex, restIndex, 'name', e.target.value)}
                              placeholder="Restaurant name"
                              className="rounded-lg col-span-2"
                            />
                            <Input
                              value={restaurant.cuisine}
                              onChange={(e) => updateRestaurant(dayIndex, restIndex, 'cuisine', e.target.value)}
                              placeholder="Cuisine"
                              className="rounded-lg"
                            />
                            <select
                              value={restaurant.meal_type}
                              onChange={(e) => updateRestaurant(dayIndex, restIndex, 'meal_type', e.target.value)}
                              className="rounded-lg bg-background border px-2 text-sm"
                            >
                              <option>Breakfast</option>
                              <option>Lunch</option>
                              <option>Dinner</option>
                            </select>
                            <Button variant="ghost" size="icon" onClick={() => removeRestaurant(dayIndex, restIndex)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  <Button variant="outline" onClick={addDay} className="w-full rounded-xl">
                    <Plus className="w-4 h-4 mr-2" /> Add Another Day
                  </Button>
                </div>
              )}

              {/* Step 4: Photos */}
              {currentStep === 4 && (
                <div className="p-6 rounded-2xl bg-card shadow-travel space-y-6">
                  <div className="space-y-2">
                    <Label>Upload Photos</Label>
                    <label className="flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 cursor-pointer transition-colors">
                      <Camera className="w-10 h-10 text-muted-foreground mb-2" />
                      <p className="font-medium">Click to upload photos</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG up to 10MB each</p>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.url}
                            alt={`Photo ${index + 1}`}
                            className="w-full aspect-square object-cover rounded-xl"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-foreground/80 text-background opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <Input
                            value={photo.caption}
                            onChange={(e) => updatePhotoCaption(index, e.target.value)}
                            placeholder="Caption..."
                            className="mt-2 rounded-lg text-sm"
                          />
                          {index === 0 && (
                            <Badge className="absolute top-2 left-2 gradient-sky text-primary-foreground">
                              Cover
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Summary */}
                  <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                    <h3 className="font-semibold">Trip Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Flights</p>
                        <p className="font-medium">{flights.filter(f => f.departure_airport).length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hotels</p>
                        <p className="font-medium">{hotels.filter(h => h.name).length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days</p>
                        <p className="font-medium">{days.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Cost</p>
                        <p className="font-medium">${calculateTotalCost().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="gradient-sky text-primary-foreground rounded-xl">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createItinerary.isPending}
                className="gradient-sunset text-accent-foreground rounded-xl shadow-accent-glow"
              >
                {createItinerary.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Create Itinerary
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
