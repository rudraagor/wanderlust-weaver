import { motion } from 'framer-motion';
import { Plane, MapPin, Sparkles, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
export function HeroSection() {
  return <section className="relative overflow-hidden gradient-hero py-20 md:py-28">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0]
      }} transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }} className="absolute top-20 right-10 md:right-20">
          <Plane className="w-12 h-12 text-primary/20" />
        </motion.div>
        <motion.div animate={{
        y: [0, 15, 0]
      }} transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }} className="absolute bottom-20 left-10 md:left-20">
          <MapPin className="w-8 h-8 text-accent/30" />
        </motion.div>
        <motion.div animate={{
        y: [0, -10, 0],
        x: [0, 10, 0]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }} className="absolute top-1/3 left-1/4">
          <Globe className="w-6 h-6 text-primary/15" />
        </motion.div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            
          </motion.div>

          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Plan Your Perfect Trip,{' '}
            <span className="text-primary">Effortlessly</span>
          </motion.h1>

          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover breathtaking destinations, create personalized itineraries, 
            and connect with a community of passionate travelers. From dream to reality, 
            we make travel planning simple and inspiring.
          </motion.p>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/search">
              <Button size="lg" className="gradient-sky text-primary-foreground shadow-travel hover:shadow-travel-lg transition-all rounded-xl px-8">
                Start Planning
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="rounded-xl px-8">
                Explore Destinations
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="flex items-center justify-center gap-8 md:gap-12 mt-12 pt-8 border-t border-border/50">
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-3xl text-primary">100+</p>
              <p className="text-sm text-muted-foreground">Destinations</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-3xl text-primary">50K+</p>
              <p className="text-sm text-muted-foreground">Travelers</p>
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-2xl md:text-3xl text-primary">10K+</p>
              <p className="text-sm text-muted-foreground">Itineraries</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
}