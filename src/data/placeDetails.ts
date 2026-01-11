import santorini from '@/assets/santorini.jpg';
import tokyo from '@/assets/tokyo.jpg';
import machuPicchu from '@/assets/machu-picchu.jpg';
import maldives from '@/assets/maldives.jpg';
import paris from '@/assets/paris.jpg';
import bali from '@/assets/bali.jpg';

export interface PlaceToVisit {
  name: string;
  description: string;
  type: string;
}

export interface MonthlyEvent {
  month: string;
  events: string[];
}

export interface PlaceDetails {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  longDescription: string;
  placesToVisit: PlaceToVisit[];
  bestTimeToVisit: {
    period: string;
    description: string;
    weather: string;
  };
  majorEvents: MonthlyEvent[];
  rulesAndRegulations: string[];
  travelTips: string[];
}

export const placeDetails: PlaceDetails[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    image: santorini,
    description: 'Experience the iconic white-washed buildings and stunning sunsets over the Aegean Sea.',
    longDescription: 'Santorini is a volcanic island in the Cyclades group of the Greek islands. It is famous for its dramatic views, stunning sunsets from Oia town, white-washed buildings with blue domes, and its very own active volcano. The island offers a unique blend of natural beauty, ancient history, and vibrant culture.',
    placesToVisit: [
      { name: 'Oia Village', description: 'Famous for its sunset views and blue-domed churches', type: 'Village' },
      { name: 'Fira Town', description: 'The vibrant capital with shops, restaurants, and nightlife', type: 'Town' },
      { name: 'Red Beach', description: 'Unique beach with red volcanic cliffs', type: 'Beach' },
      { name: 'Ancient Akrotiri', description: 'Prehistoric Minoan settlement preserved under volcanic ash', type: 'Historical' },
      { name: 'Nea Kameni', description: 'Active volcanic crater accessible by boat tour', type: 'Nature' },
    ],
    bestTimeToVisit: {
      period: 'April to October',
      description: 'The best time to visit Santorini is during spring (April-May) and fall (September-October) when the weather is pleasant and crowds are smaller.',
      weather: 'Expect temperatures between 20-28°C with minimal rainfall.'
    },
    majorEvents: [
      { month: 'April', events: ['Greek Orthodox Easter celebrations'] },
      { month: 'July', events: ['Ifestia Festival - volcanic re-enactment'] },
      { month: 'August', events: ['Santorini Jazz Festival', 'Feast of the Assumption'] },
      { month: 'September', events: ['International Music Festival'] },
    ],
    rulesAndRegulations: [
      'Respect religious sites - dress modestly when visiting churches',
      'Do not climb on ruins at archaeological sites',
      'Swimming is prohibited in certain volcanic areas',
      'Drone usage requires special permits',
      'Littering carries heavy fines - keep beaches clean',
    ],
    travelTips: [
      'Book accommodations early, especially for sunset-view hotels in Oia',
      'Rent an ATV or car to explore the island at your own pace',
      'Carry cash as some small shops don\'t accept cards',
      'Wear comfortable shoes - the streets are made of marble and can be slippery',
      'Try local wines from the volcanic vineyards',
    ],
  },
  {
    id: '2',
    name: 'Tokyo',
    country: 'Japan',
    image: tokyo,
    description: 'Explore the perfect blend of ancient traditions and cutting-edge technology.',
    longDescription: 'Tokyo is Japan\'s bustling capital that seamlessly blends ultramodern architecture with traditional temples. From neon-lit skyscrapers to serene gardens, this metropolis offers endless discoveries. Experience world-class cuisine, cutting-edge technology, and centuries-old culture all in one incredible city.',
    placesToVisit: [
      { name: 'Senso-ji Temple', description: 'Ancient Buddhist temple in Asakusa', type: 'Temple' },
      { name: 'Shibuya Crossing', description: 'World\'s busiest pedestrian crossing', type: 'Landmark' },
      { name: 'Tokyo Skytree', description: '634m broadcasting tower with observation decks', type: 'Observation' },
      { name: 'Meiji Shrine', description: 'Shinto shrine surrounded by forest', type: 'Shrine' },
      { name: 'Tsukiji Outer Market', description: 'Famous fish market with fresh sushi', type: 'Market' },
    ],
    bestTimeToVisit: {
      period: 'March to May, September to November',
      description: 'Spring offers cherry blossoms while autumn brings colorful foliage. Both seasons have mild weather perfect for exploring.',
      weather: 'Temperatures range from 15-25°C with occasional rainfall.'
    },
    majorEvents: [
      { month: 'March-April', events: ['Cherry Blossom Season (Hanami)'] },
      { month: 'May', events: ['Sanja Matsuri Festival'] },
      { month: 'July', events: ['Sumida River Fireworks Festival'] },
      { month: 'November', events: ['Shichi-Go-San Festival', 'Autumn Leaves Season'] },
    ],
    rulesAndRegulations: [
      'No eating or drinking while walking on streets',
      'Keep quiet on public transportation',
      'Remove shoes before entering homes and some restaurants',
      'Tipping is not customary and can be considered rude',
      'Smoking is only allowed in designated areas',
    ],
    travelTips: [
      'Get a Suica or Pasmo card for convenient public transit',
      'Learn basic Japanese phrases - it\'s appreciated',
      'Visit convenience stores for affordable, quality meals',
      'Book popular restaurants in advance',
      'Carry cash - many places don\'t accept credit cards',
    ],
  },
  {
    id: '3',
    name: 'Machu Picchu',
    country: 'Peru',
    image: machuPicchu,
    description: 'Discover the ancient Incan citadel set high in the Andes Mountains.',
    longDescription: 'Machu Picchu is a 15th-century Incan citadel perched high in the Andes Mountains. This UNESCO World Heritage site is one of the New Seven Wonders of the World, offering breathtaking views and a glimpse into the sophisticated Incan civilization that once thrived here.',
    placesToVisit: [
      { name: 'Sun Gate (Inti Punku)', description: 'Ancient entrance with panoramic views', type: 'Historical' },
      { name: 'Temple of the Sun', description: 'Sacred temple with precise stonework', type: 'Temple' },
      { name: 'Huayna Picchu', description: 'Steep mountain with ruins at the summit', type: 'Hiking' },
      { name: 'Intihuatana Stone', description: 'Ritual stone associated with astronomy', type: 'Historical' },
      { name: 'Sacred Valley', description: 'Valley with Incan ruins and villages', type: 'Nature' },
    ],
    bestTimeToVisit: {
      period: 'April to October',
      description: 'The dry season offers clear skies and better hiking conditions. May and September are ideal with fewer crowds.',
      weather: 'Daytime temperatures around 20°C, cooler at night.'
    },
    majorEvents: [
      { month: 'June', events: ['Inti Raymi (Festival of the Sun)'] },
      { month: 'July', events: ['Peru Independence Day celebrations'] },
      { month: 'August', events: ['Pachamama Day'] },
    ],
    rulesAndRegulations: [
      'Book tickets in advance - daily visitor limits apply',
      'Hire a licensed guide for the citadel',
      'No drones allowed without special permits',
      'Stay on marked paths - do not climb on ruins',
      'No food or drinks inside the archaeological site',
    ],
    travelTips: [
      'Acclimatize in Cusco for 2-3 days before visiting',
      'Bring layers - weather changes quickly',
      'Start early to avoid crowds and heat',
      'Carry your passport - required for entry',
      'Book Huayna Picchu or Machu Picchu Mountain months ahead',
    ],
  },
  {
    id: '4',
    name: 'Maldives',
    country: 'Maldives',
    image: maldives,
    description: 'Escape to paradise with crystal-clear waters and overwater bungalows.',
    longDescription: 'The Maldives is a tropical paradise consisting of 26 atolls in the Indian Ocean. Known for its pristine white-sand beaches, crystal-clear turquoise waters, and luxurious overwater villas, it\'s the ultimate destination for romance, relaxation, and world-class diving.',
    placesToVisit: [
      { name: 'Male City', description: 'Compact capital with colorful buildings', type: 'City' },
      { name: 'Banana Reef', description: 'Famous diving spot with vibrant marine life', type: 'Diving' },
      { name: 'Vaadhoo Island', description: 'Famous for bioluminescent beaches', type: 'Beach' },
      { name: 'Maafushi Island', description: 'Budget-friendly local island experience', type: 'Island' },
      { name: 'Hulhumale Beach', description: 'Man-made island with beautiful beaches', type: 'Beach' },
    ],
    bestTimeToVisit: {
      period: 'November to April',
      description: 'The dry season (northeast monsoon) offers sunny skies, calm seas, and excellent visibility for diving and snorkeling.',
      weather: 'Temperatures around 27-30°C year-round.'
    },
    majorEvents: [
      { month: 'July', events: ['Independence Day celebrations'] },
      { month: 'November', events: ['Republic Day', 'Victory Day'] },
      { month: 'Variable', events: ['Eid celebrations (dates vary)'] },
    ],
    rulesAndRegulations: [
      'Alcohol is only permitted at resort islands',
      'Bikinis allowed only at resorts, not on local islands',
      'Import of alcohol and pork products is prohibited',
      'Respect Islamic customs and dress modestly in Male',
      'No coral or shell collection allowed',
    ],
    travelTips: [
      'Book an overwater villa for the quintessential experience',
      'Bring reef-safe sunscreen to protect marine life',
      'Consider island hopping to experience different resorts',
      'Book a sunset dolphin cruise',
      'Pack light, breathable clothing and good sun protection',
    ],
  },
  {
    id: '5',
    name: 'Paris',
    country: 'France',
    image: paris,
    description: 'Fall in love with the City of Light, from the Eiffel Tower to charming cafés.',
    longDescription: 'Paris, the City of Light, is a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond landmarks like the Eiffel Tower and Gothic Notre-Dame, the city is known for its cafe culture and designer boutiques.',
    placesToVisit: [
      { name: 'Eiffel Tower', description: 'Iconic iron lattice tower and symbol of Paris', type: 'Landmark' },
      { name: 'Louvre Museum', description: 'World\'s largest art museum', type: 'Museum' },
      { name: 'Notre-Dame Cathedral', description: 'Medieval Gothic cathedral (under restoration)', type: 'Historical' },
      { name: 'Montmartre', description: 'Artistic hilltop neighborhood with Sacré-Cœur', type: 'Neighborhood' },
      { name: 'Champs-Élysées', description: 'Famous avenue with shops and Arc de Triomphe', type: 'Street' },
    ],
    bestTimeToVisit: {
      period: 'April to June, September to November',
      description: 'Spring and fall offer pleasant weather, beautiful scenery, and fewer tourists than peak summer months.',
      weather: 'Temperatures range from 12-22°C with occasional rain.'
    },
    majorEvents: [
      { month: 'February', events: ['Paris Fashion Week (Womenswear)'] },
      { month: 'June', events: ['Fête de la Musique', 'Paris Jazz Festival'] },
      { month: 'July', events: ['Bastille Day (July 14)', 'Tour de France finish'] },
      { month: 'October', events: ['Nuit Blanche art festival'] },
    ],
    rulesAndRegulations: [
      'Smoking is prohibited in enclosed public spaces',
      'Metro tickets must be kept until you exit',
      'Photography may be restricted in some museums',
      'Respect quiet hours in residential areas',
      'Jaywalking can result in fines',
    ],
    travelTips: [
      'Buy a Paris Museum Pass for multiple attractions',
      'Learn basic French phrases - locals appreciate the effort',
      'Book Eiffel Tower tickets online to skip lines',
      'Explore neighborhoods on foot or by bike',
      'Try croissants from local boulangeries, not tourist spots',
    ],
  },
  {
    id: '6',
    name: 'Bali',
    country: 'Indonesia',
    image: bali,
    description: 'Find your zen among rice terraces, temples, and pristine beaches.',
    longDescription: 'Bali, known as the Island of the Gods, is a Indonesian paradise famous for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple and is known for its vibrant arts scene and wellness retreats.',
    placesToVisit: [
      { name: 'Ubud', description: 'Cultural heart with temples, rice terraces, and art galleries', type: 'Town' },
      { name: 'Tanah Lot Temple', description: 'Iconic sea temple on a rock formation', type: 'Temple' },
      { name: 'Tegallalang Rice Terraces', description: 'Beautiful terraced rice paddies', type: 'Nature' },
      { name: 'Uluwatu Temple', description: 'Cliffside temple with Kecak dance performances', type: 'Temple' },
      { name: 'Seminyak Beach', description: 'Trendy beach with beach clubs and restaurants', type: 'Beach' },
    ],
    bestTimeToVisit: {
      period: 'April to October',
      description: 'The dry season offers sunny days, lower humidity, and ideal conditions for beach activities and temple visits.',
      weather: 'Temperatures around 27-30°C with minimal rainfall.'
    },
    majorEvents: [
      { month: 'March', events: ['Nyepi (Day of Silence)', 'Ogoh-Ogoh parades'] },
      { month: 'April', events: ['Bali Spirit Festival'] },
      { month: 'June', events: ['Bali Arts Festival begins'] },
      { month: 'August', events: ['Indonesian Independence Day'] },
    ],
    rulesAndRegulations: [
      'Dress modestly when visiting temples (sarong required)',
      'Don\'t touch offerings placed on streets and temples',
      'No climbing on sacred trees or structures',
      'Respect Nyepi - no travel or activities during this day',
      'Bargaining is expected at markets but be respectful',
    ],
    travelTips: [
      'Rent a scooter for easy exploration (international license needed)',
      'Stay in Ubud for culture, Seminyak for beaches and nightlife',
      'Book sunrise hike at Mount Batur in advance',
      'Carry small bills for temple donations and offerings',
      'Visit temples early morning to avoid crowds and heat',
    ],
  },
];

export function getPlaceById(id: string): PlaceDetails | undefined {
  return placeDetails.find(place => place.id === id);
}

export function getPlaceByName(name: string): PlaceDetails | undefined {
  return placeDetails.find(place => place.name.toLowerCase() === name.toLowerCase());
}
