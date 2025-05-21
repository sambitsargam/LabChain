import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '@suiet/wallet-kit';
import { BookOpen, Plus, LayoutGrid, List } from 'lucide-react';
import { useSuiClient } from '../hooks/useSuiTx';
import NotebookCard from '../components/notebooks/NotebookCard';
import WalletConnect from '../components/common/WalletConnect';

type Notebook = {
  id: string;
  type: string;
  owner: string;
  head: string;
};

const Home: React.FC = () => {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const { wallet, connected } = useWallet();
  const suiClient = useSuiClient();

  useEffect(() => {
    const fetchNotebooks = async () => {
      if (!connected || !wallet?.address) {
        setIsLoading(false);
        return;
      }

      try {
        // In a real implementation, we would fetch the user's notebooks from the blockchain
        // For this demo, we'll use placeholder data
        setIsLoading(true);
        
        // This would be replaced with actual blockchain query
        const dummyData = [
          { id: '1', type: 'Chemistry', owner: wallet.address, head: '0' },
          { id: '2', type: 'Biology', owner: wallet.address, head: '1' },
        ];
        
        setTimeout(() => {
          setNotebooks(dummyData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching notebooks:', error);
        setIsLoading(false);
      }
    };

    fetchNotebooks();
  }, [connected, wallet?.address, suiClient]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BookOpen className="w-16 h-16 text-blue-600 mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">On-Chain Lab Notebook</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
          Document your scientific research on the blockchain. Create, edit, and fork lab notebooks with immutable version history.
        </p>
        <WalletConnect />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Lab Notebooks</h1>
        <div className="flex items-center gap-4">
          <div className="flex border rounded overflow-hidden">
            <button
              className={`p-2 ${viewType === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewType('grid')}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              className={`p-2 ${viewType === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewType('list')}
            >
              <List size={20} />
            </button>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            <Plus size={20} />
            <span>New Notebook</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : notebooks.length > 0 ? (
        <div className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {notebooks.map((notebook) => (
            <NotebookCard key={notebook.id} notebook={notebook} viewType={viewType} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notebooks yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first lab notebook</p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            <Plus size={20} />
            <span>Create Notebook</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;