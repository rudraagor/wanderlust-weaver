import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Home, Compass, Plane, User, MapPin, LogIn, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUnreadNotificationCount } from '@/hooks/useNotifications';
import { UserSearchDropdown } from '@/components/search/UserSearchDropdown';
import { OnboardingGuide, useOnboarding } from '@/components/onboarding/OnboardingGuide';
const navItems = [{
  path: '/',
  label: 'Home',
  icon: Home
}, {
  path: '/explore',
  label: 'Explore',
  icon: Compass
}, {
  path: '/my-trips',
  label: 'My Trips',
  icon: Plane
}, {
  path: '/profile',
  label: 'Profile',
  icon: User
}];
export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    data: profile
  } = useProfile();
  const {
    data: unreadCount
  } = useUnreadNotificationCount();
  const { showOnboarding, setShowOnboarding } = useOnboarding();
  
  return <>
    <OnboardingGuide open={showOnboarding} onOpenChange={setShowOnboarding} />
    <header className="sticky top-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-sky flex items-center justify-center shadow-travel">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl hidden sm:block text-gradient-sky">
              Velora
            </span>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return <Link key={item.path} to={item.path}>
                  <motion.div whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className={cn("flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200", isActive ? "gradient-sky text-primary-foreground shadow-travel" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </motion.div>
                </Link>;
          })}
          </nav>

          {/* Search Bar */}
          <UserSearchDropdown />

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Help/Guide Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                onClick={() => setShowOnboarding(true)}
                title="Getting Started Guide"
              >
                <HelpCircle className="w-5 h-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
              <Button variant="ghost" size="icon" className="rounded-xl relative" onClick={() => navigate('/notifications')}>
                <Bell className="w-5 h-5" />
                {(unreadCount ?? 0) > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>}
              </Button>
            </motion.div>
            <motion.div whileHover={{
            scale: 1.1
          }} whileTap={{
            scale: 0.9
          }}>
              <Button variant="ghost" size="icon" className="rounded-xl relative" onClick={() => navigate('/chat')}>
                <MessageCircle className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  5
                </span>
              </Button>
            </motion.div>
            
            {/* Auth/Profile Button */}
            {user ? <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                <Link to="/profile">
                  <Avatar className="w-9 h-9 ring-2 ring-primary/20 cursor-pointer">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                      {profile?.display_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </motion.div> : <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate('/auth')}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </motion.div>}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-strong border-t border-border/50 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return <Link key={item.path} to={item.path}>
                <motion.div whileTap={{
              scale: 0.9
            }} className={cn("flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all", isActive ? "text-primary" : "text-muted-foreground")}>
                  <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>;
        })}
        </div>
      </nav>
    </header>
  </>;
}