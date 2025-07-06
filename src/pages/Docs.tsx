
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { 
  ArrowLeft, 
  Book, 
  Code, 
  Globe, 
  Shield, 
  Users, 
  Wallet, 
  MapPin,
  Smartphone,
  Database,
  Zap,
  Heart,
  Mail,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Docs = () => {
  const navigate = useNavigate();
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [activeSection, setActiveSection] = useState('overview');

  const handleAuthAction = async () => {
    if (authenticated) {
      await logout();
    } else {
      await login();
    }
  };

  const getUserDisplayInfo = () => {
    if (!user) return { initial: '👤', display: 'Guest' };
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
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
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Blockmaps Docs
                  </h1>
                </div>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {ready && authenticated && user ? (
                <Button
                  variant="outline"
                  onClick={handleAuthAction}
                  className="flex items-center space-x-2 border-2 border-purple-200 hover:bg-purple-50"
                >
                  <span className="text-lg">{getUserDisplayInfo().initial}</span>
                  <span className="hidden sm:inline">{getUserDisplayInfo().display}</span>
                  <span className="text-xs text-gray-500">Logout</span>
                </Button>
              ) : (
                <Button
                  onClick={handleAuthAction}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Book },
                  { id: 'getting-started', label: 'Getting Started', icon: Zap },
                  { id: 'user-guide', label: 'User Guide', icon: Users },
                  { id: 'smart-contracts', label: 'Smart Contracts', icon: Code },
                  { id: 'api', label: 'API Reference', icon: Database },
                  { id: 'contact', label: 'Contact & Support', icon: MessageCircle },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Overview Section */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Welcome to Blockmaps
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      Discover and map authentic neighborhood culture through community-driven insights, powered by blockchain technology.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          <span>Interactive Mapping</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Explore cities through culture layers including safety, nightlife, food, art, and local insights.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-purple-500" />
                          <span>Web3 Integration</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Connect your wallet, mint NFTs for contributions, and participate in the decentralized culture economy.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-green-500" />
                          <span>Community Driven</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Add culture points, share local knowledge, and build a comprehensive map with fellow explorers.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Smartphone className="w-5 h-5 text-orange-500" />
                          <span>Mobile Ready</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          Responsive design works perfectly on desktop and mobile devices for mapping on the go.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Getting Started Section */}
              {activeSection === 'getting-started' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 1: Connect Your Wallet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Connect your Web3 wallet or sign up with email to start contributing to the culture map.</p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Supported:</strong> MetaMask, WalletConnect, Email authentication via Privy
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Step 2: Explore the Map</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Browse different culture layers to discover local insights:</p>
                      <ul className="list-disc ml-6 space-y-2">
                        <li><strong>🛡️ Safety</strong> - Safe areas and security tips</li>
                        <li><strong>🍸 Nightlife</strong> - Bars, clubs, and entertainment</li>
                        <li><strong>🍽️ Food</strong> - Local restaurants and food culture</li>
                        <li><strong>🎭 Culture</strong> - Museums, theaters, and cultural sites</li>
                        <li><strong>🎨 Art</strong> - Street art, galleries, and creative spaces</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Step 3: Add Culture Points</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Click anywhere on the map to add your own culture points and local insights.</p>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-green-700">
                          <strong>Earn NFTs:</strong> Each approved culture point contribution mints a unique NFT to your wallet!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* User Guide Section */}
              {activeSection === 'user-guide' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4">User Guide</h2>

                  <Tabs defaultValue="navigation" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="navigation">Navigation</TabsTrigger>
                      <TabsTrigger value="layers">Layers</TabsTrigger>
                      <TabsTrigger value="contributing">Contributing</TabsTrigger>
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="navigation" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Map Navigation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold">Desktop Controls:</h4>
                              <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                                <li>• Click and drag to pan the map</li>
                                <li>• Scroll wheel to zoom in/out</li>
                                <li>• Click markers to view details</li>
                                <li>• Click empty areas to add culture points</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold">Mobile Controls:</h4>
                              <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                                <li>• Touch and drag to pan</li>
                                <li>• Pinch to zoom</li>
                                <li>• Tap markers for info</li>
                                <li>• Tap + button then tap map to add points</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="layers" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Culture Layers</CardTitle>
                        </CardContent>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { emoji: '🛡️', name: 'Safety', desc: 'Safe areas, police stations, well-lit streets' },
                              { emoji: '🍸', name: 'Nightlife', desc: 'Bars, clubs, live music venues' },
                              { emoji: '🍽️', name: 'Food', desc: 'Restaurants, cafes, local specialties' },
                              { emoji: '🎭', name: 'Culture', desc: 'Museums, theaters, cultural events' },
                              { emoji: '💎', name: 'Wealth', desc: 'Luxury districts, expensive areas' },
                              { emoji: '🎨', name: 'Art', desc: 'Galleries, street art, creative spaces' },
                              { emoji: '🏖️', name: 'Lifestyle', desc: 'Parks, beaches, recreational areas' },
                              { emoji: '☕', name: 'Nomad', desc: 'WiFi cafes, coworking spaces' }
                            ].map((layer) => (
                              <div key={layer.name} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-2xl">{layer.emoji}</span>
                                <div>
                                  <h5 className="font-medium">{layer.name}</h5>
                                  <p className="text-sm text-gray-600">{layer.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="contributing" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>How to Contribute</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                              <h4 className="font-semibold text-blue-700">Step 1: Select Location</h4>
                              <p className="text-sm text-gray-600">Click anywhere on the map where you want to add a culture point.</p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-4">
                              <h4 className="font-semibold text-purple-700">Step 2: Choose Category</h4>
                              <p className="text-sm text-gray-600">Select the appropriate culture layer (food, nightlife, safety, etc.).</p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4">
                              <h4 className="font-semibold text-green-700">Step 3: Add Details</h4>
                              <p className="text-sm text-gray-600">Provide a title, description, and select an emoji representation.</p>
                            </div>
                            <div className="border-l-4 border-orange-500 pl-4">
                              <h4 className="font-semibold text-orange-700">Step 4: Submit & Mint</h4>
                              <p className="text-sm text-gray-600">Submit your contribution and receive an NFT as proof of contribution!</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="profile" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>User Profile & Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p>Access your profile by clicking the ninja emoji (🥷) in the top right when logged in.</p>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold">Profile Features:</h4>
                              <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                                <li>• View your culture contributions</li>
                                <li>• Track earned NFTs</li>
                                <li>• Monitor blockchain wallet stats</li>
                                <li>• Export contribution history</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Smart Contracts Section */}
              {activeSection === 'smart-contracts' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4">Smart Contracts & Web3</h2>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Code className="w-5 h-5" />
                        <span>Contract Architecture</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>Blockmaps uses smart contracts to manage NFT rewards and community governance:</p>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">CulturePointNFT Contract</h4>
                        <p className="text-sm text-gray-600">
                          ERC-721 contract that mints unique NFTs for each approved culture point contribution.
                        </p>
                        <div className="mt-2 font-mono text-xs bg-white p-2 rounded border">
                          Contract Address: 0x... (deployed on Ethereum mainnet)
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Governance Contract</h4>
                        <p className="text-sm text-gray-600">
                          Manages community voting on culture point approvals and platform governance.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>NFT Rewards System</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold">Earning NFTs:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• ✅ Add verified culture point (+1 NFT)</li>
                            <li>• 🔥 Highly rated contribution (+bonus traits)</li>
                            <li>• 🏆 Weekly top contributor (+rare NFT)</li>
                            <li>• 🎯 Complete city mapping (+special edition)</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <h4 className="font-semibold">NFT Utility:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• 🗳️ Voting rights in governance</li>
                            <li>• 🎁 Access to exclusive features</li>
                            <li>• 💎 Tradeable on OpenSea</li>
                            <li>• 🎮 Unlock premium map layers</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* API Reference Section */}
              {activeSection === 'api' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4">API Reference</h2>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>REST API Endpoints</CardTitle>
                      <CardDescription>Base URL: https://api.blockmaps.xyz</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code className="text-sm">/api/culture-points</code>
                          </div>
                          <p className="text-sm text-gray-600">Retrieve all culture points for a specific area</p>
                          <div className="mt-2 text-xs">
                            <strong>Query params:</strong> lat, lng, radius, category
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">POST</span>
                            <code className="text-sm">/api/culture-points</code>
                          </div>
                          <p className="text-sm text-gray-600">Submit a new culture point</p>
                          <div className="mt-2 text-xs">
                            <strong>Auth required:</strong> Bearer token from Privy
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GET</span>
                            <code className="text-sm">/api/user/nfts</code>
                          </div>
                          <p className="text-sm text-gray-600">Get user's earned NFTs and statistics</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>GraphQL API</CardTitle>
                      <CardDescription>Endpoint: https://api.blockmaps.xyz/graphql</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                        <div className="mb-2"># Query culture points near a location</div>
                        <div>query GetCulturePoints($lat: Float!, $lng: Float!) {`{`}</div>
                        <div className="ml-2">culturePoints(near: {`{lat: $lat, lng: $lng}`}) {`{`}</div>
                        <div className="ml-4">id</div>
                        <div className="ml-4">title</div>
                        <div className="ml-4">category</div>
                        <div className="ml-4">location {`{ lat lng }`}</div>
                        <div className="ml-4">nftTokenId</div>
                        <div className="ml-2">{`}`}</div>
                        <div>{`}`}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold mb-4">Contact & Support</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MessageCircle className="w-5 h-5 text-blue-500" />
                          <span>Community Support</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <a 
                            href="https://discord.gg/blockmaps" 
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Discord Community</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a 
                            href="https://t.me/blockmaps" 
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Telegram Group</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a 
                            href="https://twitter.com/blockmaps" 
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Twitter Updates</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-purple-500" />
                          <span>Direct Contact</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">General Inquiries</h4>
                            <a href="mailto:hello@blockmaps.xyz" className="text-purple-600 hover:text-purple-800">
                              hello@blockmaps.xyz
                            </a>
                          </div>
                          <div>
                            <h4 className="font-medium">Technical Support</h4>
                            <a href="mailto:support@blockmaps.xyz" className="text-purple-600 hover:text-purple-800">
                              support@blockmaps.xyz
                            </a>
                          </div>
                          <div>
                            <h4 className="font-medium">Partnerships</h4>
                            <a href="mailto:partnerships@blockmaps.xyz" className="text-purple-600 hover:text-purple-800">
                              partnerships@blockmaps.xyz
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">How do I earn NFTs?</h4>
                          <p className="text-sm text-gray-600">Connect your wallet and start adding culture points to the map. Each approved contribution earns you a unique NFT!</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Which cities are supported?</h4>
                          <p className="text-sm text-gray-600">We're starting with Cannes, France and expanding to major cities worldwide. Check the Explore page for current coverage.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Is my data secure?</h4>
                          <p className="text-sm text-gray-600">Yes! We use Privy for secure authentication and store minimal personal data. Your contributions are recorded on-chain for transparency.</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Can I delete my contributions?</h4>
                          <p className="text-sm text-gray-600">Culture points are stored on the blockchain for permanence, but you can contact support to discuss content concerns.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
