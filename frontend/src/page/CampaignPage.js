import React, { useState } from 'react';
import { Plus, RefreshCw, Globe, AlertCircle } from 'lucide-react';
// import WalletConnection from '../components/WalletConnection.js';
import CreateCampaign from '../components/Main/CreateCampaign.js';
import CampaignCard from '../components/Main/CampaignCard.js';
import {useCampaign } from '../hooks/useCampaign.js';
import Header from '../components/Header/Header.js';
import Footer from '../components/Footer/Footer.js';
// import Statistic from '../components/layout/Statistic.js';
const CampaignPage = () => {
  const {
    campaigns,
    // loadCampaigns,
  } = useCampaign();
  const loadCampaigns = () => {}
  let loading = false
  const userAccount = null
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCampaignCreated = () => {
    loadCampaigns();
  };

  const handleCampaignUpdate = () => {
    loadCampaigns();
  };

  // const stats = getStatistics();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nền tảng Crowdfunding phi tập trung
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Tạo và hỗ trợ các chiến dịch gây quỹ trên blockchain một cách minh bạch và an toàn
          </p>
        </div>

        {/* Statistics */}
        {/* <Statistic stats={stats} /> */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {true ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4" />
              Tạo Campaign Mới
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
            onClick={loadCampaigns}
            // disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Làm mới
          </button>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
            <span className="ml-3 text-white">Đang tải campaigns...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="card text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Chưa có campaign nào
            </h3>
            <p className="text-gray-600 mb-4">
              Hãy là người đầu tiên tạo campaign trên platform này!
            </p>
            {userAccount && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" />
                Tạo Campaign Đầu Tiên
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.address}
                campaign={campaign}
                userAccount={userAccount}
                onUpdate={handleCampaignUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <CreateCampaign
          onCampaignCreated={handleCampaignCreated}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default CampaignPage;