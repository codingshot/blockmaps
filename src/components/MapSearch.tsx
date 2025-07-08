
import { useState, useEffect } from 'react';
import { Search, MapPin, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
  currentCity?: {
    name: string;
    coordinates: { lat: number; lng: number };
  };
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

const MapSearch = ({ onLocationSelect, currentCity }: MapSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search for type-ahead
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleTypeAheadSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentCity]);

  const handleTypeAheadSearch = async () => {
    if (!searchQuery.trim() || !currentCity) return;
    
    setIsSearching(true);
    try {
      // Get city bounds for filtering (approximate 10km radius)
      const lat = currentCity.coordinates.lat;
      const lng = currentCity.coordinates.lng;
      const radius = 0.1; // approximately 10km in degrees
      
      const bbox = `${lng - radius},${lat - radius},${lng + radius},${lat + radius}`;
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=8&countrycodes=fr&bounded=1&viewbox=${bbox}&addressdetails=1`
      );
      const results = await response.json();
      
      // Filter results to only include those within the city bounds
      const filteredResults = results.filter((result: SearchResult) => {
        const resultLat = parseFloat(result.lat);
        const resultLng = parseFloat(result.lon);
        
        // Check if result is within approximate city bounds
        const latDiff = Math.abs(resultLat - lat);
        const lngDiff = Math.abs(resultLng - lng);
        
        return latDiff <= radius && lngDiff <= radius;
      });
      
      setSearchResults(filteredResults);
      setShowResults(filteredResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await handleTypeAheadSearch();
  };

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    onLocationSelect(lat, lng, result.display_name);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        handleResultClick(searchResults[0]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={currentCity ? `Search in ${currentCity.name}...` : "Search location..."}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="pl-10 bg-white/90 backdrop-blur-sm border-white/20"
          />
          {isSearching && (
            <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Type-ahead Results */}
      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border-white/20 shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultClick(result)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
            >
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">
                    {result.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {result.display_name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </Card>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default MapSearch;
