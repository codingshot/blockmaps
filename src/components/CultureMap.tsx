import React, { useState, useEffect, useCallback } from 'react';
import OpenStreetMap from '@/components/OpenStreetMap';
import MapZoomControls from '@/components/MapZoomControls';
import MapFilters from '@/components/MapFilters';
import { Plus } from 'lucide-react';
import CityInfoPanel from './CityInfoPanel';
import AddPointForm from './AddPointForm';
import AuthModal from './AuthModal';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';

interface CultureMapProps {
  initialLocation: { lat: number; lng: number } | null;
  availableCities: Array<{
    id: string;
    name: string;
    coordinates: { lat: number; lng: number };
    description: string;
    isActive: boolean;
  }>;
}

const CultureMap = ({ initialLocation, availableCities }: CultureMapProps) => {
  const { authenticated } = usePrivy();
  const [mapCenter, setMapCenter] = useState(initialLocation || availableCities[0].coordinates);
  const [zoomLevel, setZoomLevel] = useState(15); // Increased from 13 to 15 for city-focused view
  const [cultureData, setCultureData] = useState<any[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<any[]>([]);
  const [showAddPointForm, setShowAddPointForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Complete culture data for Cannes
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

  useEffect(() => {
    if (initialLocation) {
      setMapCenter(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    setCultureData(cannesCultureData);
    setVisibleMarkers(cannesCultureData);
  }, []);

  // Filter markers based on selected filters
  useEffect(() => {
    if (selectedFilters.length === 0) {
      setVisibleMarkers(cultureData);
    } else {
      const filtered = cultureData.filter(marker => 
        selectedFilters.includes(marker.type)
      );
      setVisibleMarkers(filtered);
    }
  }, [selectedFilters, cultureData]);

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 1, 19));
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 1, 1));
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    setSelectedLocation({ lat, lng });
  }, []);

  const handleLocationClick = useCallback(() => {
    const currentCity = availableCities.find(city => 
      Math.abs(city.coordinates.lat - mapCenter.lat) < 0.01 && 
      Math.abs(city.coordinates.lng - mapCenter.lng) < 0.01
    ) || availableCities[0];
    
    setMapCenter(currentCity.coordinates);
    setZoomLevel(15); // Changed from 11 to 15 for better city focus
  }, [availableCities, mapCenter]);

  const handlePlusClick = () => {
    if (authenticated) {
      setShowAddPointForm(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAddPoint = (pointData: any) => {
    const newPoint = {
      ...pointData,
      id: Date.now().toString(),
    };
    setCultureData(prev => [...prev, newPoint]);
    console.log('Added new point:', newPoint);
  };

  const currentCity = availableCities.find(city => 
    Math.abs(city.coordinates.lat - mapCenter.lat) < 0.01 && 
    Math.abs(city.coordinates.lng - mapCenter.lng) < 0.01
  ) || availableCities[0];

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Add Point Button - Bottom right */}
      <div className="absolute bottom-4 right-4 z-50">
        <Button
          onClick={handlePlusClick}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* City Info Panel - Top right */}
      <div className="absolute top-4 right-4 z-50">
        <CityInfoPanel 
          city={{
            name: currentCity.name,
            country: 'France',
            countryFlag: '🇫🇷',
            coordinates: currentCity.coordinates,
            description: currentCity.description
          }}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* Map Controls Stack - Bottom left, with spacing */}
      <div className="absolute bottom-4 left-4 z-50 flex flex-col space-y-3">
        <MapFilters 
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
        <MapZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>

      {/* OpenStreetMap Component */}
      <div className="absolute inset-0 z-10">
        <OpenStreetMap
          center={mapCenter}
          zoom={zoomLevel}
          markers={visibleMarkers}
          onMapClick={handleMapClick}
          onLocationClick={handleLocationClick}
        />
      </div>

      {/* Add Point Form */}
      <AddPointForm
        isOpen={showAddPointForm}
        onClose={() => setShowAddPointForm(false)}
        onSubmit={handleAddPoint}
        selectedLocation={selectedLocation}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default CultureMap;
