
import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyWrapperProps {
  children: ReactNode;
}

const PrivyWrapper = ({ children }: PrivyWrapperProps) => {
  return (
    <PrivyProvider
      appId="clpispdty00ycl80fpueukbhl" // Default Privy app ID
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#6366F1',
          logo: 'https://your-logo-url.com/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};

export default PrivyWrapper;
