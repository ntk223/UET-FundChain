import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DonateForm from './DonateForm.js';
import { Target, Calendar, User, CheckCheck, Clock, DollarSign, Users, AlertCircle, RotateCcw } from "lucide-react";
import { useCampaign } from '../../hooks/useCampaign.js';
import { useAuth } from '../../hooks/useAuth.js';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const { formatAddress } = useAuth();
  const { getCampaignDetails } = useCampaign();
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockchainTime, setBlockchainTime] = useState(null);
  const [showDonateForm, setShowDonateForm] = useState(false);

  useEffect(() => {
    const loadCampaignDetails = async () => {
      if (campaign?.address) {
        try {
          setLoading(true);
          const details = await getCampaignDetails(campaign.address);
          setCampaignDetails(details);
        } catch (error) {
          console.error('Lỗi tải chi tiết campaign:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCampaignDetails();
  }, [campaign?.address, getCampaignDetails]);

  // Lấy blockchain time
  useEffect(() => {
    const fetchBlockchainTime = async () => {
      try {
        const contractService = (await import('../../utils/contractService.js')).default;
        const time = await contractService.getBlockchainTime();
        setBlockchainTime(time);
      } catch (error) {
        console.error('Error getting blockchain time:', error);
      }
    };

    fetchBlockchainTime();
    // Update mỗi 30 giây
    const interval = setInterval(fetchBlockchainTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Tính toán phần trăm hoàn thành
  const getProgressPercentage = () => {
    if (!campaignDetails) return 0;
    const percentage = (parseFloat(campaignDetails.totalRaised) / parseFloat(campaignDetails.targetAmount)) * 100;
    return Math.min(percentage, 100);
  };

  // Kiểm tra trạng thái campaign
  const getCampaignStatus = () => {
    if (!campaignDetails || blockchainTime === null) return { status: 'loading', color: 'gray', text: 'Đang tải...' };
    
    const now = blockchainTime;
    const deadline = parseInt(campaignDetails.deadline);
    const targetAmount = parseFloat(campaignDetails.targetAmount);
    const totalRaised = parseFloat(campaignDetails.totalRaised);

    if (totalRaised >= targetAmount) {
      return { status: 'success', color: 'green', text: 'Thành công' };
    } else if (now > deadline) {
      return { status: 'failed', color: 'red', text: 'Thất bại' };
    } else {
      return { status: 'active', color: 'blue', text: 'Đang hoạt động' };
    }
  };

  // Tính thời gian còn lại
  const getTimeRemaining = () => {
    if (!campaignDetails || blockchainTime === null) return '';
    
    const now = blockchainTime;
    const deadline = parseInt(campaignDetails.deadline);
    const timeLeft = deadline - now;

    if (timeLeft <= 0) return 'Đã hết hạn';

    const days = Math.floor(timeLeft / (24 * 3600));
    const hours = Math.floor((timeLeft % (24 * 3600)) / 3600);

    if (days > 0) return `${days} ngày`;
    if (hours > 0) return `${hours} giờ`;
    return 'Sắp hết hạn';
  };

  const status = getCampaignStatus();
  const progressPercentage = getProgressPercentage();

  if (loading || !campaignDetails) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse min-h-[320px] shadow-lg">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-100 rounded w-full"></div>
          <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 min-h-[320px] flex flex-col">
      {/* Header với status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium">{formatAddress(campaignDetails.owner)}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status.color === 'green' ? 'bg-green-100 text-green-600 border border-green-200' :
          status.color === 'red' ? 'bg-red-100 text-red-600 border border-red-200' :
          'bg-blue-100 text-blue-600 border border-blue-200'
        }`}>
          {status.text}
        </span>
      </div>

      {/* Mô tả campaign */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-3">
          {campaignDetails.campaignDescription || 'Không có mô tả'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 text-xs">Tiến độ</span>
          <span className="text-gray-800 text-xs font-medium">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              status.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              status.color === 'red' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
              'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="space-y-3 flex-1">
        <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" />
            <span>Mục tiêu: <span className="font-medium text-gray-800">{parseFloat(campaignDetails.targetAmount).toFixed(2)} ETH</span></span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span>Đã gây quỹ: <span className="font-medium text-gray-800">{parseFloat(campaignDetails.totalRaised).toFixed(4)} ETH</span></span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Người đóng góp: <span className="font-medium text-gray-800">{campaignDetails.donorsCount || 0}</span></span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Thời gian: <span className="font-medium text-gray-800">{getTimeRemaining()}</span></span>
          </div>
        </div>
      </div>

      {/* Ngày deadline */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
          <Calendar className="w-3 h-3" />
          <span>Hạn chót: {new Date(parseInt(campaignDetails.deadline) * 1000).toLocaleDateString('vi-VN')}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Nút Xem Chi Tiết: Tone nhẹ (Secondary) để làm nền cho nút Quyên góp */}
            <button
              onClick={() => navigate(`/campaign/${campaign.address}`)}
              className="flex-1 px-4 py-2 bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 hover:border-orange-200 rounded-xl font-medium transition-all duration-200 text-sm"
            >
              {status.status === 'failed' ? 'Xem & Hoàn tiền' : 'Xem Chi Tiết'}
            </button>

            {/* Nút Quyên góp: Tone Gradient nổi bật (Primary Action) */}
            {status.status === 'active' && (
              <button
                onClick={() => { setShowDonateForm(true); }}
                className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-xl font-medium shadow-md shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-200 text-sm transform hover:-translate-y-0.5"
              >
                Quyên góp
              </button>
            )}

            {/* Badge hoàn tiền cho campaign thất bại */}
            {status.status === 'failed' && (
              <div className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
                <RotateCcw className="w-3 h-3" />
                Có thể hoàn tiền
              </div>
            )}

        </div>
          {showDonateForm && (
            <DonateForm
              campaignAddress={campaign.address}
              onClose={() => setShowDonateForm(false)}
            />
          )}
      </div>
    </div>
  )
};

export default CampaignCard;