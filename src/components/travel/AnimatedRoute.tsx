import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Hotel, MapPin, Home } from 'lucide-react';

interface RouteStop {
  id: string;
  name: string;
  type: 'origin' | 'flight' | 'hotel' | 'destination' | 'activity';
  icon: 'plane' | 'hotel' | 'pin' | 'home';
}

interface AnimatedRouteProps {
  stops: RouteStop[];
}

const iconMap = {
  plane: Plane,
  hotel: Hotel,
  pin: MapPin,
  home: Home,
};

export function AnimatedRoute({ stops }: AnimatedRouteProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= stops.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [stops.length, isAnimating]);

  return (
    <div className="p-6 rounded-2xl bg-card shadow-travel">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-bold text-xl">Your Journey Route</h2>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="text-sm text-primary hover:underline"
        >
          {isAnimating ? 'Pause' : 'Play'}
        </button>
      </div>

      {/* Route visualization */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-sky"
            initial={{ width: '0%' }}
            animate={{ width: `${(activeIndex / (stops.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Stops */}
        <div className="relative flex justify-between">
          {stops.map((stop, index) => {
            const Icon = iconMap[stop.icon];
            const isPast = index < activeIndex;
            const isActive = index === activeIndex;
            const isFuture = index > activeIndex;

            return (
              <div key={stop.id} className="flex flex-col items-center relative z-10">
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    y: isActive ? -4 : 0,
                  }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-colors duration-300
                    ${isPast ? 'gradient-sky text-primary-foreground' : ''}
                    ${isActive ? 'gradient-sunset text-accent-foreground shadow-accent-glow' : ''}
                    ${isFuture ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Animated plane between stops */}
                {isActive && index < stops.length - 1 && (
                  <motion.div
                    className="absolute top-6 left-full"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ 
                      x: [0, 40, 80],
                      opacity: [1, 1, 0],
                    }}
                    transition={{ 
                      duration: 1.8,
                      ease: 'easeInOut',
                      repeat: Infinity,
                    }}
                  >
                    <Plane className="w-4 h-4 text-primary rotate-0" />
                  </motion.div>
                )}

                <motion.p
                  animate={{ opacity: isActive ? 1 : 0.6 }}
                  className={`
                    mt-3 text-xs font-medium text-center max-w-[80px] truncate
                    ${isActive ? 'text-foreground' : 'text-muted-foreground'}
                  `}
                >
                  {stop.name}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current location info */}
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 p-4 rounded-xl bg-muted/50 text-center"
      >
        <p className="text-sm text-muted-foreground">Currently at</p>
        <p className="font-display font-bold text-lg">{stops[activeIndex]?.name}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Stop {activeIndex + 1} of {stops.length}
        </p>
      </motion.div>
    </div>
  );
}
