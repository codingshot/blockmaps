
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Docs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blockmaps Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to know about culture mapping
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Getting Started</CardTitle>
              <CardDescription>
                Welcome to Blockmaps - your gateway to discovering authentic neighborhood culture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">What is Blockmaps?</h3>
                  <p className="text-gray-600">
                    Blockmaps is a decentralized, crowdsourced culture mapping platform that visualizes 
                    neighborhood characteristics through user-contributed data. Explore safety, nightlife, 
                    food scenes, and cultural experiences in cities worldwide.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">How to Get Started</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Connect your wallet using the "Connect Wallet" button</li>
                    <li>Navigate to any location on the map</li>
                    <li>Click to add cultural data points</li>
                    <li>Contribute to the community knowledge base</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Guides */}
          <Card>
            <CardHeader>
              <CardTitle>📖 User Guides</CardTitle>
              <CardDescription>
                Step-by-step guides to help you navigate Blockmaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Adding Culture Points</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Step 1:</strong> Click anywhere on the map where you want to add a culture point</p>
                    <p><strong>Step 2:</strong> Select the type of culture point (Safety, Nightlife, Food, etc.)</p>
                    <p><strong>Step 3:</strong> Add a descriptive title and detailed description</p>
                    <p><strong>Step 4:</strong> Choose appropriate tags to categorize your point</p>
                    <p><strong>Step 5:</strong> Submit to add it to the community map</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-3">Exploring Culture Data</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Browse:</strong> Use the map to explore different neighborhoods</p>
                    <p><strong>Filter:</strong> Use category filters to find specific types of culture information</p>
                    <p><strong>Interact:</strong> Click on points to see detailed community insights</p>
                    <p><strong>Navigate:</strong> Use search to find specific locations or areas</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">User Dashboard</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Profile:</strong> View your contribution statistics and activity</p>
                    <p><strong>Points:</strong> See all the culture points you've added</p>
                    <p><strong>History:</strong> Track your mapping activity over time</p>
                    <p><strong>Settings:</strong> Customize your Blockmaps experience</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Reference */}
          <Card>
            <CardHeader>
              <CardTitle>🔧 API Reference</CardTitle>
              <CardDescription>
                Technical documentation for developers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Authentication</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="font-mono text-sm">
                      Blockmaps uses Privy for wallet-based authentication. 
                      Connect your wallet to start contributing to the culture map.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Structure</h3>
                  <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                    <p className="font-mono text-sm"><strong>CulturePoint:</strong></p>
                    <ul className="font-mono text-xs space-y-1 ml-4">
                      <li>• id: string</li>
                      <li>• latitude: number</li>
                      <li>• longitude: number</li>
                      <li>• type: 'safety' | 'nightlife' | 'food' | 'culture'</li>
                      <li>• title: string</li>
                      <li>• description: string</li>
                      <li>• tags: string[]</li>
                      <li>• author: string</li>
                      <li>• timestamp: Date</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact & Support */}
          <Card>
            <CardHeader>
              <CardTitle>📞 Contact & Support</CardTitle>
              <CardDescription>
                Get help and connect with the Blockmaps community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Community</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Discord:</strong> Join our community server for real-time chat and support</p>
                    <p><strong>Twitter:</strong> Follow @blockmaps for updates and announcements</p>
                    <p><strong>GitHub:</strong> Contribute to the open-source project</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Support Channels</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> support@blockmaps.com</p>
                    <p><strong>Help Center:</strong> Browse frequently asked questions</p>
                    <p><strong>Bug Reports:</strong> Report issues via GitHub Issues</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Community Calls:</strong> Every Tuesday at 2 PM UTC</p>
                    <p><strong>Developer Q&A:</strong> First Friday of each month</p>
                    <p><strong>Support:</strong> Monday-Friday, 9 AM - 6 PM UTC</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>❓ Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about using Blockmaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Is Blockmaps free to use?</h3>
                  <p className="text-gray-600">
                    Yes! Blockmaps is completely free to use. You only need a wallet to connect and start contributing.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">How accurate is the culture data?</h3>
                  <p className="text-gray-600">
                    All data is crowdsourced from community members. We encourage users to verify and update 
                    information to maintain accuracy and relevance.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Can I edit or remove my contributions?</h3>
                  <p className="text-gray-600">
                    Yes, you can manage your contributions through your user dashboard. You can edit, update, 
                    or remove any culture points you've added.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">What blockchain does Blockmaps use?</h3>
                  <p className="text-gray-600">
                    Blockmaps is blockchain-agnostic and supports multiple wallet types through Privy authentication.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>⚖️ Terms & Privacy</CardTitle>
              <CardDescription>
                Legal information and data handling policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Terms of Service</h3>
                  <p className="text-gray-600">
                    By using Blockmaps, you agree to contribute accurate, helpful information and respect 
                    community guidelines. Harmful or misleading content will be moderated.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Privacy Policy</h3>
                  <p className="text-gray-600">
                    We respect your privacy. We only collect necessary wallet information for authentication 
                    and contribution tracking. Your personal data is never shared with third parties.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Ownership</h3>
                  <p className="text-gray-600">
                    Culture points you contribute remain your intellectual property while being shared 
                    with the community under Creative Commons licensing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            © 2024 Blockmaps. Built with ❤️ for the culture mapping community.
          </p>
        </div>
      </div>
    </div>
  );
}
