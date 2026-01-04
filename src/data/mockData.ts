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
  'Italy', 'Spain', 'Thailand', 'Australia', 'USA', 'Mexico'
];

export const activityTypes = [
  'Beach', 'Adventure', 'Culture', 'Food', 'Shopping', 
  'Nature', 'Nightlife', 'Wellness', 'Photography'
];

export const foodPreferences = [
  'Local Cuisine', 'Fine Dining', 'Street Food', 'Vegetarian', 
  'Vegan', 'Seafood', 'International'
];
