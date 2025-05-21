import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskRound as Flask, Menu, X } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';
import WalletConnect from './WalletConnect';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { connected } = useWallet();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2">
            <Flask className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">LabChain</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            {connected && (
              <Link to="/create" className="text-gray-600 hover:text-blue-600 transition-colors">
                Create Notebook
              </Link>
            )}
            <WalletConnect />
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {connected && (
                <Link 
                  to="/create" 
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Notebook
                </Link>
              )}
              <div className="py-2">
                <WalletConnect />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;