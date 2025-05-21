import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">On-Chain Lab Notebook</h3>
            <p className="text-gray-400 text-sm">Immutable Scientific Research on Sui Blockchain</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <a 
              href="https://github.com/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} LabChain
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;