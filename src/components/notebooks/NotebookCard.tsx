import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Edit, GitFork, Clock } from 'lucide-react';

type NotebookProps = {
  notebook: {
    id: string;
    type: string;
    owner: string;
    head: string;
  };
  viewType: 'grid' | 'list';
};

const NotebookCard: React.FC<NotebookProps> = ({ notebook, viewType }) => {
  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (viewType === 'list') {
    return (
      <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="mr-4">
          <BookOpen className="h-10 w-10 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{notebook.type} Notebook</h3>
          <p className="text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              Version {notebook.head}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/view/${notebook.id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="View Notebook"
          >
            <BookOpen size={20} />
          </Link>
          <Link
            to={`/edit/${notebook.id}`}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit Notebook"
          >
            <Edit size={20} />
          </Link>
          <Link
            to={`/fork/${notebook.id}`}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
            title="Fork Notebook"
          >
            <GitFork size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Version {notebook.head}
          </span>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">{notebook.type} Notebook</h3>
        <p className="text-sm text-gray-500 mb-4">
          Owner: {truncateAddress(notebook.owner)}
        </p>
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <Link
            to={`/view/${notebook.id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center gap-1"
          >
            <BookOpen size={18} />
            View
          </Link>
          <div className="flex gap-3">
            <Link
              to={`/edit/${notebook.id}`}
              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
            >
              <Edit size={18} />
              Edit
            </Link>
            <Link
              to={`/fork/${notebook.id}`}
              className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
            >
              <GitFork size={18} />
              Fork
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookCard;