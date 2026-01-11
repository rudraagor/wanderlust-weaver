import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, Hotel, Camera, Check, CreditCard, 
  ChevronRight, Loader2, PartyPopper
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
  onConfirmBooking?: (data: { flights: string[]; hotels: string[]; activities: string[] }) => Promise<void>;
}

type BookingStep = 'flights' | 'hotels' | 'activities' | 'payment' | 'confirmation' | 'success';

export function BookingDialog({
  open,
  onOpenChange,
  flights,
  hotels,
  activities,
  totalCost,
  destinationName,
  onConfirmBooking,
}: BookingDialogProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('flights');
  const [selectedFlights, setSelectedFlights] = useState<string[]>(flights.map(f => f.id));
  const [selectedHotels, setSelectedHotels] = useState<string[]>(hotels.map(h => h.id));
  const [selectedActivities, setSelectedActivities] = useState<string[]>(activities.map(a => a.id));
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
  });

  const steps: BookingStep[] = ['flights', 'hotels', 'activities', 'payment', 'confirmation', 'success'];
  const stepIndex = steps.indexOf(currentStep);

  const calculateTotal = () => {
    const flightTotal = flights.filter(f => selectedFlights.includes(f.id)).reduce((sum, f) => sum + f.price, 0);
    const hotelTotal = hotels.filter(h => selectedHotels.includes(h.id)).reduce((sum, h) => sum + h.price, 0);
    const activityTotal = activities.filter(a => selectedActivities.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
    return flightTotal + hotelTotal + activityTotal;
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
      setCurrentStep('flights');
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.slice(0, -1).map((step, index) => (
        <div key={step} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              index <= stepIndex 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {index < stepIndex ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          {index < steps.length - 2 && (
            <div className={`w-8 h-0.5 mx-1 ${index < stepIndex ? 'bg-primary' : 'bg-muted'}`} />
          )}
        </div>
      ))}
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
      <div className="space-y-3">
        {flights.map(flight => (
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
            <Badge variant="secondary">${flight.price}</Badge>
          </div>
        ))}
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
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg">Confirm Your Booking</h3>
        <p className="text-sm text-muted-foreground">Review your selections before confirming</p>
      </div>
      
      <div className="space-y-3 p-4 rounded-xl bg-muted/50">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-primary" />
            Flights ({selectedFlights.length})
          </span>
          <span>${flights.filter(f => selectedFlights.includes(f.id)).reduce((sum, f) => sum + f.price, 0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Hotel className="w-4 h-4 text-primary" />
            Hotels ({selectedHotels.length})
          </span>
          <span>${hotels.filter(h => selectedHotels.includes(h.id)).reduce((sum, h) => sum + h.price, 0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            Activities ({selectedActivities.length})
          </span>
          <span>${activities.filter(a => selectedActivities.includes(a.id)).reduce((sum, a) => sum + a.price, 0)}</span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">${calculateTotal().toLocaleString()}</span>
          </div>
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
      <div className="w-20 h-20 rounded-full gradient-sunset mx-auto mb-4 flex items-center justify-center">
        <PartyPopper className="w-10 h-10 text-white" />
      </div>
      <h3 className="font-display font-bold text-2xl mb-2">Booking Confirmed!</h3>
      <p className="text-muted-foreground mb-6">
        Your trip to {destinationName} has been booked successfully.
      </p>
      <div className="p-4 rounded-xl bg-muted/50 mb-6">
        <p className="text-sm text-muted-foreground">Booking Reference</p>
        <p className="font-mono font-bold text-lg">TRV-{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        A confirmation email has been sent to your registered email address.
      </p>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStep === 'success' ? 'Success!' : `Book Trip to ${destinationName}`}
          </DialogTitle>
        </DialogHeader>

        {currentStep !== 'success' && renderStepIndicator()}

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

        {currentStep !== 'success' && (
          <div className="flex gap-3 mt-6">
            {currentStep !== 'flights' && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
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
            ) : (
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
