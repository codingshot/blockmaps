
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              📄 Terms of Service
            </h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🏢 About slangdotufn
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms of Service govern your use of Blockmaps, operated by slangdotufn ("Company", "we", "our", or "us"). 
                By accessing or using our service, you agree to be bound by these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                ✅ Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By creating an account or using Blockmaps, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🗺️ Service Description
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Blockmaps is a platform that allows users to map and share cultural information about neighborhoods and cities. 
                Our services include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Interactive mapping of cultural points of interest</li>
                <li>Community contributions and data sharing</li>
                <li>Location-based cultural information</li>
                <li>User-generated content and reviews</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                👤 User Responsibilities
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Respect other users and communities</li>
                <li>Do not post inappropriate, offensive, or illegal content</li>
                <li>Comply with local laws and regulations</li>
                <li>Protect your account credentials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🚫 Prohibited Activities
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Harassment or discrimination of any kind</li>
                <li>Sharing false or misleading information</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Using the service for illegal activities</li>
                <li>Violating intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                📱 Intellectual Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The Blockmaps platform, including its design, features, and content, is owned by slangdotufn. 
                User-generated content remains the property of the respective users, but by using our service, 
                you grant us a license to use, display, and distribute such content within the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                ⚠️ Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed">
                slangdotufn provides Blockmaps "as is" without warranties of any kind. We are not liable for 
                any damages arising from your use of the service, including but not limited to direct, indirect, 
                incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🔄 Changes to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant 
                changes via email or through the platform. Continued use of the service after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                📞 Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about these Terms of Service, please contact slangdotufn through 
                our official channels or support system.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
