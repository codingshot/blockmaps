
import React from 'react';
import { MapPin, Globe, Users } from 'lucide-react';

interface CityInfoPanelProps {
  city: {
    name: string;
    country: string;
    countryFlag: string;
    coordinates: { lat: number; lng: number };
    description: string;
  };
  onLocationClick?: () => void;
}

const CityInfoPanel = ({ city, onLocationClick }: CityInfoPanelProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-4 w-72 sm:w-80">
      {/* City Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl">{city.countryFlag}</span>
            <h2 className="text-lg font-bold text-gray-800">{city.name}</h2>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>{city.country}</span>
          </div>
        </div>
        <button
          onClick={onLocationClick}
          className="flex items-center space-x-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 text-sm"
        >
          <MapPin className="w-4 h-4" />
          <span>View</span>
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
        {city.description}
      </p>

      {/* Coordinates */}
      <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
        <div className="flex items-center space-x-1">
          <MapPin className="w-3 h-3" />
          <span>
            {city.coordinates.lat.toFixed(4)}, {city.coordinates.lng.toFixed(4)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3" />
          <span>Culture Map</span>
        </div>
      </div>
    </div>
  );
};

export default CityInfoPanel;
