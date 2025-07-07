
import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyWrapperProps {
  children: ReactNode;
}

const PrivyWrapper = ({ children }: PrivyWrapperProps) => {
  return (
    <PrivyProvider
      appId="cmctpdd0m011pla0ms48a4ezf"
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#6366F1',
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
