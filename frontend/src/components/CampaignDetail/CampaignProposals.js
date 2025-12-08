import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useCampaign } from '../../hooks/useCampaign.js';
import contractService from '../../utils/contractService.js';
import toast from 'react-hot-toast';

// Import components
import VotersModal from './VotersModal.js';
import CreateProposalBanner from './CreateProposalBanner.js';
import ProposalLoadingState from './ProposalLoadingState.js';
import EmptyProposalsState from './EmptyProposalsState.js';
import ProposalsList from './ProposalsList.js';
const CampaignProposals = ({ campaign, status, onCreateProposal, onProposalExecuted }) => {
  const { account } = useAuth();
  const { getAllProposals, vote, executeProposal } = useCampaign();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingStatus, setVotingStatus] = useState({}); // Theo dõi trạng thái vote cho từng proposal
  const [executing, setExecuting] = useState({}); // Theo dõi trạng thái execute
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showVotersModal, setShowVotersModal] = useState(false);

  useEffect(() => {
    const fetchProposals = async () => {
      if (!campaign?.address) return;
      
      setLoading(true);
      try {
        const data = await getAllProposals(campaign.address);
        setProposals(data);
        
        console.log('Fetched proposals:', data);
        
        // Kiểm tra trạng thái cho từng proposal
        if (data.length > 0) {
          const votingStatusMap = {};
          
          // Lấy donor count một lần
          const donorCount = await contractService.getDonorCount(campaign.address);
          
          console.log('Donor count:', donorCount);
          
          for (let i = 0; i < data.length; i++) {
            // Check hasVoted chỉ khi có account
            const hasVoted = account 
              ? await contractService.hasVoted(campaign.address, i, account)
              : false;
            
            // Check canExecute cho tất cả proposals (không phụ thuộc account)
            const canExecute = await contractService.canExecuteProposal(campaign.address, i);
            
            // Lấy voter count cho proposal này
            const voterCount = await contractService.getVoterCount(campaign.address, i);
            
            // Lấy execution conditions chi tiết
            const conditions = await contractService.getExecutionConditions(campaign.address, i);
            
            console.log(`Proposal #${i} status:`, {
              hasVoted,
              canExecute,
              donorCount,
              voterCount,
              conditions
            });
            
            votingStatusMap[i] = { 
              hasVoted, 
              canExecute,
              donorCount: parseInt(donorCount),
              voterCount: parseInt(voterCount),
              conditions: conditions || null // Handle null conditions gracefully
            };
          }
          
          console.log('Final votingStatusMap:', votingStatusMap);
          setVotingStatus(votingStatusMap);
        }
      } catch (error) {
        console.error('Error fetching proposals:', error);
        toast.error('Không thể tải danh sách đề xuất');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProposals();
  }, [campaign.address, getAllProposals, account]);

  // Xử lý vote
  const handleVote = async (proposalId, support) => {
    if (!account) {
      toast.error('Vui lòng kết nối ví');
      return;
    }

    if (votingStatus[proposalId]?.hasVoted) {
      toast.error('Bạn đã vote cho đề xuất này rồi');
      return;
    }

    try {
      setVotingStatus(prev => ({
        ...prev,
        [proposalId]: { ...prev[proposalId], voting: true }
      }));

      await vote(campaign.address, proposalId, support);
      toast.success(`Vote ${support ? 'ủng hộ' : 'phản đối'} thành công!`);
      
      // Refresh data
      setTimeout(() => {
        window.location.reload(); // Temporary solution, có thể optimize sau
      }, 2000);

    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Lỗi khi vote: ' + error.message);
    } finally {
      setVotingStatus(prev => ({
        ...prev,
        [proposalId]: { ...prev[proposalId], voting: false }
      }));
    }
  };

  // Xử lý execute proposal
  const handleExecute = async (proposalId) => {
    if (!account || account.toLowerCase() !== campaign.owner.toLowerCase()) {
      toast.error('Chỉ chủ campaign mới có thể thực hiện đề xuất');
      return;
    }

    try {
      setExecuting(prev => ({ ...prev, [proposalId]: true }));
      
      await executeProposal(campaign.address, proposalId);
      toast.success('Thực hiện đề xuất thành công!');
      
      // Refresh campaign data to update balance
      if (onProposalExecuted) {
        await onProposalExecuted();
      }
      
      // Refresh proposals list
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Execute error:', error);
      toast.error('Lỗi khi thực hiện đề xuất: ' + error.message);
    } finally {
      setExecuting(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  // Hiển thị voters modal
  const showVoters = (proposal, proposalId) => {
    const voterCount = votingStatus[proposalId]?.voterCount || 0;
    setSelectedProposal({ ...proposal, proposalId, voterCount });
    setShowVotersModal(true);
  };

  if (loading) {
    return <ProposalLoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Owner Actions - Create Proposal */}
      {account && campaign.owner && account.toLowerCase() === campaign.owner.toLowerCase() && status.status === 'success' && (
        <CreateProposalBanner onCreateProposal={onCreateProposal} />
      )}
      
      {/* Proposals Content */}
      {proposals.length === 0 ? (
        <EmptyProposalsState />
      ) : (
        <ProposalsList
          proposals={proposals}
          votingStatus={votingStatus}
          executing={executing}
          account={account}
          campaign={campaign}
          onVote={handleVote}
          onExecute={handleExecute}
          onShowVoters={showVoters}
        />
      )}

      {/* Voters Modal */}
      {showVotersModal && selectedProposal && (
        <VotersModal
          isOpen={showVotersModal}
          onClose={() => setShowVotersModal(false)}
          proposal={selectedProposal}
          proposalId={selectedProposal.proposalId}
          voterCount={selectedProposal.voterCount}
        />
      )}
    </div>
  );
};

export default CampaignProposals;