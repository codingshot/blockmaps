
import { useState } from 'react';
import { MapPin, Users, Shield, Heart } from 'lucide-react';
import OpenStreetMap from './OpenStreetMap';

interface CultureMapProps {
  initialLocation: {lat: number, lng: number} | null;
  availableCities: Array<{
    id: string;
    name: string;
    coordinates: {lat: number, lng: number};
    description: string;
    isActive: boolean;
  }>;
}

const CultureMap = ({ initialLocation, availableCities }: CultureMapProps) => {
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // Culture data for Cannes
  const cannesCultureData = [
    { id: '1', emoji: '🎬', type: 'culture', lat: 43.5515, lng: 7.0173, label: 'Palais des Festivals' },
    { id: '2', emoji: '🍾', type: 'nightlife', lat: 43.5501, lng: 7.0167, label: 'La Croisette Bars' },
    { id: '3', emoji: '🥖', type: 'food', lat: 43.5528, lng: 7.0174, label: 'Local Bakeries' },
    { id: '4', emoji: '🛡️', type: 'safety', lat: 43.5540, lng: 7.0180, label: 'Safe Area' },
    { id: '5', emoji: '💎', type: 'wealth', lat: 43.5485, lng: 7.0155, label: 'Luxury District' },
    { id: '6', emoji: '🏖️', type: 'lifestyle', lat: 43.5479, lng: 7.0120, label: 'Beach Culture' },
    { id: '7', emoji: '🎭', type: 'culture', lat: 43.5531, lng: 7.0165, label: 'Theatre District' },
    { id: '8', emoji: '☕', type: 'nomad', lat: 43.5525, lng: 7.0185, label: 'WiFi Cafes' },
    { id: '9', emoji: '🌈', type: 'lgbtq', lat: 43.5510, lng: 7.0160, label: 'LGBTQ+ Friendly' },
    { id: '10', emoji: '🎨', type: 'art', lat: 43.5545, lng: 7.0195, label: 'Street Art' },
  ];

  const filteredMarkers = cannesCultureData.filter(point => 
    selectedLayer === 'all' || point.type === selectedLayer
  );

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    // TODO: Add new marker functionality
  };

  if (!initialLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* OpenStreetMap */}
      <OpenStreetMap
        center={initialLocation}
        zoom={13}
        markers={filteredMarkers}
        onMapClick={handleMapClick}
      />

      {/* Layer Controls - Mobile Responsive */}
      <div className="absolute bottom-4 sm:bottom-6 left-2 sm:left-6 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="sm:hidden w-full p-3 flex items-center justify-center space-x-2"
          >
            <span>🗺️</span>
            <span className="text-sm font-medium">Layers</span>
          </button>

          {/* Layer Panel */}
          <div className={`${showLayerPanel ? 'block' : 'hidden'} sm:block p-3 sm:p-4`}>
            <h3 className="text-sm font-semibold mb-3 hidden sm:block">Culture Layers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs">
              {[
                { key: 'all', icon: '🗺️', label: 'All' },
                { key: 'safety', icon: '🛡️', label: 'Safety' },
                { key: 'nightlife', icon: '🍸', label: 'Nightlife' },
                { key: 'food', icon: '🍽️', label: 'Food' },
                { key: 'culture', icon: '🎭', label: 'Culture' },
                { key: 'wealth', icon: '💎', label: 'Wealth' },
                { key: 'art', icon: '🎨', label: 'Art' },
                { key: 'lifestyle', icon: '🏖️', label: 'Beach' },
              ].map((layer) => (
                <button
                  key={layer.key}
                  onClick={() => {
                    setSelectedLayer(layer.key);
                    setShowLayerPanel(false);
                  }}
                  className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                    selectedLayer === layer.key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{layer.icon}</span>
                  <span className="truncate">{layer.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Location Info - Mobile Responsive */}
      <div className="absolute top-2 sm:top-20 left-2 sm:left-6 right-2 sm:right-auto z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg sm:text-xl">🇫🇷</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm sm:text-lg truncate">Cannes, France</h2>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-none">
                Film festival glamour meets Mediterranean culture
              </p>
              <div className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span className="hidden sm:inline">High Tourism</span>
                  <span className="sm:hidden">Tourism</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span className="hidden sm:inline">Very Safe</span>
                  <span className="sm:hidden">Safe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span className="hidden sm:inline">Luxury Vibe</span>
                  <span className="sm:hidden">Luxury</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CultureMap;
