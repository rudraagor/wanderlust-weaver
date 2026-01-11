import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, AlertCircle, Lightbulb, 
  Clock, Sparkles, Map, Loader2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Footer } from '@/components/layout/Footer';
import { TripGenerator } from '@/components/trip/TripGenerator';
import { usePlaceDetails, PlaceToVisit, getPlaceImageUrl } from '@/hooks/usePlaces';

// Import local images as fallback
import santorini from '@/assets/santorini.jpg';
import tokyo from '@/assets/tokyo.jpg';
import machuPicchu from '@/assets/machu-picchu.jpg';
import maldives from '@/assets/maldives.jpg';
import paris from '@/assets/paris.jpg';
import bali from '@/assets/bali.jpg';

const imageMap: Record<string, string> = {
  'santorini': santorini,
  'tokyo': tokyo,
  'machu picchu': machuPicchu,
  'maldives': maldives,
  'paris': paris,
  'bali': bali,
};

export default function PlaceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: place, isLoading, error } = usePlaceDetails(id);
  const [selectedPlaces, setSelectedPlaces] = useState<PlaceToVisit[]>([]);
  const [showTripGenerator, setShowTripGenerator] = useState(false);
  const [isCustomTrip, setIsCustomTrip] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading place details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !place) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Place not found</h1>
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const placeImage = imageMap[place.name.toLowerCase()] || place.image_url || '/placeholder.svg';

  const togglePlaceSelection = (placeToVisit: PlaceToVisit) => {
    setSelectedPlaces(prev => {
      const exists = prev.find(p => p.id === placeToVisit.id);
      if (exists) {
        return prev.filter(p => p.id !== placeToVisit.id);
      }
      return [...prev, placeToVisit];
    });
  };

  const isPlaceSelected = (placeToVisit: PlaceToVisit) => {
    return selectedPlaces.some(p => p.id === placeToVisit.id);
  };

  const handleGenerateDefault = () => {
    setIsCustomTrip(false);
    setShowTripGenerator(true);
  };

  const handleGenerateCustom = () => {
    setIsCustomTrip(true);
    setShowTripGenerator(true);
  };

  return (
    <Layout showFooter={false}>
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={placeImage}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{place.country}</span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                {place.name}
              </h1>
              <p className="text-white/90 text-lg max-w-2xl">
                {place.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Long Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            {place.long_description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Places to Visit with Checkboxes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Places to Visit
                    </span>
                    {selectedPlaces.length > 0 && (
                      <Badge variant="secondary">
                        {selectedPlaces.length} selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {place.places_to_visit.map((placeToVisit, index) => (
                    <div
                      key={placeToVisit.id}
                      className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
                        isPlaceSelected(placeToVisit) 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                      onClick={() => togglePlaceSelection(placeToVisit)}
                    >
                      <Checkbox 
                        id={`place-${placeToVisit.id}`}
                        checked={isPlaceSelected(placeToVisit)}
                        onCheckedChange={() => togglePlaceSelection(placeToVisit)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Label 
                            htmlFor={`place-${placeToVisit.id}`} 
                            className="font-semibold cursor-pointer"
                          >
                            {placeToVisit.name}
                          </Label>
                          {placeToVisit.type && (
                            <Badge variant="outline" className="text-xs">
                              {placeToVisit.type}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {placeToVisit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Major Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Major Events by Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {place.place_events.map((event, index) => (
                      <AccordionItem key={event.id} value={`event-${index}`}>
                        <AccordionTrigger className="text-left">
                          <span className="font-medium">{event.month}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {event.events.map((evt, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                {evt}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rules and Regulations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    Rules and Regulations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {place.place_rules.map((rule, index) => (
                      <li key={rule.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-destructive text-xs font-bold">{index + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{rule.rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Travel Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Travel Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {place.place_tips.map((tip, index) => (
                      <li key={tip.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb className="w-3 h-3 text-yellow-500" />
                        </div>
                        <span className="text-muted-foreground">{tip.tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Best Time to Visit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Best Time to Visit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg gradient-sky text-white">
                    <p className="font-bold text-lg">{place.best_time_period}</p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {place.best_time_description}
                  </p>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-sm">
                      <span className="font-medium">Weather: </span>
                      {place.best_time_weather}
                    </p>
                  </div>

                  {/* Trip Generation Buttons - Side by Side */}
                  <div className="space-y-3 pt-4 border-t">
                    <Link to={`/place/${id}/trips`} className="block">
                      <Button variant="outline" className="w-full" size="lg">
                        <Map className="w-4 h-4 mr-2" />
                        View Existing Trips
                      </Button>
                    </Link>

                    {/* Side by side buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        onClick={handleGenerateDefault}
                        className="gradient-sky text-white" 
                        size="lg"
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Default
                      </Button>

                      <Button 
                        onClick={handleGenerateCustom}
                        className="gradient-sunset text-white" 
                        size="lg"
                        disabled={selectedPlaces.length === 0}
                      >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Custom {selectedPlaces.length > 0 && `(${selectedPlaces.length})`}
                      </Button>
                    </div>

                    {selectedPlaces.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center">
                        Select places above for custom trip
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      <TripGenerator
        open={showTripGenerator}
        onOpenChange={setShowTripGenerator}
        placeName={place.name}
        placeId={place.id}
        selectedPlaces={selectedPlaces.map(p => ({ name: p.name, description: p.description || '', type: p.type || '' }))}
        isCustom={isCustomTrip}
      />
    </Layout>
  );
}
