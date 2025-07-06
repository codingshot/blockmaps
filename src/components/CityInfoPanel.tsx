
import { MapPin, Users, Calendar, TrendingUp } from 'lucide-react';

interface CityInfoPanelProps {
  city: {
    name: string;
    country?: string;
    countryFlag?: string;
    coordinates: { lat: number; lng: number };
    description: string;
    stats?: {
      contributors: number;
      dataPoints: number;
      lastUpdate: string;
    };
  };
}

const CityInfoPanel = ({ city }: CityInfoPanelProps) => {
  return (
    <div className="absolute top-4 left-4 z-40 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/20 max-w-sm">
      <div className="flex items-center space-x-2 mb-3">
        {city.countryFlag && <span className="text-2xl">{city.countryFlag}</span>}
        <h3 className="font-bold text-gray-900 text-lg">{city.name}</h3>
      </div>
      
      <div className="flex items-center space-x-1 text-xs text-gray-500 mb-3">
        <MapPin className="w-3 h-3" />
        <span>{city.coordinates.lat.toFixed(4)}, {city.coordinates.lng.toFixed(4)}</span>
      </div>

      {city.stats && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-blue-500" />
            <span className="text-gray-600">{city.stats.contributors.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-gray-600">{city.stats.dataPoints}</span>
          </div>
          <div className="flex items-center space-x-1 col-span-2">
            <Calendar className="w-3 h-3 text-purple-500" />
            <span className="text-gray-600">Updated {city.stats.lastUpdate}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityInfoPanel;
