export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  budget: 'budget' | 'mid-range' | 'luxury';
  tags: string[];
  duration: string;
  description: string;
}

export interface TravelPlan {
  id: string;
  destination: Destination;
  startDate: string;
  endDate: string;
  flights: Flight[];
  hotels: Hotel[];
  activities: Activity[];
}

export interface Flight {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  price: number;
}

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  image: string;
  amenities: string[];
}

export interface Activity {
  id: string;
  name: string;
  time: string;
  duration: string;
  price: number;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  trips: number;
  stories: Story[];
  posts: Post[];
  externalLinks: { label: string; url: string }[];
}

export interface Story {
  id: string;
  image: string;
  title: string;
}

export interface Post {
  id: string;
  type: 'photo' | 'video';
  media: string;
  caption: string;
  likes: number;
  comments: number;
  location: string;
  createdAt: string;
}

export interface ExplorePost extends Post {
  user: {
    name: string;
    avatar: string;
    username: string;
  };
}

export interface SearchFilters {
  budget: string;
  dateFrom: string;
  dateTo: string;
  country: string;
  activities: string[];
  foodPreferences: string[];
  hotelRating: number;
}
