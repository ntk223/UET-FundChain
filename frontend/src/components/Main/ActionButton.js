import { Plus, RefreshCw, Globe, AlertCircle } from 'lucide-react';
const ActionButton = ({loading, setShowCreateForm, fetchCampaigns}) => {
    return (
        <>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {!loading ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Tạo chiến dịch mới
            </button>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Kết nối ví để bắt đầu</div>
                <div className="text-yellow-700 text-sm">
                  Bạn cần kết nối MetaMask để tạo campaign hoặc quyên góp
                </div>
              </div>
            </div>
          )}

          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-orange-100 text-orange-600 hover:border-orange-300 hover:bg-orange-50 rounded-xl transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed"          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Làm mới
          </button>
        </div>

        </>
    )
}

export default ActionButton;