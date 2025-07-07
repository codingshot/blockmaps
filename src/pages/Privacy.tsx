
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blockmaps</span>
            </Link>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Effective Date:</strong> January 1, 2025
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-6">
                slang.fun ("Company", "we", "us", or "our") operates the Blockmaps service (the "Service"). 
                This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of 
                personal data when you use our Service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Email address (when you create an account)</li>
                <li>Wallet address (when you connect a cryptocurrency wallet)</li>
                <li>Profile information you choose to provide</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-700 mb-3">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Information about how you use our Service</li>
                <li>Location data (when you contribute to maps)</li>
                <li>Device information and IP address</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the collected data for various purposes:</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">We may share your personal information in the following situations:</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li><strong>With Service Providers:</strong> To monitor and analyze the use of our Service</li>
                <li><strong>For Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
                <li><strong>With Affiliates:</strong> We may share your information with our affiliates</li>
                <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
              <p className="text-gray-600 mb-6">
                The security of your data is important to us, but remember that no method of transmission over the Internet 
                or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to 
                protect your personal data, we cannot guarantee its absolute security.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Access the personal data we hold about you</li>
                <li>Correct any inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request data portability</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-6">
                We use cookies and similar tracking technologies to track activity on our Service and hold certain information. 
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 mb-6">
                Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable 
                information from children under 13. If you are a parent or guardian and you are aware that your child has 
                provided us with personal data, please contact us.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 mb-6">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy, please contact us at privacy@slang.fun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
