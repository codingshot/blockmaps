
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, MapPin, Filter, Search, Globe, Users, Shield, Heart, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Explore = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Available cities with detailed info
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
        contributors: 1247,
        dataPoints: 3421,
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
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  blockmaps
                </h1>
                <p className="text-xs text-gray-500">culture mapped live</p>
              </div>
            </Link>
            
            <Button 
              onClick={() => navigate('/')}
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2"
            >
              <ArrowDown className="w-4 h-4 rotate-90" />
              <span>Back to Map</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Explore Culture Maps
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover authentic neighborhood insights from local communities worldwide
          </p>
          
          {/* Stats Bar */}
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">1</div>
              <div className="text-sm text-gray-500">Live Cities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-gray-500">Contributors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600">3,421</div>
              <div className="text-sm text-gray-500">Data Points</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search cities, countries, or culture types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button variant="outline" size="lg" className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </Button>
          </div>

          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
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
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              onClick={() => handleCityClick(city)}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                city.isActive ? 'cursor-pointer hover:scale-105' : 'opacity-75'
              }`}
            >
              {/* City Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!city.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Globe className="w-8 h-8 mx-auto mb-2 opacity-75" />
                      <p className="font-semibold">Coming Soon</p>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    city.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {city.isActive ? '🟢 Live' : '⏳ Soon'}
                  </div>
                </div>
              </div>

              {/* City Info */}
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{city.countryFlag}</span>
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <span className="text-gray-500">{city.country}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{city.description}</p>

                {city.isActive && (
                  <>
                    {/* Culture Highlights */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {city.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span>{highlight.icon}</span>
                          <span className="text-gray-700">{highlight.label}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            highlight.strength === 'very-high' ? 'bg-green-500' :
                            highlight.strength === 'high' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} />
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{city.stats.contributors.toLocaleString()} contributors</span>
                      </div>
                      <div>Updated {city.stats.lastUpdate}</div>
                    </div>
                  </>
                )}

                {!city.isActive && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">Map launching soon</p>
                    <Button variant="outline" size="sm" disabled>
                      Get Notified
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No cities found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
          <h2 className="text-2xl font-bold mb-4">Want to map your city?</h2>
          <p className="text-lg mb-6 opacity-90">Join our community of culture mappers and help build authentic neighborhood insights</p>
          <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            Request Your City
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Explore;
