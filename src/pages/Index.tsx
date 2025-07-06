import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { MapPin, Search, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CultureMap from '@/components/CultureMap';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const navigate = useNavigate();
  const { ready, authenticated } = usePrivy();
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
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoadingLocation(false);
          
          // Show onboarding after 5 seconds of map viewing
          setTimeout(() => {
            if (!authenticated) {
              setShowAuthModal(true);
            } else {
              setShowOnboarding(true);
            }
          }, 5000);
        },
        () => {
          // Default to Cannes if location access denied
          setUserLocation(availableCities[0].coordinates);
          setIsLoadingLocation(false);
          setTimeout(() => {
            if (!authenticated) {
              setShowAuthModal(true);
            } else {
              setShowOnboarding(true);
            }
          }, 5000);
        }
      );
    } else {
      // Default to Cannes if geolocation not supported
      setUserLocation(availableCities[0].coordinates);
      setIsLoadingLocation(false);
      setTimeout(() => {
        if (!authenticated) {
          setShowAuthModal(true);
        } else {
          setShowOnboarding(true);
        }
      }, 5000);
    }
  }, [authenticated]);

  const handleExploreClick = () => {
    navigate('/explore');
  };

  if (isLoadingLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Mapping your culture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/c685a2ad-a3fd-49c6-9887-8b20a1c7f5ee.png" 
                alt="Blockmaps Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                blockmaps
              </h1>
              <p className="text-xs text-gray-500">culture mapped live</p>
            </div>
          </div>
          
          <Button 
            onClick={handleExploreClick}
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2 hover:bg-blue-50"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Explore All Maps</span>
            <span className="sm:hidden">Explore</span>
          </Button>
        </div>
      </header>

      {/* Main Map */}
      <div className="absolute inset-0 pt-16">
        <CultureMap 
          initialLocation={userLocation}
          availableCities={availableCities}
        />
      </div>

      {/* Layer Toggle Panel - Mobile Responsive */}
      <div className="absolute right-2 sm:right-4 top-20 sm:top-24 z-40">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-lg border border-white/20">
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-medium">Layers</span>
          </div>
          <div className="space-y-1 sm:space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
              <span>Safety</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full"></div>
              <span>Nightlife</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
              <span>Local Food</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
              <span>Culture</span>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && ready && authenticated && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <img 
                  src="/lovable-uploads/c685a2ad-a3fd-49c6-9887-8b20a1c7f5ee.png" 
                  alt="Blockmaps Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Blockmaps</h2>
              <p className="text-sm sm:text-base text-gray-600">Discover authentic neighborhood culture through community-mapped insights</p>
            </div>
            
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => setShowOnboarding(false)}
              >
                Start Exploring
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleExploreClick}
              >
                View All Cities
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

      {/* Quick Action Buttons - Mobile Responsive */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 space-y-3">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg cursor-pointer hover:bg-white transition-colors">
          <span className="text-xl sm:text-2xl">📍</span>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg cursor-pointer hover:bg-white transition-colors">
          <span className="text-xl sm:text-2xl">➕</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
