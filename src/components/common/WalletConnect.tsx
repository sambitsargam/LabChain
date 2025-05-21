import React from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';

const WalletConnect: React.FC = () => {
  const { connected, wallet } = useWallet();

  if (connected && wallet) {
    return (
      <div className="flex items-center">
        <div className="mr-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {wallet.name}
        </div>
        <ConnectButton className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition-colors" />
      </div>
    );
  }

  return (
    <ConnectButton className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors" />
  );
};

export default WalletConnect;