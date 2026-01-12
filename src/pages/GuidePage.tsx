import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Search, Compass, Plane, User, 
  ChevronRight, Check, Sparkles, ArrowLeft, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const guideSteps = [
  {
    id: 1,
    title: 'Welcome to Wanderly',
    description: 'Your personal travel companion for planning unforgettable trips around the world.',
    icon: MapPin,
    color: 'from-primary to-accent',
    details: [
      'Discover amazing destinations across the globe',
      'Create personalized travel itineraries',
      'Connect with fellow travelers and share experiences',
      'Get AI-powered recommendations based on your preferences',
    ],
  },
  {
    id: 2,
    title: 'Plan Your Trip',
    description: 'Use our smart search to find the perfect destination.',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    details: [
      'Set your budget range from economy to luxury',
      'Choose your travel dates and duration',
      'Select activities you love (adventure, culture, relaxation)',
      'Pick food preferences and hotel ratings',
    ],
  },
  {
    id: 3,
    title: 'Explore Itineraries',
    description: 'Browse trips created by our community.',
    icon: Compass,
    color: 'from-green-500 to-emerald-500',
    details: [
      'Like and save your favorite itineraries',
      'Get inspiration from experienced travelers',
      'Filter by destination, budget, or trip type',
      'View detailed day-by-day plans',
    ],
  },
  {
    id: 4,
    title: 'Book & Travel',
    description: 'Book flights, hotels, and activities in one place.',
    icon: Plane,
    color: 'from-orange-500 to-amber-500',
    details: [
      'Compare prices across multiple providers',
      'Track all your trip expenses',
      'Access your booking details anytime',
      'Get notifications for trip updates',
    ],
  },
  {
    id: 5,
    title: 'Build Your Profile',
    description: 'Connect and share your travel experiences.',
    icon: User,
    color: 'from-purple-500 to-pink-500',
    details: [
      'Follow other travelers and build your network',
      'Post photos and stories from your adventures',
      'Share your itineraries with the community',
      'Track your travel history and statistics',
    ],
  },
];

export default function GuidePage() {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold">Getting Started Guide</h1>
            <p className="text-muted-foreground">Learn how to make the most of Wanderly</p>
          </div>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="mb-8 overflow-hidden border-0 shadow-lg">
            <div className="gradient-sky p-8 text-primary-foreground">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Welcome, Traveler!</h2>
                  <p className="text-primary-foreground/80">Follow these steps to start your journey</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="secondary" 
                  className="rounded-xl"
                  onClick={() => navigate('/search')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Start Planning
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-xl bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
                  onClick={() => navigate('/explore')}
                >
                  <Compass className="w-4 h-4 mr-2" />
                  Explore Trips
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid gap-4">
          {guideSteps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  expandedStep === step.id && "ring-2 ring-primary/50"
                )}
                onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                      step.color
                    )}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Step {step.id}</span>
                      </div>
                      <h3 className="font-display font-semibold text-lg">{step.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{step.description}</p>
                    </div>
                    <ChevronRight className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      expandedStep === step.id && "rotate-90"
                    )} />
                  </div>
                  
                  {expandedStep === step.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t"
                    >
                      <div className="p-4 space-y-3">
                        {step.details.map((detail, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className={cn("w-5 h-5 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 mt-0.5", step.color)}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm">{detail}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Card className="border-2 border-dashed border-primary/30">
            <CardContent className="py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="font-display text-xl font-bold mb-2">Ready to Start?</h3>
              <p className="text-muted-foreground mb-4">
                Create your first itinerary and begin your adventure!
              </p>
              <Button className="rounded-xl gradient-sky" onClick={() => navigate('/search')}>
                <Search className="w-4 h-4 mr-2" />
                Plan My Trip
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </Layout>
  );
}
