
import { useState } from 'react';
import { MapPin, Users, Shield, Heart, Plus, User } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import OpenStreetMap from './OpenStreetMap';
import AddPointForm from './AddPointForm';
import AuthModal from './AuthModal';
import UserDashboard from './UserDashboard';
import { Button } from '@/components/ui/button';
import { useSmartContracts } from '@/utils/smartContracts';

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
  // Always use Cannes as default - this ensures the map loads
  const defaultLocation = { lat: 43.5528, lng: 7.0174 };
  const mapCenter = initialLocation || defaultLocation;

  console.log('CultureMap rendering with center:', mapCenter);

  // Expanded culture data with all categories
  const cannesCultureData = [
    // Safety & Security
    { id: '1', emoji: '🔥', type: 'crime-rate', lat: 43.5515, lng: 7.0173, label: 'Crime Rate Heatmap' },
    { id: '2', emoji: '🔫', type: 'gang-territory', lat: 43.5501, lng: 7.0167, label: 'Gang Territory' },
    { id: '3', emoji: '💋', type: 'red-light', lat: 43.5528, lng: 7.0174, label: 'Red Light District' },
    { id: '4', emoji: '🛡️', type: 'safety', lat: 43.5540, lng: 7.0180, label: 'Safety Score' },
    
    // Demographic & Economic
    { id: '5', emoji: '💰', type: 'wealth', lat: 43.5485, lng: 7.0155, label: 'Wealth Distribution' },
    { id: '6', emoji: '🏘️', type: 'property-value', lat: 43.5479, lng: 7.0120, label: 'Property Values' },
    { id: '7', emoji: '👨‍👩‍👧‍👦', type: 'age-groups', lat: 43.5531, lng: 7.0165, label: 'Age Demographics' },
    { id: '8', emoji: '⭐', type: 'celebrity', lat: 43.5525, lng: 7.0185, label: 'Celebrity Hotspots' },
    
    // Lifestyle & Entertainment
    { id: '9', emoji: '🍸', type: 'nightlife', lat: 43.5510, lng: 7.0160, label: 'Nightlife Density' },
    { id: '10', emoji: '🏳️‍🌈', type: 'lgbtq', lat: 43.5545, lng: 7.0195, label: 'LGBTQ+ Friendly' },
    { id: '11', emoji: '🍽️', type: 'food', lat: 43.5520, lng: 7.0175, label: 'Food Scene' },
    { id: '12', emoji: '🌓', type: 'day-night', lat: 43.5535, lng: 7.0165, label: 'Day/Night Activity' },
    { id: '13', emoji: '👯‍♀️', type: 'girls', lat: 43.5500, lng: 7.0150, label: 'Where Girls Are' },
    
    // Travel & Accessibility
    { id: '14', emoji: '🧳', type: 'tourist-local', lat: 43.5515, lng: 7.0185, label: 'Tourist vs Local' },
    { id: '15', emoji: '💎', type: 'authentic', lat: 43.5525, lng: 7.0195, label: 'Authentic Experience' },
    { id: '16', emoji: '👣', type: 'walkability', lat: 43.5545, lng: 7.0175, label: 'Walkability' },
    { id: '17', emoji: '🚇', type: 'transit', lat: 43.5505, lng: 7.0165, label: 'Transit Access' },
    { id: '18', emoji: '🅿️', type: 'parking', lat: 43.5530, lng: 7.0155, label: 'Parking Difficulty' },
    { id: '19', emoji: '🗣️', type: 'language', lat: 43.5520, lng: 7.0145, label: 'Language Prevalence' },
    { id: '20', emoji: '✨', type: 'light-pollution', lat: 43.5540, lng: 7.0165, label: 'Light Pollution' },
    
    // Digital Nomad & Expat
    { id: '21', emoji: '💻', type: 'nomad', lat: 43.5510, lng: 7.0175, label: 'Nomad Clusters' },
    { id: '22', emoji: '🌐', type: 'language-proficiency', lat: 43.5525, lng: 7.0155, label: 'Language Skills' },
    { id: '23', emoji: '☕', type: 'workspaces', lat: 43.5515, lng: 7.0195, label: 'Work-Friendly Cafes' },
    { id: '24', emoji: '🥗', type: 'vegan', lat: 43.5535, lng: 7.0145, label: 'Vegan & Health Food' },
    
    // Quality of Life
    { id: '25', emoji: '🔊', type: 'noise', lat: 43.5500, lng: 7.0185, label: 'Noise Levels' },
    { id: '26', emoji: '💨', type: 'air-quality', lat: 43.5520, lng: 7.0165, label: 'Air Quality' },
    { id: '27', emoji: '👨‍👩‍👧', type: 'family-friendly', lat: 43.5540, lng: 7.0155, label: 'Family Friendliness' },
    { id: '28', emoji: '🐾', type: 'pet-friendly', lat: 43.5505, lng: 7.0145, label: 'Pet Accommodation' },
    { id: '29', emoji: '💪', type: 'gyms', lat: 43.5530, lng: 7.0175, label: 'Gyms & Fitness' },
    
    // Cultural & Visual
    { id: '30', emoji: '🎨', type: 'street-art', lat: 43.5515, lng: 7.0155, label: 'Street Art Trail' },
    { id: '31', emoji: '🏛️', type: 'cultural-landmarks', lat: 43.5525, lng: 7.0165, label: 'Cultural Landmarks' },
    { id: '32', emoji: '📅', type: 'local-events', lat: 43.5545, lng: 7.0185, label: 'Local Events' },
    { id: '33', emoji: '🍲', type: 'food-specialties', lat: 43.5510, lng: 7.0195, label: 'Food Specialties' },
  ];

  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [cultureData, setCultureData] = useState(cannesCultureData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  
  const { ready, authenticated, user } = usePrivy();
  const { mintCulturePoint } = useSmartContracts();

  const filteredMarkers = cannesCultureData.filter(point => 
    selectedLayer === 'all' || point.type === selectedLayer
  );

  // Layer categories for organized display
  const layerCategories = [
    {
      name: 'Safety & Security',
      layers: [
        { key: 'crime-rate', icon: '🔥', label: 'Crime Rate' },
        { key: 'gang-territory', icon: '🔫', label: 'Gang Territory' },
        { key: 'red-light', icon: '💋', label: 'Red Light' },
        { key: 'safety', icon: '🛡️', label: 'Safety Score' },
      ]
    },
    {
      name: 'Demographics',
      layers: [
        { key: 'wealth', icon: '💰', label: 'Wealth' },
        { key: 'property-value', icon: '🏘️', label: 'Property' },
        { key: 'age-groups', icon: '👨‍👩‍👧‍👦', label: 'Age Groups' },
        { key: 'celebrity', icon: '⭐', label: 'Celebrity' },
      ]
    },
    {
      name: 'Lifestyle',
      layers: [
        { key: 'nightlife', icon: '🍸', label: 'Nightlife' },
        { key: 'lgbtq', icon: '🏳️‍🌈', label: 'LGBTQ+' },
        { key: 'food', icon: '🍽️', label: 'Food Scene' },
        { key: 'girls', icon: '👯‍♀️', label: 'Girls' },
      ]
    },
    {
      name: 'Travel',
      layers: [
        { key: 'tourist-local', icon: '🧳', label: 'Tourist/Local' },
        { key: 'walkability', icon: '👣', label: 'Walkable' },
        { key: 'transit', icon: '🚇', label: 'Transit' },
        { key: 'parking', icon: '🅿️', label: 'Parking' },
      ]
    },
    {
      name: 'Work & Life',
      layers: [
        { key: 'nomad', icon: '💻', label: 'Nomads' },
        { key: 'workspaces', icon: '☕', label: 'Work Cafes' },
        { key: 'vegan', icon: '🥗', label: 'Healthy Food' },
        { key: 'gyms', icon: '💪', label: 'Fitness' },
      ]
    },
    {
      name: 'Culture',
      layers: [
        { key: 'street-art', icon: '🎨', label: 'Street Art' },
        { key: 'cultural-landmarks', icon: '🏛️', label: 'Landmarks' },
        { key: 'local-events', icon: '📅', label: 'Events' },
        { key: 'food-specialties', icon: '🍲', label: 'Specialties' },
      ]
    }
  ];

  const handleMapClick = (lat: number, lng: number) => {
    console.log('Map clicked at:', lat, lng);
    setSelectedLocation({ lat, lng });
    setInteractionCount(prev => prev + 1);
    
    // Only require login after 20 interactions
    if (interactionCount >= 20 && (!ready || !authenticated)) {
      setShowAuthModal(true);
      return;
    }
    
    setShowAddForm(true);
  };

  const handleLayerChange = (layerKey: string) => {
    setSelectedLayer(layerKey);
    setShowLayerPanel(false);
    setInteractionCount(prev => prev + 1);
  };

  const handleAddPoint = async (newPoint: any) => {
    setCultureData(prev => [...prev, newPoint]);
    console.log('New point added:', newPoint);
    
    // If user is authenticated, mint NFT
    if (authenticated && user) {
      try {
        console.log('Minting NFT for culture point...');
        const nftResult = await mintCulturePoint(newPoint);
        console.log('NFT minted successfully:', nftResult);
        
        // Show success notification
        alert(`Culture point added and NFT minted! Token ID: ${nftResult.tokenId}`);
      } catch (error) {
        console.error('Failed to mint NFT:', error);
        // Still allow the point to be added locally even if NFT minting fails
      }
    }
  };

  const handleAddButtonClick = () => {
    setInteractionCount(prev => prev + 1);
    
    if (interactionCount >= 20 && (!ready || !authenticated)) {
      setShowAuthModal(true);
      return;
    }
    
    // Show instructions to click on map
    alert('Click anywhere on the map to add a culture point!');
  };

  // Helper function to get user display info with ninja emoji
  const getUserDisplayInfo = () => {
    if (!user) return { initial: '👤', display: 'Connected' };
    
    if (user.email) {
      const emailString = typeof user.email === 'string' ? user.email : user.email.address;
      return {
        initial: '🥷',
        display: emailString.split('@')[0]
      };
    }
    
    return { initial: '🥷', display: 'Ninja User' };
  };

  return (
    <div className="relative w-full h-full">
      {/* OpenStreetMap - Always render with valid coordinates */}
      <OpenStreetMap
        center={mapCenter}
        zoom={13}
        markers={filteredMarkers}
        onMapClick={handleMapClick}
      />

      {/* Layer Controls - Enhanced with categories */}
      <div className="absolute bottom-4 sm:bottom-6 left-2 sm:left-6 z-30 max-w-xs">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 max-h-[70vh] overflow-y-auto">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="sm:hidden w-full p-3 flex items-center justify-center space-x-2"
          >
            <span>🗺️</span>
            <span className="text-sm font-medium">Layers ({interactionCount}/20)</span>
          </button>

          {/* Layer Panel */}
          <div className={`${showLayerPanel ? 'block' : 'hidden'} sm:block p-3 sm:p-4`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold hidden sm:block">Culture Layers</h3>
              <span className="text-xs text-gray-500">{interactionCount}/20 free</span>
            </div>
            
            {/* All Layer Option */}
            <button
              onClick={() => handleLayerChange('all')}
              className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors mb-3 ${
                selectedLayer === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>🗺️</span>
              <span className="text-sm font-medium">Show All</span>
            </button>

            {/* Categorized Layers */}
            {layerCategories.map((category) => (
              <div key={category.name} className="mb-4">
                <h4 className="text-xs font-semibold text-gray-600 mb-2">{category.name}</h4>
                <div className="grid grid-cols-2 gap-1">
                  {category.layers.map((layer) => (
                    <button
                      key={layer.key}
                      onClick={() => handleLayerChange(layer.key)}
                      className={`flex items-center space-x-1 p-2 rounded-lg transition-colors text-xs ${
                        selectedLayer === layer.key
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm">{layer.icon}</span>
                      <span className="truncate">{layer.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Location Info - Condensed and Mobile Responsive */}
      <div className="absolute top-2 sm:top-20 left-2 sm:left-6 right-20 sm:right-auto z-30 max-w-xs">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 sm:p-3 shadow-lg border border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm sm:text-lg">🇫🇷</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm sm:text-base truncate">Cannes</h2>
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Safe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>Luxury</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Point Button */}
      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-30">
        <Button
          onClick={handleAddButtonClick}
          size="lg"
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* User Info */}
      {ready && authenticated && user && (
        <div className="absolute top-2 right-2 sm:top-6 sm:right-6 z-30">
          <Button
            variant="ghost"
            onClick={() => setShowUserDashboard(true)}
            className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-white/20 hover:bg-white/95 hover:shadow-xl transition-all hover:scale-105"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-lg">
                  {getUserDisplayInfo().initial}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                {getUserDisplayInfo().display}
              </span>
              <User className="w-4 h-4 text-gray-500" />
            </div>
          </Button>
        </div>
      )}

      {/* Add Point Form */}
      <AddPointForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddPoint}
        selectedLocation={selectedLocation}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* User Dashboard */}
      <UserDashboard
        isOpen={showUserDashboard}
        onClose={() => setShowUserDashboard(false)}
      />
    </div>
  );
};

export default CultureMap;
