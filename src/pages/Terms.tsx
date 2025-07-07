
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Terms = () => {
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
              Terms of Service
            </h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Effective Date:</strong> January 1, 2025
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing or using Blockmaps (the "Service"), operated by slang.fun ("Company", "we", "us", or "our"), 
                you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, 
                then you may not access the Service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Description of Service</h2>
              <p className="text-gray-600 mb-6">
                Blockmaps is a platform that allows users to create, share, and explore cultural maps of neighborhoods and cities. 
                Users can contribute data points, insights, and information about local culture, safety, amenities, and other 
                neighborhood characteristics.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h2>
              <p className="text-gray-600 mb-6">
                To use certain features of the Service, you may be required to create an account. You are responsible for 
                safeguarding your account credentials and for all activities that occur under your account. You agree to 
                immediately notify us of any unauthorized use of your account.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. User Content and Conduct</h2>
              <p className="text-gray-600 mb-4">
                You are solely responsible for the content you contribute to the Service. By contributing content, you represent that:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>You own the rights to the content or have permission to use it</li>
                <li>The content is accurate to the best of your knowledge</li>
                <li>The content does not violate any laws or third-party rights</li>
                <li>The content is not defamatory, harassing, or offensive</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Privacy and Data</h2>
              <p className="text-gray-600 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                to understand our practices regarding the collection and use of your information.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-600 mb-6">
                The Service and its original content, features, and functionality are and will remain the exclusive property 
                of slang.fun and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-gray-600 mb-6">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. slang.fun makes no warranties, expressed or implied, 
                and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability, 
                fitness for a particular purpose, and non-infringement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                In no event shall slang.fun, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
                for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of 
                profits, data, use, goodwill, or other intangible losses.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Termination</h2>
              <p className="text-gray-600 mb-6">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to 
                provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Information</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service, please contact us at legal@slang.fun.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
