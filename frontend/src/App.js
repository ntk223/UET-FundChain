import { CampaignProvider } from './hooks/useCampaign.js';
import { AuthProvider } from './hooks/useAuth.js';
import CampaignPage from './page/CampaignPage.js';

function App() {
  return (
    <AuthProvider>
      <CampaignProvider>
        <CampaignPage />
      </CampaignProvider>
    </AuthProvider>
  );
}

export default App;