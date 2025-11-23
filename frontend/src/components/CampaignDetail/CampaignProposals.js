import { Plus, Vote } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useCampaign } from '../../hooks/useCampaign.js';
import { useEffect, useState } from 'react';
const CampaignProposals = ({ campaign, status, onCreateProposal }) => {
  const { account } = useAuth();
  const { getAllProposals, vote } = useCampaign();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProposals = async () => {
      const data = await getAllProposals(campaign.address);
      setProposals(data);
    };
    fetchProposals();
  }, [campaign.address, getAllProposals]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Đang tải đề xuất...</p>
      </div>
    );
  }

  if (proposals.length === 0) {}
  return (
    <div className="space-y-4">
      {account === campaign.owner && status.status === 'success' && (
        <div className="bg-gradient-to-r from-[#667eea]/10 to-[#764ba2]/10 border border-[#667eea]/30 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-gray-700 mb-3">
            Campaign đã thành công! Bạn có thể tạo đề xuất để sử dụng số tiền đã gây được.
          </p>
          <button
            onClick={onCreateProposal}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Tạo đề xuất mới
          </button>
        </div>
      )}
      
      <div className="text-center py-8 text-gray-500">

        {proposals.length === 0 ? (
          <>
            <Vote className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có đề xuất nào được tạo</p>
            <p className="text-sm">Đề xuất sẽ xuất hiện khi campaign thành công</p>
          </>
        ) : (
          proposals.map((proposal, index) => (

            <div key={index} className="border border-gray-300 rounded-lg p-4 ">
              <h4 className="font-semibold text-gray-800 mb-2 text-left">Đề xuất #{index + 1}</h4>
              <p className="text-gray-700 mb-1 text-left"><span className="font-medium">Mô tả:</span> {proposal.description}</p>
              <p className="text-gray-700 mb-1 text-left"><span className="font-medium">Số tiền (ETH):</span> {proposal.amount}</p>
              <p className="text-gray-700 text-left"><span className="font-medium">Người nhận:</span> {proposal.recipient}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => vote(campaign.address, index, true)} className="btn btn-primary btn-sm hover:bg-blue-700 transition-colors">Ủng hộ</button>
                <button onClick={() => vote(campaign.address, index, false)} className="btn btn-outline btn-sm hover:bg-gray-200 transition-colors">Không ủng hộ</button>
              </div>


            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignProposals;