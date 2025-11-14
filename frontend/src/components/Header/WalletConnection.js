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
      <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-white" />
          <div className="text-white">
            <div className="font-medium">{formatAddress(account)}</div>
            <div className="text-sm opacity-80">{parseFloat(balance).toFixed(4)} ETH</div>
          </div>
        </div>
        <button
          onClick={disconnectWallet}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Ngắt kết nối"
        >
          <LogOut className="w-4 h-4 text-white" />
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
