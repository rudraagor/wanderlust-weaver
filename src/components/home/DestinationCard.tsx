import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { Destination } from '@/types/travel';

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export function DestinationCard({ destination, index }: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={`/plan/${destination.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-card shadow-travel hover:shadow-travel-lg transition-all duration-300">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <img 
              src={destination.image} 
              alt={destination.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
            
            {/* Rating Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-card/90 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-sm font-semibold">{destination.rating}</span>
            </div>

            {/* Budget Badge */}
            <Badge 
              variant="secondary" 
              className={`absolute top-3 left-3 capitalize ${
                destination.budget === 'luxury' 
                  ? 'bg-accent text-accent-foreground' 
                  : destination.budget === 'mid-range'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {destination.budget}
            </Badge>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display font-bold text-xl text-primary-foreground mb-1">
                {destination.name}
              </h3>
              <div className="flex items-center gap-1 text-primary-foreground/80 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{destination.country}</span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {destination.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{destination.duration}</span>
              </div>
              
              <div className="flex gap-1.5">
                {destination.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
