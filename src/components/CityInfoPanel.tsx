
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
    <div className="absolute top-4 left-4 z-40 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20 max-w-sm">
      <div className="flex items-center space-x-2">
        {city.countryFlag && <span className="text-lg">{city.countryFlag}</span>}
        <h3 className="font-bold text-gray-900 text-sm whitespace-nowrap">{city.name}</h3>
      </div>
    </div>
  );
};

export default CityInfoPanel;
