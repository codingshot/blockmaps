
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, Trophy, Coins, Star, TrendingUp, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSmartContracts } from '@/utils/smartContracts';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDashboard = ({ isOpen, onClose }: UserDashboardProps) => {
  const { user, authenticated } = usePrivy();
  const { getCultureTokenBalance, getReputationScore } = useSmartContracts();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [reputationScore, setReputationScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authenticated && isOpen) {
      loadUserData();
    }
  }, [authenticated, isOpen]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [balance, reputation] = await Promise.all([
        getCultureTokenBalance(),
        getReputationScore()
      ]);
      setTokenBalance(balance);
      setReputationScore(reputation);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDisplayInfo = () => {
    if (!user) return { initial: '👤', display: 'User', address: '' };
    
    if (user.email) {
      const emailString = typeof user.email === 'string' ? user.email : user.email.address;
      return {
        initial: emailString.charAt(0).toUpperCase(),
        display: emailString,
        address: user.wallet?.address || 'No wallet connected'
      };
    }
    
    return { 
      initial: '👤', 
      display: 'Connected User',
      address: user.wallet?.address || 'No wallet connected'
    };
  };

  if (!isOpen) return null;

  const userInfo = getUserDisplayInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{userInfo.initial}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Web3 Dashboard</h2>
              <p className="text-gray-600 text-sm">{userInfo.display}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">CULTURE Tokens</p>
                      <p className="text-2xl font-bold text-blue-700">{tokenBalance}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Reputation</p>
                      <p className="text-2xl font-bold text-purple-700">{reputationScore}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <Star className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">NFTs Owned</p>
                      <p className="text-2xl font-bold text-green-700">12</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <span>Wallet Address</span>
                </h3>
                <p className="text-sm font-mono bg-white p-2 rounded border">
                  {userInfo.address}
                </p>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Recent Activity</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🎭</span>
                      <div>
                        <p className="font-medium text-green-700">Culture Point Added</p>
                        <p className="text-sm text-green-600">Palais des Festivals - 2 hours ago</p>
                      </div>
                    </div>
                    <span className="text-green-600 font-bold">+50 CULTURE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-medium text-blue-700">Point Verified</p>
                        <p className="text-sm text-blue-600">Community verified your contribution</p>
                      </div>
                    </div>
                    <span className="text-blue-600 font-bold">+25 CULTURE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <p className="font-medium text-purple-700">Reputation Milestone</p>
                        <p className="text-sm text-purple-600">Reached 75 reputation points</p>
                      </div>
                    </div>
                    <span className="text-purple-600 font-bold">+100 CULTURE</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-pink-600" />
                  <span>Quick Actions</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => {
                      console.log('Claiming rewards...');
                      // Implement reward claiming
                    }}
                  >
                    Claim Rewards
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      console.log('Staking tokens...');
                      // Implement token staking
                    }}
                  >
                    Stake Tokens
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
