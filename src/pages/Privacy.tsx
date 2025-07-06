
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const Privacy = () => {
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
              🔒 Privacy Policy
            </h1>
            <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🏢 About slangdotufn
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy describes how slangdotufn ("Company", "we", "our", or "us") collects, 
                uses, and protects your personal information when you use Blockmaps.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                📊 Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Personal Information</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Email address (when you create an account)</li>
                    <li>Wallet address (for blockchain authentication)</li>
                    <li>Profile information you choose to provide</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Usage Information</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Location data (with your permission)</li>
                    <li>Map interactions and contributions</li>
                    <li>Device information and browser data</li>
                    <li>Usage patterns and preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🎯 How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and improve our mapping services</li>
                <li>Personalize your experience on Blockmaps</li>
                <li>Communicate with you about updates and features</li>
                <li>Ensure security and prevent fraud</li>
                <li>Analyze usage patterns to enhance our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🤝 Information Sharing
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist our operations</li>
                <li>In connection with business transfers or mergers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                📍 Location Data
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Blockmaps uses location data to provide mapping services. Location sharing is optional, 
                and you can control location permissions through your device settings. We use location 
                data only to enhance your mapping experience and do not track your movements beyond 
                what's necessary for the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🛡️ Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, 
                no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                👤 Your Rights
              </h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Withdraw consent for data processing</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🍪 Cookies and Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and remember your preferences. You can control cookie settings through your browser, 
                though some features may not function properly if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                👶 Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Blockmaps is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If we become aware of such collection, we will 
                delete the information immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                🔄 Changes to Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant 
                changes via email or through the platform. Your continued use of Blockmaps after 
                changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                📞 Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy or how we handle your personal 
                information, please contact slangdotufn through our official support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
