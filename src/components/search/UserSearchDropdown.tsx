import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSearchProfiles, SearchProfile } from '@/hooks/useSearchProfiles';
import { cn } from '@/lib/utils';

export function UserSearchDropdown() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isLoading } = useSearchProfiles(query);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (profile: SearchProfile) => {
    navigate(`/profile/${profile.user_id}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    if (query.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const showDropdown = isOpen && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search people..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="pl-10 pr-4 h-10 w-[200px] lg:w-[280px] rounded-xl bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/30"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 bg-card border rounded-xl shadow-lg overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <div className="py-2 max-h-[300px] overflow-y-auto">
                {results.map((profile) => (
                  <motion.button
                    key={profile.id}
                    whileHover={{ backgroundColor: 'hsl(var(--muted))' }}
                    onClick={() => handleSelect(profile)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {profile.display_name?.[0] || profile.username?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {profile.display_name || 'Unknown User'}
                      </p>
                      {profile.username && (
                        <p className="text-xs text-muted-foreground truncate">
                          @{profile.username}
                        </p>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : !isLoading ? (
              <div className="py-8 text-center">
                <User className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No users found</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
