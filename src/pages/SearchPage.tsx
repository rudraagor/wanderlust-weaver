import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Calendar, MapPin, Utensils, ShoppingBag, 
  Star, Activity, Search, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { countries, activityTypes, foodPreferences } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState([1000, 5000]);
  const [country, setCountry] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [hotelRating, setHotelRating] = useState([3]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleFood = (food: string) => {
    setSelectedFood(prev => 
      prev.includes(food) 
        ? prev.filter(f => f !== food)
        : [...prev, food]
    );
  };

  const handleGeneratePlan = () => {
    // Save filters to localStorage and navigate to generated plan
    const filters = {
      budget,
      country,
      dateFrom,
      dateTo,
      hotelRating: hotelRating[0],
      activities: selectedActivities,
      food: selectedFood
    };
    localStorage.setItem('searchFilters', JSON.stringify(filters));
    navigate('/plan/generated');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Smart Trip Planner</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">
              Find Your Perfect Trip
            </h1>
            <p className="text-muted-foreground">
              Tell us your preferences and we'll create a personalized travel plan
            </p>
          </div>

          {/* Filters Grid */}
          <div className="space-y-8">
            {/* Budget & Country Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-card shadow-travel"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <Label className="text-lg font-semibold">Budget Range</Label>
                </div>
                <Slider
                  value={budget}
                  onValueChange={setBudget}
                  min={100}
                  max={20000}
                  step={100}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${budget[0].toLocaleString()}</span>
                  <span>${budget[1].toLocaleString()}</span>
                </div>
              </motion.div>

              {/* Country */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-card shadow-travel"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <Label className="text-lg font-semibold">Destination</Label>
                </div>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            {/* Dates */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card shadow-travel"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary-foreground" />
                </div>
                <Label className="text-lg font-semibold">Travel Dates</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">From</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">To</Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </motion.div>

            {/* Activities */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-card shadow-travel"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary-foreground" />
                </div>
                <Label className="text-lg font-semibold">Activities</Label>
              </div>
              <div className="flex flex-wrap gap-2">
                {activityTypes.map((activity) => (
                  <Badge
                    key={activity}
                    variant={selectedActivities.includes(activity) ? "default" : "outline"}
                    className={`cursor-pointer transition-all px-4 py-2 rounded-xl ${
                      selectedActivities.includes(activity) 
                        ? 'gradient-sky text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => toggleActivity(activity)}
                  >
                    {activity}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Food & Hotel Rating Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Food */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-card shadow-travel"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <Label className="text-lg font-semibold">Food Preferences</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {foodPreferences.map((food) => (
                    <Badge
                      key={food}
                      variant={selectedFood.includes(food) ? "default" : "outline"}
                      className={`cursor-pointer transition-all px-3 py-1.5 rounded-lg ${
                        selectedFood.includes(food) 
                          ? 'gradient-sunset text-accent-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => toggleFood(food)}
                    >
                      {food}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              {/* Hotel Rating */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-card shadow-travel"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Star className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <Label className="text-lg font-semibold">Min Hotel Rating</Label>
                </div>
                <Slider
                  value={hotelRating}
                  onValueChange={setHotelRating}
                  min={1}
                  max={5}
                  step={1}
                  className="mb-4"
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= hotelRating[0] 
                          ? 'fill-accent text-accent' 
                          : 'text-muted'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {hotelRating[0]}+ stars
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center pt-4"
            >
              <Button 
                size="lg" 
                onClick={handleGeneratePlan}
                className="gradient-sky text-primary-foreground shadow-travel hover:shadow-travel-lg transition-all rounded-xl px-12 py-6 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate My Trip
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
