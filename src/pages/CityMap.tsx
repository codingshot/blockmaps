
import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CultureMap from '@/components/CultureMap';

const CityMap = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [cityData, setCityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Available cities
  const availableCities = [
    {
      id: 'cannes',
      name: 'Cannes',
      coordinates: { lat: 43.5528, lng: 7.0174 },
      description: 'Film festival glamour meets Mediterranean culture',
      isActive: true
    }
  ];

  useEffect(() => {
    const city = availableCities.find(
      c => c.name.toLowerCase() === cityName?.toLowerCase()
    );
    
    if (city) {
      setCityData(city);
    }
    setIsLoading(false);
  }, [cityName]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-green-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading city map...
          </p>
        </div>
      </div>
    );
  }

  if (!cityData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16 h-screen">
        <CultureMap 
          initialLocation={cityData.coordinates}
          availableCities={[cityData]}
        />
      </div>
    </div>
  );
};

export default CityMap;
