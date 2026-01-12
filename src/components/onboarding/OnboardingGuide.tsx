import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Search, User, Compass, Plane, 
  BookOpen, ChevronRight, ChevronLeft, Check, Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface OnboardingGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  {
    id: 1,
    title: 'Welcome to Wanderly!',
    description: 'Your personal travel companion for planning unforgettable trips around the world.',
    icon: MapPin,
    color: 'from-primary to-accent',
    tips: [
      'Discover amazing destinations',
      'Create personalized itineraries',
      'Connect with fellow travelers',
    ],
  },
  {
    id: 2,
    title: 'Plan Your Trip',
    description: 'Use our smart search to find the perfect destination based on your preferences.',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    tips: [
      'Set your budget and travel dates',
      'Choose activities you love',
      'Get AI-powered recommendations',
    ],
  },
  {
    id: 3,
    title: 'Explore Itineraries',
    description: 'Browse trips created by our community or generate your own custom plans.',
    icon: Compass,
    color: 'from-green-500 to-emerald-500',
    tips: [
      'Like and save favorite itineraries',
      'Get inspiration from other travelers',
      'Filter by destination or budget',
    ],
  },
  {
    id: 4,
    title: 'Book & Travel',
    description: 'Book your flights, hotels, and activities all in one place.',
    icon: Plane,
    color: 'from-orange-500 to-amber-500',
    tips: [
      'Track your expenses',
      'Access your trip details anytime',
      'Share your adventures',
    ],
  },
  {
    id: 5,
    title: 'Build Your Profile',
    description: 'Connect with travelers, share your experiences, and inspire others.',
    icon: User,
    color: 'from-purple-500 to-pink-500',
    tips: [
      'Follow other travelers',
      'Post photos from your trips',
      'Build your travel community',
    ],
  },
];

export function OnboardingGuide({ open, onOpenChange }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    onOpenChange(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_complete', 'true');
    onOpenChange(false);
    setCurrentStep(0);
  };

  const step = steps[currentStep];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative">
          {/* Progress indicator */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all duration-300',
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Skip button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 text-muted-foreground"
            onClick={handleSkip}
          >
            Skip
          </Button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              {/* Icon Section */}
              <div className="flex justify-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className={cn(
                    'w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                    step.color
                  )}
                >
                  <step.icon className="w-12 h-12 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-2xl font-bold mb-3"
                >
                  {step.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground mb-6"
                >
                  {step.description}
                </motion.p>

                {/* Tips */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-3 text-left mb-8"
                >
                  {step.tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className={cn('w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center', step.color)}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm">{tip}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="rounded-xl"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentStep + 1} of {steps.length}
                  </span>
                  <Button
                    onClick={handleNext}
                    className="rounded-xl gradient-sky"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        Get Started
                        <Sparkles className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook to check and show onboarding
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_complete');
    if (!completed) {
      // Small delay to avoid showing immediately on page load
      const timer = setTimeout(() => setShowOnboarding(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  return {
    showOnboarding,
    setShowOnboarding,
    resetOnboarding: () => {
      localStorage.removeItem('onboarding_complete');
      setShowOnboarding(true);
    },
  };
}
