import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, Hotel, Camera, Check, CreditCard, 
  ChevronRight, Loader2, PartyPopper, ExternalLink
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ExternalBookingLinks } from './ExternalBookingLinks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BookingItem {
  id: string;
  name: string;
  price: number;
  details?: string;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flights: BookingItem[];
  hotels: BookingItem[];
  activities: BookingItem[];
  totalCost: number;
  destinationName: string;
  departureCity?: string;
  departureDate?: string;
  returnDate?: string;
  onConfirmBooking?: (data: { 
    flights: string[]; 
    hotels: string[]; 
    activities: string[];
    flightClass: string;
    plannedBudget: number;
  }) => Promise<void>;
}

type BookingStep = 'method' | 'flights' | 'hotels' | 'activities' | 'payment' | 'confirmation' | 'success';

const flightClasses = [
  { value: 'economy', label: 'Economy', multiplier: 1, description: 'Best value' },
  { value: 'business', label: 'Business', multiplier: 2.5, description: 'Extra comfort' },
  { value: 'first', label: 'First Class', multiplier: 4, description: 'Ultimate luxury' },
];

export function BookingDialog({
  open,
  onOpenChange,
  flights,
  hotels,
  activities,
  totalCost,
  destinationName,
  departureCity = 'Your City',
  departureDate,
  returnDate,
  onConfirmBooking,
}: BookingDialogProps) {
  const [bookingMethod, setBookingMethod] = useState<'inapp' | 'partner'>('inapp');
  const [currentStep, setCurrentStep] = useState<BookingStep>('method');
  const [selectedFlights, setSelectedFlights] = useState<string[]>(flights.map(f => f.id));
  const [selectedHotels, setSelectedHotels] = useState<string[]>(hotels.map(h => h.id));
  const [selectedActivities, setSelectedActivities] = useState<string[]>(activities.map(a => a.id));
  const [selectedFlightClass, setSelectedFlightClass] = useState('economy');
  const [plannedBudget, setPlannedBudget] = useState<string>(totalCost.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const steps: BookingStep[] = ['method', 'flights', 'hotels', 'activities', 'payment', 'confirmation', 'success'];
  const stepIndex = steps.indexOf(currentStep);

  const classMultiplier = flightClasses.find(c => c.value === selectedFlightClass)?.multiplier || 1;

  const calculateTotal = () => {
    const flightTotal = flights.filter(f => selectedFlights.includes(f.id)).reduce((sum, f) => sum + (f.price * classMultiplier), 0);
    const hotelTotal = hotels.filter(h => selectedHotels.includes(h.id)).reduce((sum, h) => sum + h.price, 0);
    const activityTotal = activities.filter(a => selectedActivities.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
    return Math.round(flightTotal + hotelTotal + activityTotal);
  };

  const handleNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      if (onConfirmBooking) {
        await onConfirmBooking({
          flights: selectedFlights,
          hotels: selectedHotels,
          activities: selectedActivities,
          flightClass: selectedFlightClass,
          plannedBudget: parseFloat(plannedBudget) || calculateTotal(),
        });
      }
      setCurrentStep('success');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after closing
    setTimeout(() => {
      setCurrentStep('method');
      setBookingMethod('inapp');
      setIsProcessing(false);
    }, 300);
  };

  const toggleItem = (
    id: string, 
    selected: string[], 
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const renderStepIndicator = () => {
    if (bookingMethod === 'partner') return null;
    const displaySteps = steps.filter(s => s !== 'method' && s !== 'success');
    const adjustedIndex = stepIndex - 1;
    
    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {displaySteps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index <= adjustedIndex 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < adjustedIndex ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            {index < displaySteps.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${index < adjustedIndex ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMethodStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg mb-2">How would you like to book?</h3>
        <p className="text-sm text-muted-foreground">Choose your preferred booking method</p>
      </div>
      
      <Tabs value={bookingMethod} onValueChange={(v) => setBookingMethod(v as 'inapp' | 'partner')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="inapp">Book Here</TabsTrigger>
          <TabsTrigger value="partner">Partner Sites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inapp" className="space-y-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg gradient-sky flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Complete Booking</h4>
                <p className="text-sm text-muted-foreground">
                  Book flights, hotels, and activities all in one place. Manage everything from your dashboard.
                </p>
              </div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> All-in-one booking
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Expense tracking included
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" /> Easy cancellation
            </li>
          </ul>
        </TabsContent>
        
        <TabsContent value="partner" className="space-y-4">
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg gradient-sunset flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Compare & Book</h4>
                <p className="text-sm text-muted-foreground">
                  Find the best prices across multiple booking platforms. Links open in new tabs.
                </p>
              </div>
            </div>
          </div>
          <ExternalBookingLinks
            departureCity={departureCity}
            destinationCity={destinationName}
            departureDate={departureDate}
            returnDate={returnDate}
            type="both"
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderFlightsStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center">
          <Plane className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Select Flights</h3>
          <p className="text-sm text-muted-foreground">Choose flights to include in your booking</p>
        </div>
      </div>
      
      {/* Flight Class Selection */}
      <div className="p-4 rounded-xl bg-muted/30 mb-4">
        <Label className="text-sm font-medium mb-3 block">Select Flight Class</Label>
        <RadioGroup
          value={selectedFlightClass}
          onValueChange={setSelectedFlightClass}
          className="grid grid-cols-3 gap-2"
        >
          {flightClasses.map((flightClass) => (
            <div key={flightClass.value}>
              <RadioGroupItem
                value={flightClass.value}
                id={flightClass.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={flightClass.value}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
              >
                <span className="font-semibold text-sm">{flightClass.label}</span>
                <span className="text-xs text-muted-foreground">{flightClass.description}</span>
                {flightClass.multiplier > 1 && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {flightClass.multiplier}x price
                  </Badge>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        {flights.map(flight => {
          const adjustedPrice = Math.round(flight.price * classMultiplier);
          return (
            <div 
              key={flight.id}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Checkbox 
                  id={`flight-${flight.id}`}
                  checked={selectedFlights.includes(flight.id)}
                  onCheckedChange={() => toggleItem(flight.id, selectedFlights, setSelectedFlights)}
                />
                <Label htmlFor={`flight-${flight.id}`} className="cursor-pointer">
                  <p className="font-medium">{flight.name}</p>
                  {flight.details && <p className="text-sm text-muted-foreground">{flight.details}</p>}
                </Label>
              </div>
              <div className="text-right">
                <Badge variant="secondary">${adjustedPrice}</Badge>
                {classMultiplier > 1 && (
                  <p className="text-xs text-muted-foreground line-through mt-1">${flight.price}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderHotelsStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-sunset flex items-center justify-center">
          <Hotel className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Select Hotels</h3>
          <p className="text-sm text-muted-foreground">Choose accommodations for your stay</p>
        </div>
      </div>
      <div className="space-y-3">
        {hotels.map(hotel => (
          <div 
            key={hotel.id}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Checkbox 
                id={`hotel-${hotel.id}`}
                checked={selectedHotels.includes(hotel.id)}
                onCheckedChange={() => toggleItem(hotel.id, selectedHotels, setSelectedHotels)}
              />
              <Label htmlFor={`hotel-${hotel.id}`} className="cursor-pointer">
                <p className="font-medium">{hotel.name}</p>
                {hotel.details && <p className="text-sm text-muted-foreground">{hotel.details}</p>}
              </Label>
            </div>
            <Badge variant="secondary">${hotel.price}</Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivitiesStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Camera className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Select Activities</h3>
          <p className="text-sm text-muted-foreground">Choose activities to add to your trip</p>
        </div>
      </div>
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {activities.map(activity => (
          <div 
            key={activity.id}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Checkbox 
                id={`activity-${activity.id}`}
                checked={selectedActivities.includes(activity.id)}
                onCheckedChange={() => toggleItem(activity.id, selectedActivities, setSelectedActivities)}
              />
              <Label htmlFor={`activity-${activity.id}`} className="cursor-pointer">
                <p className="font-medium">{activity.name}</p>
                {activity.details && <p className="text-sm text-muted-foreground">{activity.details}</p>}
              </Label>
            </div>
            <Badge variant="secondary">${activity.price}</Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-green-500" />
        </div>
        <div>
          <h3 className="font-semibold">Payment Details</h3>
          <p className="text-sm text-muted-foreground">Enter your payment information</p>
        </div>
      </div>
      
      {/* Trip Budget Setting */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-4">
        <Label htmlFor="budget" className="text-sm font-medium">Set Trip Budget (for alerts)</Label>
        <p className="text-xs text-muted-foreground mb-2">We'll notify you when expenses approach this limit</p>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-muted-foreground">$</span>
          <Input
            id="budget"
            type="number"
            placeholder={calculateTotal().toString()}
            value={plannedBudget}
            onChange={(e) => setPlannedBudget(e.target.value)}
            className="text-lg font-semibold"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input
            id="cardName"
            placeholder="John Doe"
            value={paymentDetails.name}
            onChange={(e) => setPaymentDetails(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="4242 4242 4242 4242"
            value={paymentDetails.cardNumber}
            onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={paymentDetails.expiryDate}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              type="password"
              value={paymentDetails.cvv}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Review Your Booking</h3>
        <p className="text-sm text-muted-foreground">Make sure everything looks good</p>
      </div>
      
      <div className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
        {selectedFlights.length > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-sky flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-medium">Flights ({flightClasses.find(c => c.value === selectedFlightClass)?.label})</p>
                <p className="text-xs text-muted-foreground">{selectedFlights.length} selected</p>
              </div>
            </span>
            <span className="font-semibold">${Math.round(flights.filter(f => selectedFlights.includes(f.id)).reduce((sum, f) => sum + (f.price * classMultiplier), 0)).toLocaleString()}</span>
          </div>
        )}
        {selectedHotels.length > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-sunset flex items-center justify-center">
                <Hotel className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">Hotels</p>
                <p className="text-xs text-muted-foreground">{selectedHotels.length} selected</p>
              </div>
            </span>
            <span className="font-semibold">${hotels.filter(h => selectedHotels.includes(h.id)).reduce((sum, h) => sum + h.price, 0).toLocaleString()}</span>
          </div>
        )}
        {selectedActivities.length > 0 && (
          <div className="flex justify-between items-center py-2">
            <span className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Camera className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Activities</p>
                <p className="text-xs text-muted-foreground">{selectedActivities.length} selected</p>
              </div>
            </span>
            <span className="font-semibold">${activities.filter(a => selectedActivities.includes(a.id)).reduce((sum, a) => sum + a.price, 0).toLocaleString()}</span>
          </div>
        )}
        <div className="border-t border-border/50 pt-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Total Amount</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${calculateTotal().toLocaleString()}
            </span>
          </div>
          {plannedBudget && parseFloat(plannedBudget) > 0 && (
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Trip Budget</span>
              <span>${parseFloat(plannedBudget).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 mx-auto mb-6 flex items-center justify-center shadow-lg">
        <PartyPopper className="w-12 h-12 text-white" />
      </div>
      <h3 className="font-display font-bold text-2xl mb-2">Booking Confirmed!</h3>
      <p className="text-muted-foreground mb-6">
        Your trip to {destinationName} has been booked successfully.
      </p>
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 mb-6">
        <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
        <p className="font-mono font-bold text-2xl text-primary tracking-wider">
          WDR-{Math.random().toString(36).substring(2, 10).toUpperCase()}
        </p>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>✓ Confirmation email sent</p>
        <p>✓ View your trip in My Trips</p>
        <p>✓ Budget alerts enabled</p>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'method':
        return renderMethodStep();
      case 'flights':
        return renderFlightsStep();
      case 'hotels':
        return renderHotelsStep();
      case 'activities':
        return renderActivitiesStep();
      case 'payment':
        return renderPaymentStep();
      case 'confirmation':
        return renderConfirmationStep();
      case 'success':
        return renderSuccessStep();
    }
  };

  const showNavigation = currentStep !== 'success' && 
    !(currentStep === 'method' && bookingMethod === 'partner');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStep === 'success' ? 'Success!' : `Book Trip to ${destinationName}`}
          </DialogTitle>
        </DialogHeader>

        {currentStep !== 'success' && currentStep !== 'method' && bookingMethod === 'inapp' && renderStepIndicator()}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {showNavigation && (
          <div className="flex gap-3 mt-6">
            {currentStep !== 'method' && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            {currentStep === 'method' && bookingMethod === 'inapp' && (
              <Button onClick={handleNext} className="flex-1">
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {currentStep === 'confirmation' ? (
              <Button 
                onClick={handleConfirmBooking} 
                className="flex-1 gradient-sunset text-white"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Confirm & Pay ${calculateTotal().toLocaleString()}</>
                )}
              </Button>
            ) : currentStep !== 'method' && (
              <Button onClick={handleNext} className="flex-1">
                Continue
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        )}

        {currentStep === 'success' && (
          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
