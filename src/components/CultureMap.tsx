
import { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Shield, Coffee, Music, Heart } from 'lucide-react';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [mapMode, setMapMode] = useState<'day' | 'night'>('day');

  // Culture data for Cannes
  const cannesCultureData = [
    { id: 1, emoji: '🎬', type: 'culture', lat: 43.5515, lng: 7.0173, label: 'Palais des Festivals', intensity: 'high' },
    { id: 2, emoji: '🍾', type: 'nightlife', lat: 43.5501, lng: 7.0167, label: 'La Croisette Bars', intensity: 'high' },
    { id: 3, emoji: '🥖', type: 'food', lat: 43.5528, lng: 7.0174, label: 'Local Bakeries', intensity: 'medium' },
    { id: 4, emoji: '🛡️', type: 'safety', lat: 43.5540, lng: 7.0180, label: 'Safe Area', intensity: 'high' },
    { id: 5, emoji: '💎', type: 'wealth', lat: 43.5485, lng: 7.0155, label: 'Luxury District', intensity: 'very-high' },
    { id: 6, emoji: '🏖️', type: 'lifestyle', lat: 43.5479, lng: 7.0120, label: 'Beach Culture', intensity: 'high' },
    { id: 7, emoji: '🎭', type: 'culture', lat: 43.5531, lng: 7.0165, label: 'Theatre District', intensity: 'medium' },
    { id: 8, emoji: '☕', type: 'nomad', lat: 43.5525, lng: 7.0185, label: 'WiFi Cafes', intensity: 'medium' },
    { id: 9, emoji: '🌈', type: 'lgbtq', lat: 43.5510, lng: 7.0160, label: 'LGBTQ+ Friendly', intensity: 'high' },
    { id: 10, emoji: '🎨', type: 'art', lat: 43.5545, lng: 7.0195, label: 'Street Art', intensity: 'medium' },
  ];

  const getLayerColor = (type: string) => {
    const colors = {
      safety: '#ef4444',
      nightlife: '#8b5cf6',
      food: '#22c55e',
      culture: '#3b82f6',
      wealth: '#f59e0b',
      lifestyle: '#ec4899',
      nomad: '#06b6d4',
      lgbtq: '#a855f7',
      art: '#10b981'
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  const getIntensityOpacity = (intensity: string) => {
    const opacities = {
      'low': 0.3,
      'medium': 0.5,
      'high': 0.7,
      'very-high': 0.9
    };
    return opacities[intensity as keyof typeof opacities] || 0.5;
  };

  useEffect(() => {
    console.log('CultureMap initialized with location:', initialLocation);
  }, [initialLocation]);

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
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 60% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
          `
        }}
      >
        {/* Culture Points */}
        {cannesCultureData
          .filter(point => selectedLayer === 'all' || point.type === selectedLayer)
          .map((point) => (
            <div
              key={point.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${50 + (point.lng - initialLocation.lng) * 5000}%`,
                top: `${50 - (point.lat - initialLocation.lat) * 5000}%`,
              }}
            >
              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-full blur-lg scale-150"
                style={{
                  backgroundColor: getLayerColor(point.type),
                  opacity: getIntensityOpacity(point.intensity) * 0.3
                }}
              />
              
              {/* Main Marker */}
              <div className="relative bg-white rounded-full p-2 shadow-lg border-2 border-white hover:scale-110 transition-transform">
                <span className="text-2xl">{point.emoji}</span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                {point.label}
              </div>
            </div>
          ))}

        {/* Heat Map Overlays */}
        {cannesCultureData
          .filter(point => selectedLayer === 'all' || point.type === selectedLayer)
          .map((point) => (
            <div
              key={`heat-${point.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${50 + (point.lng - initialLocation.lng) * 5000 - 10}%`,
                top: `${50 - (point.lat - initialLocation.lat) * 5000 - 10}%`,
                width: '20%',
                height: '20%',
                background: `radial-gradient(circle, ${getLayerColor(point.type)}${Math.round(getIntensityOpacity(point.intensity) * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                filter: 'blur(20px)',
              }}
            />
          ))}

        {/* Center Location Marker */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg border-4 border-white animate-pulse">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="absolute bottom-6 left-6 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <h3 className="text-sm font-semibold mb-3">Culture Layers</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { key: 'all', icon: '🗺️', label: 'All' },
              { key: 'safety', icon: '🛡️', label: 'Safety' },
              { key: 'nightlife', icon: '🍸', label: 'Nightlife' },
              { key: 'food', icon: '🍽️', label: 'Food' },
              { key: 'culture', icon: '🎭', label: 'Culture' },
              { key: 'wealth', icon: '💎', label: 'Wealth' },
              { key: 'art', icon: '🎨', label: 'Art' },
            ].map((layer) => (
              <button
                key={layer.key}
                onClick={() => setSelectedLayer(layer.key)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  selectedLayer === layer.key
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Location Info */}
      <div className="absolute top-20 left-6 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl">🇫🇷</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Cannes, France</h2>
              <p className="text-sm text-gray-600">Film festival glamour meets Mediterranean culture</p>
              <div className="flex items-center space-x-4 mt-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>High Tourism</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Very Safe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>Luxury Vibe</span>
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
