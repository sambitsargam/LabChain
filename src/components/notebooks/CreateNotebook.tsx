import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Save } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';
import { useWalrus } from '../../hooks/useWalrus';
import { useSuiTx } from '../../hooks/useSuiTx';

type NotebookData = {
  title: string;
  description: string;
  content: string;
  createdAt: number;
};

const CreateNotebook: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { wallet, connected } = useWallet();
  const { uploadJSON } = useWalrus();
  const { callMove } = useSuiTx();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !wallet) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Prepare notebook data
      const notebookData: NotebookData = {
        title,
        description,
        content,
        createdAt: Date.now(),
      };
      
      // Upload to Walrus
      const cid = await uploadJSON(notebookData);
      console.log('Content uploaded to Walrus with CID:', cid);
      
      // Call Move function to create notebook
      const tx = await callMove('LabNotebook', 'create_notebook', [cid]);
      console.log('Transaction executed:', tx);
      
      // In a real implementation, we would extract the notebook ID from tx.effects
      // For this demo, we'll use a placeholder
      const notebookId = '1';
      
      setIsLoading(false);
      navigate(`/view/${notebookId}`);
    } catch (err) {
      console.error('Error creating notebook:', err);
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to create notebook');
    }
  };
  
  if (!connected) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Create New Lab Notebook</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Notebook Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a title for your notebook"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief description of your research"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Notebook Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="Enter your research notes, data, and observations here"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex items-center gap-2 py-2 px-4 rounded-md ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Create Notebook</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNotebook;