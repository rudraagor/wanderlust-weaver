import santorini from '@/assets/santorini.jpg';
import tokyo from '@/assets/tokyo.jpg';
import machuPicchu from '@/assets/machu-picchu.jpg';
import maldives from '@/assets/maldives.jpg';
import paris from '@/assets/paris.jpg';
import bali from '@/assets/bali.jpg';
import type { Destination, ExplorePost, UserProfile } from '@/types/travel';

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    image: santorini,
    rating: 4.9,
    budget: 'luxury',
    tags: ['Beach', 'Romance', 'Culture'],
    duration: '5-7 days',
    description: 'Experience the iconic white-washed buildings and stunning sunsets over the Aegean Sea.'
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    image: tokyo,
    rating: 4.8,
    budget: 'mid-range',
    tags: ['City', 'Culture', 'Food'],
    duration: '7-10 days',
    description: 'Explore the perfect blend of ancient traditions and cutting-edge technology.'
  },
  {
    id: '3',
    name: 'Machu Picchu',
    country: 'Peru',
    image: machuPicchu,
    rating: 4.9,
    budget: 'mid-range',
    tags: ['Adventure', 'History', 'Nature'],
    duration: '4-5 days',
    description: 'Discover the ancient Incan citadel set high in the Andes Mountains.'
  },
  {
    id: '4',
    name: 'Maldives',
    country: 'Maldives',
    image: maldives,
    rating: 5.0,
    budget: 'luxury',
    tags: ['Beach', 'Relaxation', 'Romance'],
    duration: '5-7 days',
    description: 'Escape to paradise with crystal-clear waters and overwater bungalows.'
  },
  {
    id: '5',
    name: 'Paris',
    country: 'France',
    image: paris,
    rating: 4.7,
    budget: 'mid-range',
    tags: ['City', 'Romance', 'Art'],
    duration: '4-6 days',
    description: 'Fall in love with the City of Light, from the Eiffel Tower to charming cafés.'
  },
  {
    id: '6',
    name: 'Bali',
    country: 'Indonesia',
    image: bali,
    rating: 4.8,
    budget: 'budget',
    tags: ['Beach', 'Culture', 'Nature'],
    duration: '7-10 days',
    description: 'Find your zen among rice terraces, temples, and pristine beaches.'
  },
  {
    id: '7',
    name: 'Dubai',
    country: 'United Arab Emirates',
    image: santorini,
    rating: 4.7,
    budget: 'luxury',
    tags: ['City', 'Shopping', 'Adventure'],
    duration: '4-6 days',
    description: 'Experience futuristic architecture, luxury shopping, and desert adventures.'
  },
  {
    id: '8',
    name: 'Barcelona',
    country: 'Spain',
    image: paris,
    rating: 4.8,
    budget: 'mid-range',
    tags: ['City', 'Beach', 'Art'],
    duration: '4-6 days',
    description: 'Discover Gaudí masterpieces, vibrant nightlife, and Mediterranean beaches.'
  },
  {
    id: '9',
    name: 'Kyoto',
    country: 'Japan',
    image: tokyo,
    rating: 4.9,
    budget: 'mid-range',
    tags: ['Culture', 'History', 'Nature'],
    duration: '4-5 days',
    description: 'Step back in time with ancient temples, geisha districts, and zen gardens.'
  },
  {
    id: '10',
    name: 'Iceland',
    country: 'Iceland',
    image: maldives,
    rating: 4.8,
    budget: 'mid-range',
    tags: ['Nature', 'Adventure', 'Wildlife'],
    duration: '7-10 days',
    description: 'Witness the Northern Lights, geysers, and dramatic volcanic landscapes.'
  },
  {
    id: '11',
    name: 'Sydney',
    country: 'Australia',
    image: bali,
    rating: 4.7,
    budget: 'mid-range',
    tags: ['City', 'Beach', 'Culture'],
    duration: '5-7 days',
    description: 'Explore the iconic Opera House, Harbour Bridge, and stunning beaches.'
  },
  {
    id: '12',
    name: 'New York',
    country: 'USA',
    image: paris,
    rating: 4.8,
    budget: 'mid-range',
    tags: ['City', 'Culture', 'Shopping'],
    duration: '5-7 days',
    description: 'The city that never sleeps - Times Square, Central Park, and world-class dining.'
  },
  {
    id: '13',
    name: 'Cappadocia',
    country: 'Turkey',
    image: machuPicchu,
    rating: 4.9,
    budget: 'mid-range',
    tags: ['Adventure', 'History', 'Nature'],
    duration: '3-4 days',
    description: 'Float over fairy chimneys in a hot air balloon at sunrise.'
  },
  {
    id: '14',
    name: 'Marrakech',
    country: 'Morocco',
    image: santorini,
    rating: 4.6,
    budget: 'budget',
    tags: ['Culture', 'Shopping', 'Food'],
    duration: '4-5 days',
    description: 'Get lost in the vibrant souks, riads, and rich Moroccan culture.'
  },
  {
    id: '15',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image: machuPicchu,
    rating: 4.9,
    budget: 'luxury',
    tags: ['Nature', 'Adventure', 'Relaxation'],
    duration: '5-7 days',
    description: 'Ski pristine slopes, hike alpine trails, and enjoy chocolate and cheese.'
  },
  {
    id: '16',
    name: 'Amalfi Coast',
    country: 'Italy',
    image: santorini,
    rating: 4.8,
    budget: 'luxury',
    tags: ['Beach', 'Romance', 'Food'],
    duration: '5-7 days',
    description: 'Drive the dramatic coastline and enjoy Italian cuisine with sea views.'
  }
];

export const explorePosts: ExplorePost[] = [
  {
    id: '1',
    type: 'photo',
    media: santorini,
    caption: 'Golden hour in Santorini is absolutely magical ✨ #Greece #Travel',
    likes: 2453,
    comments: 89,
    location: 'Santorini, Greece',
    createdAt: '2024-01-10',
    user: {
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      username: '@sarahexplores'
    }
  },
  {
    id: '2',
    type: 'photo',
    media: tokyo,
    caption: 'Cherry blossoms and neon lights - Tokyo has it all! 🌸',
    likes: 1876,
    comments: 56,
    location: 'Tokyo, Japan',
    createdAt: '2024-01-08',
    user: {
      name: 'Mike Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      username: '@mikewanders'
    }
  },
  {
    id: '3',
    type: 'photo',
    media: machuPicchu,
    caption: 'Reaching new heights at Machu Picchu 🏔️ Worth every step!',
    likes: 3201,
    comments: 124,
    location: 'Machu Picchu, Peru',
    createdAt: '2024-01-05',
    user: {
      name: 'Elena Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
      username: '@elenaadventures'
    }
  },
  {
    id: '4',
    type: 'photo',
    media: maldives,
    caption: 'Paradise found 🌊 Living my best life in the Maldives',
    likes: 4521,
    comments: 167,
    location: 'Maldives',
    createdAt: '2024-01-03',
    user: {
      name: 'James Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
      username: '@jamesontour'
    }
  }
];

export const currentUser: UserProfile = {
  id: 'current',
  name: 'Alex Morgan',
  username: '@alexmorgan',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
  bio: '✈️ Wanderlust soul | 25 countries & counting | Sharing my adventures one photo at a time 📸',
  followers: 12500,
  following: 890,
  trips: 34,
  stories: [
    { id: '1', image: paris, title: 'Paris' },
    { id: '2', image: bali, title: 'Bali' },
    { id: '3', image: tokyo, title: 'Tokyo' }
  ],
  posts: [
    {
      id: '1',
      type: 'photo',
      media: paris,
      caption: 'Paris will always have a piece of my heart ❤️',
      likes: 1234,
      comments: 45,
      location: 'Paris, France',
      createdAt: '2024-01-12'
    },
    {
      id: '2',
      type: 'photo',
      media: bali,
      caption: 'Rice terraces and good vibes 🌿',
      likes: 987,
      comments: 32,
      location: 'Ubud, Bali',
      createdAt: '2024-01-08'
    }
  ],
  externalLinks: [
    { label: 'Blog', url: 'https://alexmorgan.travel' },
    { label: 'YouTube', url: 'https://youtube.com/@alexmorgan' }
  ]
};

export const countries = [
  'Greece', 'Japan', 'Peru', 'Maldives', 'France', 'Indonesia', 
  'Italy', 'Spain', 'Thailand', 'Australia', 'USA', 'Mexico',
  'United Kingdom', 'Germany', 'Switzerland', 'Portugal', 'Turkey',
  'Egypt', 'Morocco', 'South Africa', 'Kenya', 'Tanzania',
  'India', 'Nepal', 'Vietnam', 'Cambodia', 'Philippines', 'Malaysia', 'Singapore',
  'New Zealand', 'Fiji', 'Canada', 'Brazil', 'Argentina', 'Chile', 'Colombia',
  'Costa Rica', 'Iceland', 'Norway', 'Sweden', 'Finland', 'Denmark',
  'Netherlands', 'Belgium', 'Austria', 'Czech Republic', 'Croatia', 'Ireland',
  'United Arab Emirates', 'Qatar', 'Oman', 'Jordan', 'Israel',
  'South Korea', 'Taiwan', 'Hong Kong', 'Macau', 'Sri Lanka', 'Bhutan',
  'Cuba', 'Jamaica', 'Dominican Republic', 'Bahamas', 'Puerto Rico',
  'Monaco', 'Luxembourg', 'Malta', 'Cyprus', 'Slovenia'
];

// Source cities for departure
export const sourceCities = [
  'New York (JFK)', 'Los Angeles (LAX)', 'Chicago (ORD)', 'San Francisco (SFO)', 
  'Miami (MIA)', 'Dallas (DFW)', 'Houston (IAH)', 'Seattle (SEA)', 'Boston (BOS)',
  'Atlanta (ATL)', 'Denver (DEN)', 'Washington DC (IAD)', 'Phoenix (PHX)',
  'London (LHR)', 'Paris (CDG)', 'Dubai (DXB)', 'Singapore (SIN)', 'Hong Kong (HKG)',
  'Tokyo (NRT)', 'Sydney (SYD)', 'Toronto (YYZ)', 'Mumbai (BOM)', 'Delhi (DEL)',
  'Frankfurt (FRA)', 'Amsterdam (AMS)', 'Madrid (MAD)', 'Rome (FCO)', 'Bangkok (BKK)'
];

export const activityTypes = [
  'Beach & Water Sports', 
  'Adventure & Hiking', 
  'Culture & History', 
  'Food & Culinary Tours', 
  'Shopping & Markets', 
  'Nature & Wildlife', 
  'Nightlife & Entertainment', 
  'Wellness & Spa', 
  'Photography Tours',
  'Museums & Art Galleries',
  'Religious & Spiritual Sites',
  'Sports & Recreation',
  'Family Activities',
  'Romantic Experiences',
  'Festivals & Events',
  'Local Experiences',
  'Boat Tours & Cruises',
  'City Tours',
  'Mountain & Skiing',
  'Desert Safaris'
];

export const foodPreferences = [
  'Local Cuisine', 'Fine Dining', 'Street Food', 'Vegetarian', 
  'Vegan', 'Seafood', 'International', 'Halal', 'Kosher',
  'Farm-to-Table', 'Food Markets', 'Cooking Classes'
];
