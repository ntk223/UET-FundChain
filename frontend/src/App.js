import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CampaignProvider } from './hooks/useCampaign.js';
import { AuthProvider } from './hooks/useAuth.js';
import ErrorBoundary from './components/ErrorBoundary.js';
import LandingPage from './page/LandingPage.js';
import CampaignPage from './page/CampaignPage.js';
import CampaignDetailPage from './page/CampaignDetailPage.js';
import StatisticsPage from './page/StatisticsPage.js';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <CampaignProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/campaigns" element={<CampaignPage />} />
              <Route path="/campaign/:address" element={<CampaignDetailPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
            </Routes>
          </CampaignProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;