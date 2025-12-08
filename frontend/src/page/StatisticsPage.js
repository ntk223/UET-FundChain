import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, CheckCircle, Target, Activity, BarChart3, PieChart } from 'lucide-react';
import Header from '../components/Header/Header.js';
import Footer from '../components/Footer/Footer.js';
import { useCampaign } from '../hooks/useCampaign.js';
import { useAuth } from '../hooks/useAuth.js';

const StatisticsPage = () => {
  const { getAllCampaigns } = useCampaign();
  const { account } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    successfulCampaigns: 0,
    failedCampaigns: 0,
    totalRaised: 0,
    totalTarget: 0,
    successRate: 0,
    totalProposals: 0
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await getAllCampaigns();
      
      console.log('Campaigns loaded:', data);
      
      if (!data || data.length === 0) {
        console.log('No campaigns found');
        setLoading(false);
        return;
      }
      
      setCampaigns(data);

      // Calculate statistics
      const now = Date.now() / 1000;
      let totalRaised = 0;
      let totalTarget = 0;
      let activeCampaigns = 0;
      let successfulCampaigns = 0;
      let failedCampaigns = 0;

      data.forEach(campaign => {
        const raised = parseFloat(campaign.totalRaised);
        const target = parseFloat(campaign.targetAmount);
        const deadline = parseInt(campaign.deadline);

        totalRaised += raised;
        totalTarget += target;

        if (raised >= target) {
          successfulCampaigns++;
        } else if (deadline > now) {
          activeCampaigns++;
        } else {
          failedCampaigns++;
        }
      });

      const successRate = data.length > 0 ? (successfulCampaigns / data.length) * 100 : 0;

      setStats({
        totalCampaigns: data.length,
        activeCampaigns,
        successfulCampaigns,
        failedCampaigns,
        totalRaised,
        totalTarget,
        successRate,
        totalProposals: data.length * 2 // Estimate, would need actual query
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-orange-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <br></br>
      <main className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-800">Thống kê tổng quan</h1>
          </div>
          <p className="text-gray-600">Theo dõi các chỉ số quan trọng của nền tảng gây quỹ</p>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Target}
            title="Tổng số dự án"
            value={stats.totalCampaigns}
            subtitle="Tất cả chiến dịch"
            color="from-pink-500 to-rose-500"
          />
          <StatCard
            icon={Activity}
            title="Đang hoạt động"
            value={stats.activeCampaigns}
            subtitle={`${((stats.activeCampaigns / stats.totalCampaigns) * 100 || 0).toFixed(0)}% tổng số`}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={CheckCircle}
            title="Thành công"
            value={stats.successfulCampaigns}
            subtitle={`Tỷ lệ: ${stats.successRate.toFixed(1)}%`}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Financial Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Tổng đã quyên góp</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.totalRaised.toFixed(2)} ETH</p>
            <p className="text-green-100 text-sm">≈ ${(stats.totalRaised * 2000).toLocaleString()} USD</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Mục tiêu tổng</h3>
            </div>
            <p className="text-4xl font-bold mb-2">{stats.totalTarget.toFixed(2)} ETH</p>
            <p className="text-orange-100 text-sm">
              Đã đạt {((stats.totalRaised / stats.totalTarget) * 100 || 0).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Campaign Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-bold text-gray-800">Phân bố trạng thái</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
                  <span className="text-sm font-bold text-blue-600">{stats.activeCampaigns}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${(stats.activeCampaigns / stats.totalCampaigns) * 100 || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Thành công</span>
                  <span className="text-sm font-bold text-green-600">{stats.successfulCampaigns}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${(stats.successfulCampaigns / stats.totalCampaigns) * 100 || 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Thất bại</span>
                  <span className="text-sm font-bold text-red-600">{stats.failedCampaigns}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-rose-500 h-3 rounded-full transition-all"
                    style={{ width: `${(stats.failedCampaigns / stats.totalCampaigns) * 100 || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-pink-500" />
              <h2 className="text-xl font-bold text-gray-800">Top Chiến dịch</h2>
            </div>
            <div className="space-y-3">
              {campaigns
                .sort((a, b) => parseFloat(b.totalRaised) - parseFloat(a.totalRaised))
                .slice(0, 5)
                .map((campaign, index) => {
                  const progress = (parseFloat(campaign.totalRaised) / parseFloat(campaign.targetAmount)) * 100;
                  return (
                    <div key={campaign.address} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {campaign.campaignDescription || `Campaign ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          {parseFloat(campaign.totalRaised).toFixed(2)} / {parseFloat(campaign.targetAmount).toFixed(2)} ETH
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${
                          progress >= 100 ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Các chỉ số khác</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-500 mb-1">
                {((stats.totalRaised / stats.totalCampaigns) || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">ETH trung bình/dự án</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500 mb-1">
                {stats.successRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Tỷ lệ thành công</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-500 mb-1">
                {stats.totalProposals}
              </p>
              <p className="text-sm text-gray-600">Tổng đề xuất</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StatisticsPage;
