
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import AuthModal from './AuthModal';
import MapSearch from './MapSearch';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ready, authenticated, logout } = usePrivy();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleAuthAction = async () => {
    if (authenticated) {
      await logout();
    } else {
      setShowAuthModal(true);
    }
    setShowMobileMenu(false);
  };

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    console.log('Location selected:', { lat, lng, name });
  };

  const handleExploreClick = () => {
    navigate('/explore');
    setShowMobileMenu(false);
  };

  const isMapPage = location.pathname === '/' || location.pathname.includes('/city/');

  // Get current city for search context
  const getCurrentCity = () => {
    if (location.pathname.includes('/city/')) {
      const cityName = location.pathname.split('/city/')[1];
      if (cityName === 'cannes') {
        return {
          name: 'Cannes',
          coordinates: { lat: 43.5528, lng: 7.0174 }
        };
      }
    }
    // Default to Cannes for home page
    if (location.pathname === '/') {
      return {
        name: 'Cannes',
        coordinates: { lat: 43.5528, lng: 7.0174 }
      };
    }
    return null;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gradient-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30 shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src="/lovable-uploads/c685a2ad-a3fd-49c6-9887-8b20a1c7f5ee.png" 
                alt="Blockmaps Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                blockmaps
              </h1>
              <p className="text-xs bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent font-medium hidden sm:block">culture mapped live</p>
            </div>
          </div>
          
          {/* Search Bar - Responsive, only on map pages */}
          {isMapPage && (
            <div className="flex-1 max-w-xs mx-4 hidden sm:block">
              <MapSearch 
                onLocationSelect={handleLocationSelect} 
                currentCity={getCurrentCity()}
              />
            </div>
          )}
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              onClick={handleExploreClick}
              variant="outline" 
              size="sm"
              className="flex items-center space-x-2 border-2 border-gradient-to-r from-blue-400 to-purple-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-blue-600 hover:text-purple-600 transition-all duration-300"
            >
              <span>Explore</span>
            </Button>

            {/* Auth Button */}
            {ready && (
              <Button
                onClick={handleAuthAction}
                variant={authenticated ? "ghost" : "default"}
                size="sm"
                className={`flex items-center space-x-2 transition-all duration-300 ${
                  authenticated 
                    ? "text-purple-600 hover:bg-purple-50" 
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                }`}
              >
                {authenticated ? (
                  <>
                    <span className="text-lg">🥷</span>
                    <span>Logout</span>
                  </>
                ) : (
                  <span>Connect</span>
                )}
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile search - only show on map pages */}
            {isMapPage && (
              <div className="flex-1 max-w-[200px] sm:hidden">
                <MapSearch 
                  onLocationSelect={handleLocationSelect} 
                  currentCity={getCurrentCity()}
                />
              </div>
            )}

            {/* Hamburger Menu */}
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center w-9 h-9 p-0 border-2 border-gradient-to-r from-blue-400 to-purple-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                >
                  <Menu className="w-4 h-4 text-blue-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Button 
                    onClick={handleExploreClick}
                    variant="outline" 
                    className="w-full justify-start border-2 border-gradient-to-r from-blue-400 to-purple-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 text-blue-600 hover:text-purple-600 transition-all duration-300"
                  >
                    Explore Cities
                  </Button>

                  {ready && (
                    <Button
                      onClick={handleAuthAction}
                      variant={authenticated ? "ghost" : "default"}
                      className={`w-full justify-start transition-all duration-300 ${
                        authenticated 
                          ? "text-purple-600 hover:bg-purple-50" 
                          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      }`}
                    >
                      {authenticated ? (
                        <>
                          <span className="text-lg mr-2">🥷</span>
                          <span>Logout</span>
                        </>
                      ) : (
                        <span>Connect Wallet</span>
                      )}
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navbar;
