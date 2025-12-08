import React, { useState, useEffect } from 'react';
import { RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { useCampaign } from '../../hooks/useCampaign.js';
import { useAuth } from '../../hooks/useAuth.js';
import contractService from '../../utils/contractService.js';

const RefundButton = ({ campaign, onRefundSuccess }) => {
  const { refund } = useCampaign();
  const { account } = useAuth();
  const [loading, setLoading] = useState(false);
  const [userContribution, setUserContribution] = useState('0');
  const [loadingContribution, setLoadingContribution] = useState(true);

  // Load user contribution từ smart contract
  useEffect(() => {
    const loadUserContribution = async () => {
      if (!campaign?.address || !account) {
        setUserContribution('0');
        setLoadingContribution(false);
        return;
      }

      try {
        setLoadingContribution(true);
        const contribution = await contractService.getUserContribution(campaign.address, account);
        setUserContribution(contribution);
      } catch (error) {
        console.error('Lỗi lấy contribution:', error);
        setUserContribution('0');
      } finally {
        setLoadingContribution(false);
      }
    };

    loadUserContribution();
  }, [campaign?.address, account]);

  // Kiểm tra điều kiện refund
  const canRefund = () => {
    if (!campaign) return false;
    
    const now = Date.now() / 1000;
    const deadline = parseInt(campaign.deadline);
    const targetAmount = parseFloat(campaign.targetAmount);
    const totalRaised = parseFloat(campaign.totalRaised);
    
    // Chỉ refund khi: campaign đã kết thúc VÀ không đạt target
    const campaignEnded = now > deadline;
    const campaignFailed = totalRaised < targetAmount;
    
    return campaignEnded && campaignFailed;
  };

  // Kiểm tra user có contribution không
  const hasContribution = parseFloat(userContribution) > 0;

  const handleRefund = async () => {
    if (!account) {
      return;
    }

    if (!hasContribution) {
      return;
    }

    try {
      setLoading(true);
      const success = await refund(campaign.address);
      if (success && onRefundSuccess) {
        onRefundSuccess();
      }
    } catch (error) {
      console.error('Lỗi refund:', error);
    } finally {
      setLoading(false);
    }
  };

  // Không hiển thị button nếu không đủ điều kiện refund
  if (!canRefund()) {
    return null;
  }

  // Hiển thị loading khi đang tải contribution
  if (loadingContribution) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          <span className="text-sm text-gray-600">Đang kiểm tra đóng góp...</span>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo nếu user chưa đóng góp
  if (!hasContribution) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Chiến dịch đã thất bại
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Bạn chưa đóng góp cho chiến dịch này nên không thể hoàn tiền.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị button refund
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-red-800">
            Chiến dịch đã thất bại
          </p>
          <p className="text-sm text-red-700 mt-1">
            Chiến dịch không đạt mục tiêu. Bạn có thể yêu cầu hoàn tiền.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">Số tiền đóng góp của bạn:</p>
        <p className="text-2xl font-bold text-gray-800">
          {parseFloat(userContribution).toFixed(4)} ETH
        </p>
      </div>

      <button
        onClick={handleRefund}
        disabled={loading}
        className="w-full btn btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <RotateCcw className="w-5 h-5" />
            Yêu cầu hoàn tiền
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-3">
        Số tiền sẽ được hoàn lại trực tiếp vào ví của bạn
      </p>
    </div>
  );
};

export default RefundButton;
