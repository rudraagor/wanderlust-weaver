import { ExternalLink, Plane, Hotel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ExternalBookingLinksProps {
  departureCity: string;
  destinationCity: string;
  departureDate?: string;
  returnDate?: string;
  hotelName?: string;
  type: 'flights' | 'hotels' | 'both';
}

const flightPartners = [
  { name: 'Skyscanner', url: 'https://www.skyscanner.com', logo: '✈️' },
  { name: 'Google Flights', url: 'https://www.google.com/flights', logo: '🔍' },
  { name: 'Kayak', url: 'https://www.kayak.com', logo: '🛫' },
  { name: 'Expedia', url: 'https://www.expedia.com/Flights', logo: '🌐' },
];

const hotelPartners = [
  { name: 'Booking.com', url: 'https://www.booking.com', logo: '🏨' },
  { name: 'Hotels.com', url: 'https://www.hotels.com', logo: '🛏️' },
  { name: 'Expedia', url: 'https://www.expedia.com/Hotels', logo: '🌐' },
  { name: 'Agoda', url: 'https://www.agoda.com', logo: '🏠' },
];

export function ExternalBookingLinks({
  departureCity,
  destinationCity,
  departureDate,
  returnDate,
  hotelName,
  type,
}: ExternalBookingLinksProps) {
  const buildFlightUrl = (partnerUrl: string) => {
    const params = new URLSearchParams();
    if (departureDate) params.set('outboundDate', departureDate);
    if (returnDate) params.set('inboundDate', returnDate);
    // Most sites use query params for search
    return `${partnerUrl}?from=${encodeURIComponent(departureCity)}&to=${encodeURIComponent(destinationCity)}&${params.toString()}`;
  };

  const buildHotelUrl = (partnerUrl: string) => {
    const params = new URLSearchParams();
    if (departureDate) params.set('checkin', departureDate);
    if (returnDate) params.set('checkout', returnDate);
    return `${partnerUrl}?destination=${encodeURIComponent(destinationCity)}&${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      {(type === 'flights' || type === 'both') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-sky flex items-center justify-center">
              <Plane className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Book Flights</h4>
              <p className="text-xs text-muted-foreground">Compare prices on partner sites</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {flightPartners.map((partner) => (
              <a
                key={partner.name}
                href={buildFlightUrl(partner.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <span className="text-lg">{partner.logo}</span>
                <span className="text-sm font-medium flex-1">{partner.name}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {(type === 'hotels' || type === 'both') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-sunset flex items-center justify-center">
              <Hotel className="w-4 h-4 text-accent-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Book Hotels</h4>
              <p className="text-xs text-muted-foreground">Find the best rates</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {hotelPartners.map((partner) => (
              <a
                key={partner.name}
                href={buildHotelUrl(partner.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
              >
                <span className="text-lg">{partner.logo}</span>
                <span className="text-sm font-medium flex-1">{partner.name}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
        <div className="flex items-start gap-2">
          <Badge variant="outline" className="text-xs mt-0.5">Tip</Badge>
          <p className="text-xs text-muted-foreground">
            Compare prices across multiple sites to find the best deals. Prices may vary based on availability and time of booking.
          </p>
        </div>
      </div>
    </div>
  );
}
