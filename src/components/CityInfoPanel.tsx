
import React from 'react';
interface CityInfoPanelProps {
  city: {
    name: string;
    country: string;
    countryFlag: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    description: string;
  };
  onLocationClick?: () => void;
}
const CityInfoPanel = ({
  city,
  onLocationClick
}: CityInfoPanelProps) => {
  return <div onClick={onLocationClick} className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-4 w-auto cursor-pointer hover:bg-white/100 transition-all duration-200 hover:shadow-2xl z-50 relative">
      {/* City Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{city.countryFlag}</span>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{city.name}</h2>
            
          </div>
        </div>
        
      </div>
    </div>;
};
export default CityInfoPanel;
