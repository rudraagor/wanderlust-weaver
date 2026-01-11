import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plane, Hotel, Calendar, Eye, EyeOff, 
  Loader2, MapPin, DollarSign, Trash2, Receipt, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useBookedTrips, useToggleTripPrivacy, useDeleteBookedTrip } from '@/hooks/useBookedTrips';
import { useExpenses } from '@/hooks/useExpenses';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { TripExpenses } from '@/components/trip/TripExpenses';

export default function MyTripsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: trips, isLoading } = useBookedTrips();
  const togglePrivacy = useToggleTripPrivacy();
  const deleteTrip = useDeleteBookedTrip();
  const [expandedExpenses, setExpandedExpenses] = useState<string[]>([]);

  const toggleExpenses = (tripId: string) => {
    setExpandedExpenses(prev => 
      prev.includes(tripId) ? prev.filter(id => id !== tripId) : [...prev, tripId]
    );
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-2xl">My Trips</h1>
              <p className="text-sm text-muted-foreground">
                {trips?.length || 0} booked trips
              </p>
            </div>
          </motion.div>

          {/* Trips List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : trips?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Plane className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl font-semibold mb-2">No trips booked yet</p>
              <p className="text-muted-foreground mb-4">
                Explore itineraries and book your first trip!
              </p>
              <Button
                onClick={() => navigate('/explore')}
                className="gradient-sky text-primary-foreground rounded-xl"
              >
                Explore Itineraries
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {trips?.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card shadow-travel"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {trip.itinerary?.cover_image ? (
                        <img
                          src={trip.itinerary.cover_image}
                          alt={trip.itinerary.title}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl gradient-sky flex items-center justify-center">
                          <Plane className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {trip.itinerary?.title || 'Untitled Trip'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {trip.itinerary?.destination}, {trip.itinerary?.country}
                        </div>
                        {trip.itinerary?.start_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {format(new Date(trip.itinerary.start_date), 'MMM d')} - 
                            {trip.itinerary?.end_date && format(new Date(trip.itinerary.end_date), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={trip.booking_status === 'booked' ? 'default' : 'secondary'}>
                        {trip.booking_status}
                      </Badge>
                      {trip.booking_reference && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Booking Ref</p>
                          <p className="font-mono text-sm font-semibold text-primary">{trip.booking_reference}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Status */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${trip.flights_booked ? 'bg-primary/10' : 'bg-muted/50'}`}>
                      <Plane className={`w-5 h-5 mb-1 ${trip.flights_booked ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-sm font-medium">Flights</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.flights_booked ? 'Booked' : 'Not booked'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${trip.hotels_booked ? 'bg-primary/10' : 'bg-muted/50'}`}>
                      <Hotel className={`w-5 h-5 mb-1 ${trip.hotels_booked ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-sm font-medium">Hotels</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.hotels_booked ? 'Booked' : 'Not booked'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${trip.activities_booked ? 'bg-accent/10' : 'bg-muted/50'}`}>
                      <Calendar className={`w-5 h-5 mb-1 ${trip.activities_booked ? 'text-accent' : 'text-muted-foreground'}`} />
                      <p className="text-sm font-medium">Activities</p>
                      <p className="text-xs text-muted-foreground">
                        {trip.activities_booked ? 'Booked' : 'Not booked'}
                      </p>
                    </div>
                  </div>

                  {/* Trip Expenses */}
                  <TripExpenses bookedTripId={trip.id} />

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      {trip.is_private ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-sm">
                        {trip.is_private ? 'Private' : 'Public'}
                      </span>
                      <Switch
                        checked={!trip.is_private}
                        onCheckedChange={(checked) => 
                          togglePrivacy.mutateAsync({ id: trip.id, isPrivate: !checked })
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/plan/${trip.itinerary_id}`)}
                        className="rounded-xl"
                      >
                        View Details
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-xl text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel this trip?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the trip from your booked trips. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Trip</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteTrip.mutateAsync(trip.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Cancel Trip
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
