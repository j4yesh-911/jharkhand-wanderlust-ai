export interface Destination {
  id: string;
  name: string;
  category: 'waterfall' | 'heritage' | 'culture' | 'adventure' | 'nature';
  description: string;
  image: string;
  location: string;
  rating: number;
  reviews: number;
  highlights: string[];
  bestTime: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  price: {
    min: number;
    max: number;
  };
}

export const destinations: Destination[] = [
  {
    id: 'hundru-falls',
    name: 'Hundru Falls',
    category: 'waterfall',
    description: 'A spectacular 98-meter waterfall cascading down rocky terrain, offering breathtaking views and adventure activities.',
    image: '/src/assets/waterfall-destination.jpg',
    location: 'Ranchi, Jharkhand',
    rating: 4.7,
    reviews: 324,
    highlights: ['98m High Waterfall', 'Adventure Sports', 'Photography', 'Trekking'],
    bestTime: 'July to December',
    duration: '4-6 hours',
    difficulty: 'Moderate',
    price: { min: 500, max: 1500 }
  },
  {
    id: 'jagannath-temple',
    name: 'Jagannath Temple',
    category: 'heritage',
    description: 'Ancient temple complex showcasing magnificent architecture and deep spiritual significance in Jharkhand\'s cultural landscape.',
    image: '/src/assets/heritage-site.jpg',
    location: 'Ranchi, Jharkhand',
    rating: 4.5,
    reviews: 567,
    highlights: ['Ancient Architecture', 'Spiritual Experience', 'Cultural Heritage', 'Festivals'],
    bestTime: 'October to March',
    duration: '2-3 hours',
    difficulty: 'Easy',
    price: { min: 0, max: 300 }
  },
  {
    id: 'betla-national-park',
    name: 'Betla National Park',
    category: 'nature',
    description: 'Rich biodiversity with tigers, elephants, and diverse flora. Perfect for wildlife enthusiasts and nature photographers.',
    image: '/src/assets/waterfall-destination.jpg',
    location: 'Palamu, Jharkhand',
    rating: 4.6,
    reviews: 289,
    highlights: ['Wildlife Safari', 'Tiger Reserve', 'Elephant Sightings', 'Bird Watching'],
    bestTime: 'November to April',
    duration: 'Full Day',
    difficulty: 'Easy',
    price: { min: 800, max: 2500 }
  },
  {
    id: 'tribal-village-tour',
    name: 'Tribal Village Experience',
    category: 'culture',
    description: 'Immersive cultural experience with indigenous tribes, traditional dance, art, and authentic local cuisine.',
    image: '/src/assets/heritage-site.jpg',
    location: 'Various Villages, Jharkhand',
    rating: 4.8,
    reviews: 156,
    highlights: ['Traditional Dance', 'Local Cuisine', 'Handicrafts', 'Cultural Immersion'],
    bestTime: 'Year Round',
    duration: '2-3 days',
    difficulty: 'Easy',
    price: { min: 2000, max: 5000 }
  },
  {
    id: 'dassam-falls',
    name: 'Dassam Falls',
    category: 'waterfall',
    description: 'Mesmerizing waterfall surrounded by dense forests, ideal for picnics and nature walks.',
    image: '/src/assets/waterfall-destination.jpg',
    location: 'Taimara, Jharkhand',
    rating: 4.4,
    reviews: 423,
    highlights: ['Scenic Beauty', 'Picnic Spot', 'Photography', 'Nature Walks'],
    bestTime: 'June to January',
    duration: '3-4 hours',
    difficulty: 'Easy',
    price: { min: 300, max: 800 }
  },
  {
    id: 'parasnath-hill',
    name: 'Parasnath Hill',
    category: 'adventure',
    description: 'Highest peak in Jharkhand offering challenging treks, spiritual significance, and panoramic views.',
    image: '/src/assets/heritage-site.jpg',
    location: 'Giridih, Jharkhand',
    rating: 4.9,
    reviews: 234,
    highlights: ['Highest Peak', 'Trekking', 'Spiritual Site', 'Panoramic Views'],
    bestTime: 'October to March',
    duration: '6-8 hours',
    difficulty: 'Challenging',
    price: { min: 1000, max: 3000 }
  }
];

export const categories = [
  { id: 'all', name: 'All Destinations', icon: '🌍' },
  { id: 'waterfall', name: 'Waterfalls', icon: '💧' },
  { id: 'heritage', name: 'Heritage Sites', icon: '🏛️' },
  { id: 'culture', name: 'Cultural Experiences', icon: '🎭' },
  { id: 'adventure', name: 'Adventure Sports', icon: '⛰️' },
  { id: 'nature', name: 'Nature & Wildlife', icon: '🌿' }
];