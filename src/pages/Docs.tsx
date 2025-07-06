
import { ArrowLeft, Shield, Wallet, Code, MapPin, Users, Zap, Database, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Docs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gradient-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Map</span>
            </Button>
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c685a2ad-a3fd-49c6-9887-8b20a1c7f5ee.png" 
                alt="Blockmaps Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Blockmaps Documentation
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Blockmaps
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Blockmaps is a decentralized platform for mapping and discovering authentic neighborhood culture through community-driven insights. Built on blockchain technology with Web3 authentication, it empowers users to contribute, verify, and monetize cultural data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                <Globe className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Decentralized</h3>
                <p className="text-sm opacity-90">Community-owned cultural data</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                <Shield className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Verified</h3>
                <p className="text-sm opacity-90">Blockchain-verified contributions</p>
              </div>
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-4 rounded-xl">
                <Zap className="w-8 h-8 mb-2" />
                <h3 className="font-semibold">Rewarded</h3>
                <p className="text-sm opacity-90">Earn tokens for quality data</p>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Contract Functionality */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Code className="w-6 h-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Smart Contract Features</span>
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Culture Point NFTs</h3>
                <p className="text-gray-700 mb-3">Each cultural point added to the map is minted as an NFT, ensuring:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Immutable record of cultural data</li>
                  <li>Ownership attribution to contributors</li>
                  <li>Royalties for popular culture spots</li>
                  <li>Community governance over content quality</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-xl font-semibold mb-3 text-purple-700">Reputation System</h3>
                <p className="text-gray-700 mb-3">Smart contracts track contributor reputation through:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Accuracy scoring based on community verification</li>
                  <li>Contribution frequency and quality metrics</li>
                  <li>Peer review and rating mechanisms</li>
                  <li>Reputation-based reward multipliers</li>
                </ul>
              </div>

              <div className="border-l-4 border-pink-500 pl-6">
                <h3 className="text-xl font-semibold mb-3 text-pink-700">Token Economics</h3>
                <p className="text-gray-700 mb-3">The CULTURE token powers the ecosystem:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Earned for verified cultural contributions</li>
                  <li>Staked for enhanced reputation weight</li>
                  <li>Used for premium features and data access</li>
                  <li>Governance voting on platform decisions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Privy Integration */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Wallet className="w-6 h-6 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Privy Web3 Authentication</span>
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Seamless Web3 Onboarding</h3>
                <p className="text-gray-700 mb-4">
                  Privy integration provides frictionless access to Web3 features:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">Email + Wallet</h4>
                    <p className="text-sm text-gray-600">Start with email, upgrade to wallet seamlessly</p>
                  </div>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-600 mb-2">Embedded Wallets</h4>
                    <p className="text-sm text-gray-600">Auto-generated wallets for new users</p>
                  </div>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-600 mb-2">Multi-Chain Support</h4>
                    <p className="text-sm text-gray-600">Ethereum, Polygon, Base, and more</p>
                  </div>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-600 mb-2">Social Recovery</h4>
                    <p className="text-sm text-gray-600">Never lose access to your cultural data</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Smart Contract Interactions</h3>
                <p className="text-gray-700 mb-3">Privy enables secure blockchain interactions:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Mint culture point NFTs with gas optimization</li>
                  <li>Sign verification transactions for community moderation</li>
                  <li>Stake tokens for enhanced reputation</li>
                  <li>Vote on governance proposals</li>
                  <li>Claim rewards and royalties automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Core Features</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Interactive Culture Mapping</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Click anywhere on the map to add culture points</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Filter by culture layers (safety, nightlife, food, art)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>Real-time updates from community contributions</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Community Verification</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Peer review system for data accuracy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Reputation-based contribution weighting</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Blockchain-verified authenticity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Culture Layers */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Database className="w-6 h-6 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Culture Layers</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '🛡️', name: 'Safety', color: 'red', description: 'Safe areas, well-lit streets, security presence' },
                { icon: '🍸', name: 'Nightlife', color: 'purple', description: 'Bars, clubs, late-night entertainment' },
                { icon: '🍽️', name: 'Food', color: 'green', description: 'Local cuisine, markets, food culture' },
                { icon: '🎭', name: 'Culture', color: 'blue', description: 'Museums, theaters, cultural sites' },
                { icon: '🎨', name: 'Art', color: 'pink', description: 'Street art, galleries, creative spaces' },
                { icon: '🏖️', name: 'Lifestyle', color: 'cyan', description: 'Recreation, outdoor activities, lifestyle' },
                { icon: '💎', name: 'Wealth', color: 'yellow', description: 'Luxury districts, high-end shopping' },
                { icon: '☕', name: 'Digital Nomad', color: 'orange', description: 'WiFi cafes, coworking spaces' }
              ].map((layer) => (
                <div key={layer.name} className={`bg-gradient-to-br from-${layer.color}-50 to-${layer.color}-100 p-4 rounded-xl border border-${layer.color}-200`}>
                  <div className="text-2xl mb-2">{layer.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-1">{layer.name}</h3>
                  <p className="text-xs text-gray-600">{layer.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Users className="w-6 h-6 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Getting Started</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Connect Your Wallet</h3>
                  <p className="text-gray-600">Use Privy to connect via email or crypto wallet</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Explore the Map</h3>
                  <p className="text-gray-600">Browse existing culture points and filter by layers</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Add Culture Points</h3>
                  <p className="text-gray-600">Click on the map to add your local knowledge</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Earn Rewards</h3>
                  <p className="text-gray-600">Get CULTURE tokens for verified contributions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Details */}
        <section className="mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Lock className="w-6 h-6 text-gray-600" />
              <span className="bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">Technical Architecture</span>
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Frontend Stack</h3>
                <p className="text-sm text-gray-600">React + TypeScript + Tailwind CSS + Leaflet Maps</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Web3 Integration</h3>
                <p className="text-sm text-blue-600">Privy for authentication + Smart contracts on Ethereum/Polygon</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Data Storage</h3>
                <p className="text-sm text-purple-600">IPFS for metadata + On-chain for ownership + Local indexing</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Docs;
