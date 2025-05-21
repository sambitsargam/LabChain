import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Edit, GitFork, Clock, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useSuiClient } from '../../hooks/useSuiTx';
import { fetchWalrusData } from '../../hooks/useWalrus';

type NotebookData = {
  title: string;
  description: string;
  content: string;
  createdAt: number;
};

type Commit = {
  id: string;
  cid: string;
  timestamp: number;
};

const ViewNotebook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notebook, setNotebook] = useState<NotebookData | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [currentCommit, setCurrentCommit] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const suiClient = useSuiClient();

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
        // Simulate blockchain and Walrus API calls
        setTimeout(async () => {
          // Simulated commits
          const dummyCommits = [
            { id: '0', cid: 'cid1', timestamp: Date.now() - 86400000 },
            { id: '1', cid: 'cid2', timestamp: Date.now() },
          ];
          setCommits(dummyCommits);
          setCurrentCommit('1'); // Latest commit

          // Simulated notebook data
          const dummyData: NotebookData = {
            title: 'Quantum Entanglement Experiments',
            description: 'Research on Bell inequality violations in quantum systems',
            content: `# Quantum Entanglement Experiments\n\n## Objective\nTo demonstrate quantum entanglement through violation of Bell inequalities\n\n## Materials\n- Parametric down-conversion crystal\n- Single photon detectors (x4)\n- Polarizing beam splitters\n- Half-wave plates\n\n## Method\n1. Generate entangled photon pairs\n2. Measure coincidence rates at various angles\n3. Calculate correlation coefficient\n4. Compare with Bell's inequality prediction\n\n## Results\nMeasured S value: 2.82 ± 0.05\nBell inequality limit: 2\nClassical limit violated by >16 standard deviations\n\n## Conclusion\nOur experiment clearly demonstrates quantum entanglement through a statistically significant violation of Bell's inequality.`,
            createdAt: Date.now() - 86400000,
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

    fetchNotebook();
  }, [id, suiClient]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const loadCommitVersion = (commitId: string) => {
    setCurrentCommit(commitId);
    // In a real implementation, we would:
    // 1. Find the commit with the given ID
    // 2. Get its CID
    // 3. Fetch the notebook data from Walrus
    
    // For this demo, we'll update the content to simulate version differences
    if (commitId === '0') {
      setNotebook(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          content: `# Quantum Entanglement Experiments\n\n## Objective\nTo demonstrate quantum entanglement through violation of Bell inequalities\n\n## Materials\n- Parametric down-conversion crystal\n- Single photon detectors (x2)\n- Polarizing beam splitters\n\n## Method\n1. Generate entangled photon pairs\n2. Measure coincidence rates at various angles\n\n## Results\nPreliminary data collection in progress\n\n## Next Steps\nComplete measurements and analyze results`,
          createdAt: Date.now() - 86400000
        };
      });
    } else {
      setNotebook(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          content: `# Quantum Entanglement Experiments\n\n## Objective\nTo demonstrate quantum entanglement through violation of Bell inequalities\n\n## Materials\n- Parametric down-conversion crystal\n- Single photon detectors (x4)\n- Polarizing beam splitters\n- Half-wave plates\n\n## Method\n1. Generate entangled photon pairs\n2. Measure coincidence rates at various angles\n3. Calculate correlation coefficient\n4. Compare with Bell's inequality prediction\n\n## Results\nMeasured S value: 2.82 ± 0.05\nBell inequality limit: 2\nClassical limit violated by >16 standard deviations\n\n## Conclusion\nOur experiment clearly demonstrates quantum entanglement through a statistically significant violation of Bell's inequality.`,
          createdAt: Date.now()
        };
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !notebook) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error || 'Notebook not found'}
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
        <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">{notebook.title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              to={`/edit/${id}`}
              className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Edit size={18} />
              <span>Edit</span>
            </Link>
            <Link
              to={`/fork/${id}`}
              className="flex items-center gap-2 py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <GitFork size={18} />
              <span>Fork</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              <span className="text-blue-800">
                Version {currentCommit} - {formatDate(notebook.createdAt)}
              </span>
            </div>
            
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              {showHistory ? (
                <>
                  <ChevronUp size={18} />
                  <span>Hide History</span>
                </>
              ) : (
                <>
                  <ChevronDown size={18} />
                  <span>Show History</span>
                </>
              )}
            </button>
          </div>
          
          {showHistory && (
            <div className="mt-4 border-t border-blue-100 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Version History</h3>
              <div className="space-y-2">
                {commits.map((commit) => (
                  <button
                    key={commit.id}
                    onClick={() => loadCommitVersion(commit.id)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      currentCommit === commit.id 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-blue-50 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>Version {commit.id}</span>
                      <span className="text-xs text-gray-500">{formatDate(commit.timestamp)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {notebook.description && (
          <p className="text-gray-600 mb-6">{notebook.description}</p>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="prose max-w-none">
          {/* In a real implementation, we would render markdown content */}
          <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
            {notebook.content}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ViewNotebook;