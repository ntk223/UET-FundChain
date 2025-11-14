import React, { createContext, useContext, useState, useEffect } from 'react';
import contractService from '../utils/contractService.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  // Kiểm tra connection lúc mount
  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    } catch (error) {
      console.log('Không có connection sẵn');
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    try {
      const address = await contractService.init();
      const bal = await contractService.getBalance(address);

      setAccount(address);
      setBalance(parseFloat(bal).toFixed(4));
      toast.success('Kết nối ví thành công!');
    } catch (error) {
      console.error('Lỗi kết nối ví:', error);
      toast.error(error.message || 'Không thể kết nối ví');
    }
    setLoading(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    toast.success('Đã ngắt kết nối ví');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        balance,
        loading,
        connectWallet,
        disconnectWallet,
        formatAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để dễ dùng trong component
export const useAuth = () => useContext(AuthContext);
