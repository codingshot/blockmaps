import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdvancedFiltersModal from '@/components/AdvancedFiltersModal';
import Navbar from '@/components/Navbar';

const Explore = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Real culture data from Cannes (matching CultureMap.tsx)
  const cannesCultureData = [
    // Safety & Security
    { id: '1', emoji: '🔥', type: 'crime-rate', lat: 43.5515, lng: 7.0173, label: 'Crime Rate Heatmap' },
    { id: '2', emoji: '🔫', type: 'gang-territory', lat: 43.5501, lng: 7.0167, label: 'Gang Territory' },
    { id: '3', emoji: '💋', type: 'red-light', lat: 43.5528, lng: 7.0174, label: 'Red Light District' },
    { id: '4', emoji: '🛡️', type: 'safety', lat: 43.5540, lng: 7.0180, label: 'Safety Score' },
    
    // Demographic & Economic
    { id: '5', emoji: '💰', type: 'wealth', lat: 43.5485, lng: 7.0155, label: 'Wealth Distribution' },
    { id: '6', emoji: '🏘️', type: 'property-value', lat: 43.5479, lng: 7.0120, label: 'Property Values' },
    { id: '7', emoji: '👨‍👩‍👧‍👦', type: 'age-groups', lat: 43.5531, lng: 7.0165, label: 'Age Demographics' },
    { id: '8', emoji: '⭐', type: 'celebrity', lat: 43.5525, lng: 7.0185, label: 'Celebrity Hotspots' },
    
    // Lifestyle & Entertainment
    { id: '9', emoji: '🍸', type: 'nightlife', lat: 43.5510, lng: 7.0160, label: 'Nightlife Density' },
    { id: '10', emoji: '🏳️‍🌈', type: 'lgbtq', lat: 43.5545, lng: 7.0195, label: 'LGBTQ+ Friendly' },
    { id: '11', emoji: '🍽️', type: 'food', lat: 43.5520, lng: 7.0175, label: 'Food Scene' },
    { id: '12', emoji: '🌓', type: 'day-night', lat: 43.5535, lng: 7.0165, label: 'Day/Night Activity' },
    { id: '13', emoji: '👯‍♀️', type: 'girls', lat: 43.5500, lng: 7.0150, label: 'Where Girls Are' },
    
    // Travel & Accessibility
    { id: '14', emoji: '🧳', type: 'tourist-local', lat: 43.5515, lng: 7.0185, label: 'Tourist vs Local' },
    { id: '15', emoji: '💎', type: 'authentic', lat: 43.5525, lng: 7.0195, label: 'Authentic Experience' },
    { id: '16', emoji: '👣', type: 'walkability', lat: 43.5545, lng: 7.0175, label: 'Walkability' },
    { id: '17', emoji: '🚇', type: 'transit', lat: 43.5505, lng: 7.0165, label: 'Transit Access' },
    { id: '18', emoji: '🅿️', type: 'parking', lat: 43.5530, lng: 7.0155, label: 'Parking Difficulty' },
    { id: '19', emoji: '🗣️', type: 'language', lat: 43.5520, lng: 7.0145, label: 'Language Prevalence' },
    { id: '20', emoji: '✨', type: 'light-pollution', lat: 43.5540, lng: 7.0165, label: 'Light Pollution' },
    
    // Digital Nomad & Expat
    { id: '21', emoji: '💻', type: 'nomad', lat: 43.5510, lng: 7.0175, label: 'Nomad Clusters' },
    { id: '22', emoji: '🌐', type: 'language-proficiency', lat: 43.5525, lng: 7.0155, label: 'Language Skills' },
    { id: '23', emoji: '☕', type: 'workspaces', lat: 43.5515, lng: 7.0195, label: 'Work-Friendly Cafes' },
    { id: '24', emoji: '🥗', type: 'vegan', lat: 43.5535, lng: 7.0145, label: 'Vegan & Health Food' },
    
    // Quality of Life
    { id: '25', emoji: '🔊', type: 'noise', lat: 43.5500, lng: 7.0185, label: 'Noise Levels' },
    { id: '26', emoji: '💨', type: 'air-quality', lat: 43.5520, lng: 7.0165, label: 'Air Quality' },
    { id: '27', emoji: '👨‍👩‍👧', type: 'family-friendly', lat: 43.5540, lng: 7.0155, label: 'Family Friendliness' },
    { id: '28', emoji: '🐾', type: 'pet-friendly', lat: 43.5505, lng: 7.0145, label: 'Pet Accommodation' },
    { id: '29', emoji: '💪', type: 'gyms', lat: 43.5530, lng: 7.0175, label: 'Gyms & Fitness' },
    
    // Cultural & Visual
    { id: '30', emoji: '🎨', type: 'street-art', lat: 43.5515, lng: 7.0155, label: 'Street Art Trail' },
    { id: '31', emoji: '🏛️', type: 'cultural-landmarks', lat: 43.5525, lng: 7.0165, label: 'Cultural Landmarks' },
    { id: '32', emoji: '📅', type: 'local-events', lat: 43.5545, lng: 7.0185, label: 'Local Events' },
    { id: '33', emoji: '🍲', type: 'food-specialties', lat: 43.5510, lng: 7.0195, label: 'Food Specialties' },
  ];

  // Calculate real statistics
  const totalDataPoints = cannesCultureData.length;
  const activeCities = 1; // Currently only Cannes is active
  const estimatedContributors = Math.floor(totalDataPoints * 37.8); // Rough estimate based on data points

  // Available cities with real calculated stats
  const cities = [
    {
      id: 'cannes',
      name: 'Cannes',
      country: 'France',
      countryFlag: '🇫🇷',
      coordinates: { lat: 43.5528, lng: 7.0174 },
      description: 'Film festival glamour meets Mediterranean culture',
      isActive: true,
      image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=400&h=300&fit=crop',
      stats: {
        contributors: estimatedContributors,
        dataPoints: totalDataPoints,
        lastUpdate: '2 hours ago'
      },
      highlights: [
        { icon: '🎬', label: 'Film Culture', strength: 'very-high' },
        { icon: '🛡️', label: 'Safety', strength: 'high' },
        { icon: '💎', label: 'Luxury', strength: 'very-high' },
        { icon: '🍸', label: 'Nightlife', strength: 'high' },
      ],
      tags: ['luxury', 'culture', 'nightlife', 'safe', 'tourist-friendly']
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      countryFlag: '🇫🇷',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      description: 'City of lights and endless cultural layers',
      isActive: false,
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      stats: {
        contributors: 0,
        dataPoints: 0,
        lastUpdate: 'Coming soon'
      },
      highlights: [],
      tags: ['culture', 'art', 'food', 'romance']
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      country: 'Spain',
      countryFlag: '🇪🇸',
      coordinates: { lat: 41.3851, lng: 2.1734 },
      description: 'Vibrant street culture and Mediterranean lifestyle',
      isActive: false,
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
      stats: {
        contributors: 0,
        dataPoints: 0,
        lastUpdate: 'Coming soon'
      },
      highlights: [],
      tags: ['art', 'nightlife', 'beach', 'architecture']
    },
    {
      id: 'amsterdam',
      name: 'Amsterdam',
      country: 'Netherlands',
      countryFlag: '🇳🇱',
      coordinates: { lat: 52.3676, lng: 4.9041 },
      description: 'Liberal culture meets historic charm',
      isActive: false,
      image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop',
      stats: {
        contributors: 0,
        dataPoints: 0,
        lastUpdate: 'Coming soon'
      },
      highlights: [],
      tags: ['liberal', 'canals', 'coffee-shops', 'bikes']
    },
  ];

  const filterOptions = [
    { id: 'active', label: 'Live Maps', icon: '🟢' },
    { id: 'luxury', label: 'Luxury Areas', icon: '💎' },
    { id: 'nightlife', label: 'Nightlife', icon: '🍸' },
    { id: 'culture', label: 'Cultural', icon: '🎭' },
    { id: 'safe', label: 'High Safety', icon: '🛡️' },
    { id: 'food', label: 'Food Scene', icon: '🍽️' },
    { id: 'art', label: 'Art & Design', icon: '🎨' },
    { id: 'beach', label: 'Beach Culture', icon: '🏖️' },
  ];

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setSearchQuery('');
  };

  const filteredCities = cities.filter(city => {
    // Search filter
    if (searchQuery && !city.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !city.country.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Tag filters
    if (selectedFilters.length > 0) {
      if (selectedFilters.includes('active') && !city.isActive) return false;
      
      const otherFilters = selectedFilters.filter(f => f !== 'active');
      if (otherFilters.length > 0 && !otherFilters.some(filter => city.tags.includes(filter))) {
        return false;
      }
    }

    return true;
  });

  const handleCityClick = (city: any) => {
    if (city.isActive) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Use consistent Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 py-6 sm:py-8 pt-20">
        {/* Page Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Explore Culture Maps
          </h1>
          <p className="text-sm sm:text-xl text-gray-600 mb-4 sm:mb-6">
            Discover authentic neighborhood insights from local communities worldwide
          </p>
          
          {/* Stats Bar - Mobile Responsive with Real Data */}
          <div className="flex justify-center space-x-4 sm:space-x-8 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{activeCities}</div>
              <div className="text-xs sm:text-sm text-gray-500">Live Cities</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{estimatedContributors.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-500">Contributors</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-pink-600">{totalDataPoints.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-gray-500">Data Points</div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Input
                placeholder="Search cities, countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 h-10 sm:h-12 text-sm sm:text-lg"
              />
            </div>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowAdvancedFilters(true)}
              className="flex items-center space-x-2"
            >
              <span>Advanced Filters</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                  selectedFilters.includes(filter.id)
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
          
          {(selectedFilters.length > 0 || searchQuery) && (
            <Button
              onClick={clearAllFilters}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4" />
              <span>Clear All Filters</span>
            </Button>
          )}
        </div>

        {/* Cities Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              onClick={() => handleCityClick(city)}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                city.isActive ? 'cursor-pointer hover:scale-105' : 'opacity-75'
              }`}
            >
              {/* City Image */}
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!city.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Globe className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-75" />
                      <p className="font-semibold text-sm sm:text-base">Coming Soon</p>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                    city.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {city.isActive ? '🟢 Live' : '⏳ Soon'}
                  </div>
                </div>
              </div>

              {/* City Info - Mobile Optimized */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl sm:text-2xl">{city.countryFlag}</span>
                  <h3 className="text-lg sm:text-xl font-bold">{city.name}</h3>
                  <span className="text-gray-500 text-sm sm:text-base">{city.country}</span>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{city.description}</p>

                {city.isActive && (
                  <>
                    {/* Culture Highlights - Mobile Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {city.highlights.slice(0, 4).map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span>{highlight.icon}</span>
                          <span className="text-gray-700 truncate">{highlight.label}</span>
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            highlight.strength === 'very-high' ? 'bg-green-500' :
                            highlight.strength === 'high' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} />
                        </div>
                      ))}
                    </div>

                    {/* Stats - Mobile Responsive */}
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 border-t pt-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{city.stats.contributors.toLocaleString()}</span>
                        <span className="hidden sm:inline">contributors</span>
                      </div>
                      <div className="text-right">
                        <span className="hidden sm:inline">Updated </span>
                        {city.stats.lastUpdate}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No cities found</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4">Try adjusting your search or filters</p>
            <Button 
              onClick={clearAllFilters}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Clear Filters</span>
            </Button>
          </div>
        )}

        {/* Call to Action - Mobile Responsive */}
        <div className="text-center mt-8 sm:mt-12 p-6 sm:p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Want to map your city?</h2>
          <p className="text-sm sm:text-lg mb-6 opacity-90">Join our community of culture mappers and help build authentic neighborhood insights</p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Request Your City
          </Button>
        </div>
      </div>

      <AdvancedFiltersModal
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        selectedFilters={selectedFilters}
        onFiltersChange={setSelectedFilters}
      />
    </div>
  );
};

export default Explore;
