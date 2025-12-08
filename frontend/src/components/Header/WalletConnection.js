import { Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

const WalletConnection = () => {
  const { 
    account,
    balance,
    loading,
    connectWallet,
    disconnectWallet,
    formatAddress,
  } = useAuth();


  if (account) {
    return (
      <div className="flex items-center gap-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-3 border border-orange-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-pink-500" />
          <div className="text-gray-800">
            <div className="font-medium">{formatAddress(account)}</div>
            <div className="text-sm text-gray-600">{parseFloat(balance).toFixed(4)} ETH</div>
          </div>
        </div>
        <button
          onClick={disconnectWallet}
          className="p-2 hover:bg-pink-100 rounded-lg transition-colors"
          title="Ngắt kết nối"
        >
          <LogOut className="w-4 h-4 text-pink-500" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={loading}
      className="btn btn-primary"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
      ) : (
        <Wallet className="w-4 h-4" />
      )}
      {loading ? 'Đang kết nối...' : 'Kết nối ví'}
    </button>
  );
};

export default WalletConnection;
