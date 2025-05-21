import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, GitFork, ArrowLeft, AlertCircle } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';
import { useSuiTx } from '../../hooks/useSuiTx';

type NotebookData = {
  id: string;
  title: string;
  owner: string;
};

const ForkNotebook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wallet, connected } = useWallet();
  
  const [notebook, setNotebook] = useState<NotebookData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isForking, setIsForking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { callMove } = useSuiTx();

  useEffect(() => {
    const fetchNotebook = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // In a real implementation, we would fetch the notebook data from the blockchain
        // For this demo, we'll use placeholder data
        setTimeout(() => {
          const dummyData: NotebookData = {
            id: id,
            title: 'Quantum Entanglement Experiments',
            owner: '0x123...abc',
          };
          
          setNotebook(dummyData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching notebook:', err);
        setIsLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to load notebook');
      }
    };

    if (connected) {
      fetchNotebook();
    } else {
      navigate('/');
    }
  }, [id, connected, navigate]);

  const handleFork = async () => {
    if (!connected || !wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!notebook) {
      setError('Notebook data is missing');
      return;
    }
    
    try {
      setIsForking(true);
      setError(null);
      
      // Call Move function to fork notebook
      const tx = await callMove('LabNotebook', 'fork_notebook', [id]);
      console.log('Fork transaction executed:', tx);
      
      // In a real implementation, we would extract the new notebook ID from tx.effects
      // For this demo, we'll use a placeholder
      const newNotebookId = '3';
      
      setIsForking(false);
      navigate(`/view/${newNotebookId}`);
    } catch (err) {
      console.error('Error forking notebook:', err);
      setIsForking(false);
      setError(err instanceof Error ? err.message : 'Failed to fork notebook');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error && !notebook) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error || 'Notebook not found'}</span>
        </div>
        <div className="mt-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!notebook) {
    return null;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/view/${id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
          <ArrowLeft size={18} />
          Back to Notebook
        </Link>
        
        <div className="flex items-center mb-6">
          <GitFork className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Fork Notebook</h1>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">You are about to fork:</h2>
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-lg">{notebook.title}</span>
          </div>
          <p className="text-gray-600 mt-2">
            Owner: {notebook.owner}
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">What does forking do?</h3>
            <p className="text-sm text-gray-600">
              Forking creates a copy of this notebook under your ownership. You'll get a new notebook with all the existing content and version history, which you can then modify independently.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleFork}
            disabled={isForking}
            className={`flex items-center gap-2 py-2 px-4 rounded-md ${
              isForking 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors`}
          >
            {isForking ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Forking...</span>
              </>
            ) : (
              <>
                <GitFork size={18} />
                <span>Fork Notebook</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForkNotebook;