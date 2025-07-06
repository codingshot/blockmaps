
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AuthModal from './AuthModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { ready, authenticated, logout } = usePrivy();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthAction = async () => {
    if (authenticated) {
      await logout();
    } else {
      setShowAuthModal(true);
    }
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
              <p className="text-xs bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent font-medium">culture mapped live</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => navigate('/explore')}
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
                    <span className="hidden sm:inline">Logout</span>
                  </>
                ) : (
                  <>
                    <span>Connect</span>
                  </>
                )}
              </Button>
            )}
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
