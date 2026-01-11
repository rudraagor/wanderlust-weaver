import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Calendar, MapPin, Utensils, 
  Star, Activity, Sparkles, ChevronDown, X
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Layout } from '@/components/layout/Layout';
import { countries, activityTypes, foodPreferences } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Budget presets
const budgetPresets = [
  { label: 'Budget', min: 100, max: 1000, description: '$100 - $1,000' },
  { label: 'Mid-Range', min: 1000, max: 5000, description: '$1,000 - $5,000' },
  { label: 'Luxury', min: 5000, max: 15000, description: '$5,000 - $15,000' },
  { label: 'Ultra Luxury', min: 15000, max: 50000, description: '$15,000+' },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const [budgetPreset, setBudgetPreset] = useState<string>('Mid-Range');
  const [customBudget, setCustomBudget] = useState<[number, number]>([1000, 5000]);
  const [useCustomBudget, setUseCustomBudget] = useState(false);
  const [country, setCountry] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [hotelRating, setHotelRating] = useState([3]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<string[]>([]);

  // Today's date for calendar constraints
  const today = useMemo(() => new Date(), []);

  // Get budget values based on preset or custom
  const currentBudget = useMemo(() => {
    if (useCustomBudget) {
      return customBudget;
    }
    const preset = budgetPresets.find(p => p.label === budgetPreset);
    return preset ? [preset.min, preset.max] : [1000, 5000];
  }, [budgetPreset, customBudget, useCustomBudget]);

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
      budget: currentBudget,
      country,
      dateFrom: dateFrom?.toISOString(),
      dateTo: dateTo?.toISOString(),
      hotelRating: hotelRating[0],
      activities: selectedActivities,
      food: selectedFood
    };
    localStorage.setItem('searchFilters', JSON.stringify(filters));
    navigate('/plan/generated');
  };

  // Sorted countries for better UX
  const sortedCountries = useMemo(() => [...countries].sort(), []);

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
                
                {/* Budget Preset Options */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {budgetPresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant={!useCustomBudget && budgetPreset === preset.label ? "default" : "outline"}
                      size="sm"
                      className="h-auto py-2 px-3 flex-col items-start"
                      onClick={() => {
                        setBudgetPreset(preset.label);
                        setUseCustomBudget(false);
                      }}
                    >
                      <span className="font-medium text-xs">{preset.label}</span>
                      <span className="text-[10px] opacity-70">{preset.description}</span>
                    </Button>
                  ))}
                </div>

                {/* Custom Budget Toggle */}
                <div className="mb-4">
                  <Button
                    variant={useCustomBudget ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    onClick={() => setUseCustomBudget(!useCustomBudget)}
                  >
                    Custom Range
                  </Button>
                </div>

                {/* Custom Slider (shown when custom is selected) */}
                {useCustomBudget && (
                  <div className="space-y-3">
                    <Slider
                      value={customBudget}
                      onValueChange={(value) => setCustomBudget(value as [number, number])}
                      min={100}
                      max={50000}
                      step={100}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${customBudget[0].toLocaleString()}</span>
                      <span>${customBudget[1].toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {!useCustomBudget && (
                  <div className="text-center text-sm text-muted-foreground">
                    Selected: ${currentBudget[0].toLocaleString()} - ${currentBudget[1].toLocaleString()}
                  </div>
                )}
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
                  <SelectContent className="max-h-[300px]">
                    {sortedCountries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {country && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-muted-foreground"
                    onClick={() => setCountry('')}
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear selection
                  </Button>
                )}
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
                {/* From Date */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : "Pick start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={(date) => {
                          setDateFrom(date);
                          // Reset dateTo if it's before new dateFrom
                          if (date && dateTo && dateTo <= date) {
                            setDateTo(undefined);
                          }
                        }}
                        disabled={(date) => date < today}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* To Date */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : "Pick end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        disabled={(date) => {
                          // Must be after today and after dateFrom (at least 1 day)
                          const minDate = dateFrom ? addDays(dateFrom, 1) : addDays(today, 1);
                          return date < minDate;
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              {/* Date Range Summary */}
              {dateFrom && dateTo && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  Trip duration: {Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              )}
            </motion.div>

            {/* Activities - Dropdown Menu */}
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
              
              {/* Dropdown for Activities */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between rounded-xl">
                    <span>
                      {selectedActivities.length === 0 
                        ? 'Select activities' 
                        : `${selectedActivities.length} selected`}
                    </span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 max-h-80 overflow-y-auto">
                  {activityTypes.map((activity) => (
                    <DropdownMenuCheckboxItem
                      key={activity}
                      checked={selectedActivities.includes(activity)}
                      onCheckedChange={() => toggleActivity(activity)}
                    >
                      {activity}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Selected Activities Tags */}
              {selectedActivities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedActivities.map((activity) => (
                    <Badge
                      key={activity}
                      variant="default"
                      className="cursor-pointer gradient-sky text-primary-foreground px-3 py-1"
                      onClick={() => toggleActivity(activity)}
                    >
                      {activity}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
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
