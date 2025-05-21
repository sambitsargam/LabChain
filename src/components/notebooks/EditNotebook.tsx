import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useWallet } from '@suiet/wallet-kit';
import { diffTexts } from '../../utils/diff';
import { useWalrus } from '../../hooks/useWalrus';
import { useSuiTx } from '../../hooks/useSuiTx';

type NotebookData = {
  title: string;
  description: string;
  content: string;
  createdAt: number;
};

const EditNotebook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { wallet, connected } = useWallet();
  
  const [originalData, setOriginalData] = useState<NotebookData | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { uploadJSON } = useWalrus();
  const { callMove } = useSuiTx();

  useEffect(() => {
    const fetchNotebook = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        // In a real implementation, we would:
        // 1. Fetch the Notebook object by ID from the blockchain
        // 2. Get the head commit ID
        // 3. Fetch the Commit object for that ID to get the CID
        // 4. Fetch the notebook data from Walrus using the CID

        // For this demo, we'll use placeholder data
        setTimeout(() => {
          const dummyData: NotebookData = {
            title: 'Quantum Entanglement Experiments',
            description: 'Research on Bell inequality violations in quantum systems',
            content: `# Quantum Entanglement Experiments\n\n## Objective\nTo demonstrate quantum entanglement through violation of Bell inequalities\n\n## Materials\n- Parametric down-conversion crystal\n- Single photon detectors (x4)\n- Polarizing beam splitters\n- Half-wave plates\n\n## Method\n1. Generate entangled photon pairs\n2. Measure coincidence rates at various angles\n3. Calculate correlation coefficient\n4. Compare with Bell's inequality prediction\n\n## Results\nMeasured S value: 2.82 ± 0.05\nBell inequality limit: 2\nClassical limit violated by >16 standard deviations\n\n## Conclusion\nOur experiment clearly demonstrates quantum entanglement through a statistically significant violation of Bell's inequality.`,
            createdAt: Date.now() - 86400000,
          };
          
          setOriginalData(dummyData);
          setTitle(dummyData.title);
          setDescription(dummyData.description);
          setContent(dummyData.content);
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
    
    if (!originalData) {
      setError('Original notebook data is missing');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Compare original and new content to create a diff
      const contentDiff = diffTexts(originalData.content, content);
      
      // Prepare updated notebook data with diff
      const updateData = {
        title,
        description,
        content,
        diff: contentDiff,
        updatedAt: Date.now(),
        previousVersion: id,
      };
      
      // Upload to Walrus
      const cid = await uploadJSON(updateData);
      console.log('Update uploaded to Walrus with CID:', cid);
      
      // Call Move function to add commit
      const tx = await callMove('LabNotebook', 'add_commit', [id, cid]);
      console.log('Transaction executed:', tx);
      
      setIsSaving(false);
      navigate(`/view/${id}`);
    } catch (err) {
      console.error('Error updating notebook:', err);
      setIsSaving(false);
      setError(err instanceof Error ? err.message : 'Failed to update notebook');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error && !originalData) {
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
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to={`/view/${id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
          <ArrowLeft size={18} />
          Back to Notebook
        </Link>
        
        <div className="flex items-center mb-6">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Notebook</h1>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
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
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center gap-2 py-2 px-4 rounded-md ${
              isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } transition-colors`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNotebook;