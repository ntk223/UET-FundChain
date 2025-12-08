import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WalletConnection from "./WalletConnection.js";
import { Globe, Home, List, BarChart3 } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <Globe className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">UET FundChain</h1>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium shadow-md' 
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </button>
            
            <button
              onClick={() => navigate('/campaigns')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/campaigns') 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium shadow-md' 
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <List className="w-4 h-4" />
              Chiến dịch
            </button>
            
            <button
              onClick={() => navigate('/statistics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/statistics') 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium shadow-md' 
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Thống kê
            </button>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            <WalletConnection />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;