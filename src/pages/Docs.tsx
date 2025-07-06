
import { useState } from 'react';
import { Search, MapPin, Users, Shield, Zap, Globe, Code, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    {
      id: 'getting-started',
      title: '🚀 Getting Started',
      icon: <BookOpen className="w-5 h-5" />,
      content: [
        {
          title: '🌍 What is Blockmaps?',
          description: 'Blockmaps is a decentralized culture mapping platform that allows users to discover and contribute authentic cultural insights about neighborhoods worldwide through community-driven data.',
          tags: ['Overview', 'Platform']
        },
        {
          title: '🗺️ How to Use the Map',
          description: 'Navigate through different culture layers by clicking on emoji markers. Each marker represents real community insights about safety, nightlife, food, and cultural experiences in that specific location.',
          tags: ['Tutorial', 'Map']
        },
        {
          title: '🔗 Connect Your Wallet',
          description: 'Connect your crypto wallet to start contributing culture points and earn NFT rewards for sharing valuable local insights that help build authentic neighborhood maps.',
          tags: ['Wallet', 'NFT']
        }
      ]
    },
    {
      id: 'culture-layers',
      title: '📍 Culture Layers',
      icon: <MapPin className="w-5 h-5" />,
      content: [
        {
          title: '🛡️ Safety & Security',
          description: 'Crime rates, gang territories, safety scores, and red light districts. Markers include 🔥 for crime hotspots, 🔫 for gang areas, and 💋 for adult entertainment districts.',
          tags: ['Safety', 'Security']
        },
        {
          title: '💰 Demographics & Economics',
          description: 'Wealth distribution, property values, age groups, and celebrity hotspots. Look for 💰 wealth markers, 🏘️ property values, and ⭐ celebrity locations.',
          tags: ['Demographics', 'Economics']
        },
        {
          title: '🍸 Lifestyle & Entertainment',
          description: 'Nightlife density, LGBTQ+ friendly areas, food scenes, and social hotspots. Find 🍸 nightlife, 🏳️‍🌈 LGBTQ+ spaces, and 🍽️ food destinations.',
          tags: ['Lifestyle', 'Entertainment']
        },
        {
          title: '🧳 Travel & Accessibility',
          description: 'Tourist vs local ratios, authentic experiences, walkability, transit access. Discover 🧳 tourist areas, 💎 authentic spots, and 🚇 transit hubs.',
          tags: ['Travel', 'Accessibility']
        },
        {
          title: '💻 Digital Nomad & Work',
          description: 'Remote work clusters, coworking spaces, wifi quality, and nomad-friendly areas. Find 💻 nomad spots, ☕ work cafes, and 🌐 connectivity zones.',
          tags: ['Work', 'Digital Nomad']
        },
        {
          title: '🎨 Culture & Art',
          description: 'Street art trails, cultural landmarks, local events, and neighborhood specialties. Explore 🎨 art areas, 🏛️ landmarks, and 📅 event locations.',
          tags: ['Culture', 'Art']
        }
      ]
    },
    {
      id: 'contributing',
      title: '👥 Contributing Data',
      icon: <Users className="w-5 h-5" />,
      content: [
        {
          title: '➕ Adding Culture Points',
          description: 'Click the + button on the map to add new culture points. Choose from 30+ categories including safety, nightlife, food, work spaces, and cultural experiences.',
          tags: ['Contributing', 'Data']
        },
        {
          title: '✅ Data Quality Guidelines',
          description: 'Ensure contributions are accurate, helpful, and respectful. Focus on authentic cultural experiences that genuinely help others understand neighborhood character.',
          tags: ['Guidelines', 'Quality']
        },
        {
          title: '🎁 NFT Rewards',
          description: 'Authenticated users receive NFT rewards for quality contributions. The more valuable your insights, the rarer your NFT rewards become.',
          tags: ['NFT', 'Rewards']
        }
      ]
    },
    {
      id: 'technical',
      title: '⚡ Technical Details',
      icon: <Code className="w-5 h-5" />,
      content: [
        {
          title: '🔗 Blockchain Integration',
          description: 'Built on secure blockchain infrastructure with smart contracts for NFT rewards and decentralized data verification ensuring community-owned culture maps.',
          tags: ['Blockchain', 'Smart Contracts']
        },
        {
          title: '🔒 Data Privacy',
          description: 'Your privacy is protected through decentralized architecture. Contribute anonymously or with your wallet connected - your choice, your data.',
          tags: ['Privacy', 'Security']
        },
        {
          title: '🛠️ Developer Access',
          description: 'Developers can access culture data through our API to build complementary applications and integrate neighborhood insights into their platforms.',
          tags: ['API', 'Developers']
        }
      ]
    }
  ];

  const filteredSections = sections.map(section => ({
    ...section,
    content: section.content.filter(item =>
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section => section.content.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              📚 Documentation
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            🗺️ Learn how to use Blockmaps to discover authentic culture and contribute valuable local insights
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="🔍 Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-2 focus:border-purple-400"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid gap-8 max-w-4xl mx-auto">
          {filteredSections.map((section) => (
            <Card key={section.id} className="border-2 border-white/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {section.content.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {index < section.content.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;
