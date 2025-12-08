import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Users, Target, Calendar } from 'lucide-react';

const CampaignStats = ({ campaign, progressPercentage, donorsCount = 0 }) => {
  const formattedDeadline = useMemo(() => {
    return new Date(parseInt(campaign.deadline) * 1000).toLocaleDateString('vi-VN');
  }, [campaign.deadline]);

  const remainingAmount = useMemo(() => {
    return parseFloat(campaign.balance || '0');
  }, [campaign.balance]);

  const totalRaised = useMemo(() => {
    return parseFloat(campaign.totalRaised || '0');
  }, [campaign.totalRaised]);

  const usedAmount = useMemo(() => {
    return totalRaised - remainingAmount;
  }, [totalRaised, remainingAmount]);

  return (
    <div className="space-y-4">
      {/* Main Stats Card */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-pink-500" />
          Thống kê chiến dịch
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tiến độ</span>
            <span className="font-semibold text-gray-800">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Đã gây quỹ</span>
            <span className="font-semibold text-gray-800">
              {totalRaised.toFixed(4)} ETH
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Mục tiêu</span>
            <span className="font-semibold text-gray-800">
              {parseFloat(campaign.targetAmount).toFixed(2)} ETH
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Hạn chót
            </span>
            <span className="font-semibold text-gray-800">
              {formattedDeadline}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Người đóng góp
            </span>
            <span className="font-semibold text-gray-800">
              {donorsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Stats Card */}
      <div className="card bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-green-500" />
          Thu chi và số dư
        </h3>
        
        <div className="space-y-4">
            {/* Total Raised */}
            <div className="bg-white/60 rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">Tổng thu</span>
                </div>
                <span className="font-bold text-green-600">
                  +{totalRaised.toFixed(4)} ETH
                </span>
              </div>
            </div>

            {/* Total Used */}
            <div className="bg-white/60 rounded-lg p-3 border border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-600">Đã chi</span>
                </div>
                <span className="font-bold text-red-600">
                  -{usedAmount.toFixed(4)} ETH
                </span>
              </div>
            </div>

            {/* Remaining Balance */}
            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-3 border-2 border-blue-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Số dư hiện tại</span>
                </div>
                <span className="font-bold text-xl text-blue-700">
                  {remainingAmount.toFixed(4)} ETH
                </span>
              </div>
            </div>

            {/* Usage Percentage */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Tỷ lệ sử dụng</span>
                <span className="font-semibold">
                  {totalRaised > 0 ? ((usedAmount / totalRaised) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: totalRaised > 0 ? `${Math.min((usedAmount / totalRaised) * 100, 100)}%` : '0%'
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Đã chi: {usedAmount.toFixed(4)} ETH</span>
                <span>Còn lại: {remainingAmount.toFixed(4)} ETH</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default React.memo(CampaignStats);