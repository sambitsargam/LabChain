import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import CreateNotebook from './components/notebooks/CreateNotebook';
import ViewNotebook from './components/notebooks/ViewNotebook';
import EditNotebook from './components/notebooks/EditNotebook';
import ForkNotebook from './components/notebooks/ForkNotebook';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateNotebook />} />
              <Route path="/view/:id" element={<ViewNotebook />} />
              <Route path="/edit/:id" element={<EditNotebook />} />
              <Route path="/fork/:id" element={<ForkNotebook />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;