
import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyWrapperProps {
  children: ReactNode;
}

const PrivyWrapper = ({ children }: PrivyWrapperProps) => {
  return (
    <PrivyProvider
      appId="clpispdty00ycl80fpueukbhl"
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#6366F1',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        supportedChains: [
          {
            id: 1,
            name: 'Ethereum',
            network: 'homestead',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: {
              default: { http: ['https://eth-mainnet.g.alchemy.com/v2/demo'] },
              public: { http: ['https://eth-mainnet.g.alchemy.com/v2/demo'] },
            },
          },
        ],
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyWrapper;
