import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { MapPin, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CultureMap from '@/components/CultureMap';
import AuthModal from '@/components/AuthModal';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();
  const { ready, authenticated, logout } = usePrivy();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Available cities (whitelisted)
  const availableCities = [
    {
      id: 'cannes',
      name: 'Cannes, France',
      coordinates: { lat: 43.5528, lng: 7.0174 },
      description: 'Film festival glamour meets Mediterranean culture',
      isActive: true
    }
  ];

  useEffect(() => {
    // Always default to Cannes to avoid loading issues
    const defaultLocation = availableCities[0].coordinates;
    setUserLocation(defaultLocation);
    setIsLoadingLocation(false);

    // Try to get user location but don't block the map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Keep default location if geolocation fails
          console.log('Geolocation failed, using default location');
        }
      );
    }

    // Show onboarding after 5 seconds
    const timer = setTimeout(() => {
      if (!authenticated && ready) {
        setShowAuthModal(true);
      } else if (authenticated) {
        setShowOnboarding(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [authenticated, ready]);

  const handleExploreClick = () => {
    navigate('/explore');
  };

  if (isLoadingLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-green-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/lovable-uploads/c685a2ad-a3fd-49c6-9887-8b20a1c7f5ee.png" 
                alt="Blockmaps Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mapping your culture...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Map */}
      <div className="absolute inset-0 pt-16">
        <CultureMap 
          initialLocation={userLocation}
          availableCities={availableCities}
        />
      </div>

      {/* Layer Toggle Panel - Moved to bottom left */}
      <div className="absolute left-4 bottom-4 z-40">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl border border-white/20">
          <div className="flex items-center space-x-2 mb-3">
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Layers</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full shadow-md"></div>
              <span className="text-red-600 font-medium">Safety</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full shadow-md"></div>
              <span className="text-purple-600 font-medium">Nightlife</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-md"></div>
              <span className="text-green-600 font-medium">Local Food</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-md"></div>
              <span className="text-blue-600 font-medium">Culture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && ready && authenticated && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-gradient-to-br from-blue-200/50 via-purple-200/50 to-pink-200/50">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🥷</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Welcome, Ninja!</h2>
              <p className="text-sm sm:text-base text-gray-600">You're now connected and ready to map culture in your neighborhood</p>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setShowOnboarding(false)}
              >
                Start Mapping Culture
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-2 border-gradient-to-r from-blue-400 to-purple-400 text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                onClick={handleExploreClick}
              >
                Explore All Cities
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
