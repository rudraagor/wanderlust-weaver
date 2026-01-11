import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, Map, Check, Loader2, Calendar, 
  ArrowRight, Info
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
import { PlaceToVisit } from '@/data/placeDetails';

interface TripGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placeName: string;
  placeId: string;
  selectedPlaces: PlaceToVisit[];
  isCustom: boolean;
}

export function TripGenerator({
  open,
  onOpenChange,
  placeName,
  placeId,
  selectedPlaces,
  isCustom,
}: TripGeneratorProps) {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsGenerating(false);
    setIsGenerated(true);
  };

  const handleViewTrip = () => {
    onOpenChange(false);
    // Navigate to the generated trip with state
    navigate(`/plan/generated`, { 
      state: { 
        placeId, 
        placeName, 
        selectedPlaces: isCustom ? selectedPlaces : null,
        isCustom 
      } 
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {isCustom ? 'Custom Trip Generator' : 'Default Trip Generator'}
          </DialogTitle>
          <DialogDescription>
            {isCustom 
              ? `Generate a personalized itinerary based on your ${selectedPlaces.length} selected places`
              : `Generate a curated itinerary for ${placeName}`
            }
          </DialogDescription>
        </DialogHeader>

        {!isGenerating && !isGenerated && (
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
                  <p className="font-medium">{isCustom ? `${Math.max(3, selectedPlaces.length)} Days` : '5 Days'}</p>
                </div>
              </div>
            </div>

            {isCustom && selectedPlaces.length > 0 && (
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

            {!isCustom && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">Default Itinerary</p>
                    <p className="text-muted-foreground">
                      This will generate a curated 5-day itinerary covering the most popular 
                      attractions in {placeName}, including accommodations and activity recommendations.
                    </p>
                  </div>
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
                ✓ Finding best accommodations...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                ✓ Finalizing itinerary...
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
              Your {isCustom ? 'custom' : 'curated'} trip to {placeName} is ready to view.
            </p>
            
            <div className="p-4 rounded-xl bg-muted/50 mb-6 text-left">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{placeName} Adventure</p>
                  <p className="text-sm text-muted-foreground">
                    {isCustom ? `${Math.max(3, selectedPlaces.length)} Days` : '5 Days'} • {isCustom ? selectedPlaces.length : 5} Activities
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
