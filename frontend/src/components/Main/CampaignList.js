import CampaignCard from "./CampaignCard.js";
import { useCampaign } from "../../hooks/useCampaign.js";
const CampaignList = (campaigns) => {
    const {campaigns} = useCampaign();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard campaign={campaign} />
          ))}
        </div>
    )
}

export default CampaignList;