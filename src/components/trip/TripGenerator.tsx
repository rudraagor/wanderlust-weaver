import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Map, Check, Loader2, Calendar, 
  ArrowRight, Info, LogIn
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateItinerary } from '@/hooks/useItineraries';
import { toast } from 'sonner';

interface SelectedPlace {
  name: string;
  description: string;
  type: string;
}

interface TripGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeName: string;
  placeId: string;
  placeCountry?: string;
  placeImage?: string;
  selectedPlaces: SelectedPlace[];
  isCustom: boolean;
}

export function TripGenerator({
  open,
  onOpenChange,
  placeName,
  placeId,
  placeCountry,
  placeImage,
  selectedPlaces,
  isCustom,
}: TripGeneratorProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createItinerary = useCreateItinerary();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [createdItineraryId, setCreatedItineraryId] = useState<string | null>(null);

  const nights = isCustom ? Math.max(3, selectedPlaces.length) : 5;

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please sign in to create an itinerary');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate days with activities based on selected places
      const days = [];
      
      if (isCustom && selectedPlaces.length > 0) {
        // Distribute selected places across days
        const placesPerDay = Math.ceil(selectedPlaces.length / nights);
        for (let i = 0; i < nights; i++) {
          const dayPlaces = selectedPlaces.slice(i * placesPerDay, (i + 1) * placesPerDay);
          days.push({
            day_number: i + 1,
            activities: dayPlaces.map((place, idx) => ({
              name: place.name,
              description: place.description,
              category: place.type || 'Attraction',
              time: idx === 0 ? '09:00' : idx === 1 ? '14:00' : '18:00',
              duration: '2-3 hours',
            })),
          });
        }
      } else {
        // Default itinerary - create placeholder days
        for (let i = 0; i < nights; i++) {
          days.push({
            day_number: i + 1,
            activities: [
              {
                name: `Day ${i + 1} Exploration`,
                description: `Explore the highlights of ${placeName}`,
                category: 'Sightseeing',
                time: '09:00',
                duration: 'Full day',
              },
            ],
          });
        }
      }

      // Create the itinerary in the database
      const itinerary = await createItinerary.mutateAsync({
        title: isCustom 
          ? `Custom ${placeName} Adventure` 
          : `${placeName} Explorer Trip`,
        destination: placeName,
        country: placeCountry,
        cover_image: placeImage,
        nights: nights,
        is_public: true,
        is_ai_generated: true,
        place_id: placeId,
        days: days,
      });

      setCreatedItineraryId(itinerary.id);
      setIsGenerating(false);
      setIsGenerated(true);
      toast.success('Itinerary created successfully!');
    } catch (error) {
      console.error('Error creating itinerary:', error);
      toast.error('Failed to create itinerary. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleViewTrip = () => {
    onOpenChange(false);
    if (createdItineraryId) {
      navigate(`/itinerary/${createdItineraryId}`);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(false);
      setCreatedItineraryId(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Custom Trip Generator
          </DialogTitle>
          <DialogDescription>
            Generate a personalized itinerary based on your {selectedPlaces.length} selected places
          </DialogDescription>
        </DialogHeader>

        {/* Not logged in state */}
        {!user && !isGenerating && !isGenerated && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Sign in Required</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Please sign in to create and save your itinerary.
            </p>
            <Link to="/auth">
              <Button className="gradient-sky text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        )}

        {user && !isGenerating && !isGenerated && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-2 mb-3">
                <Map className="w-4 h-4 text-primary" />
                <span className="font-medium">Trip Overview</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-muted-foreground">Destination</p>
                  <p className="font-medium">{placeName}</p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{nights} Days</p>
                </div>
              </div>
            </div>

            {selectedPlaces.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Selected Places ({selectedPlaces.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedPlaces.map((place, index) => (
                    <Badge key={index} variant="secondary">
                      {place.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleGenerate} className="w-full gradient-sky text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Itinerary
            </Button>
          </div>
        )}

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="w-16 h-16 rounded-full gradient-sky mx-auto mb-4 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Generating Your Trip...</h3>
            <p className="text-muted-foreground text-sm">
              Creating a personalized itinerary just for you
            </p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                ✓ Analyzing attractions...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                ✓ Optimizing route...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                ✓ Saving to your account...
              </motion.p>
            </div>
          </motion.div>
        )}

        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto mb-4 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Itinerary Generated!</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Your custom trip to {placeName} is ready to view.
            </p>
            
            <div className="p-4 rounded-xl bg-muted/50 mb-6 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{placeName} Adventure</p>
                  <p className="text-sm text-muted-foreground">
                    {nights} Days • {selectedPlaces.length || nights} Activities
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={handleViewTrip} className="w-full gradient-sunset text-white">
              View Your Trip
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}