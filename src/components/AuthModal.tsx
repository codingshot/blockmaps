
import { usePrivy } from '@privy-io/react-auth';
import { X, Wallet, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = usePrivy();

  const handleLogin = async (method: 'wallet' | 'email') => {
    try {
      await login();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Connect to Blockmaps</h2>
            <p className="text-gray-600 text-sm">Start mapping culture in your neighborhood</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <p className="text-sm text-gray-600">
              Connect your wallet or email to contribute to the culture map
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleLogin('wallet')}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
            
            <Button
              onClick={() => handleLogin('email')}
              variant="outline"
              className="w-full h-12"
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Email
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
