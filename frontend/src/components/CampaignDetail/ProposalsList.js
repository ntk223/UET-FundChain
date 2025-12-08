import React from 'react';
import ProposalCard from './ProposalCard.js';

const ProposalsList = ({
  proposals,
  votingStatus,
  executing,
  account,
  campaign,
  onVote,
  onExecute,
  onShowVoters
}) => {
  // Debug log
  console.log('ProposalsList Debug:', {
    account,
    campaignOwner: campaign?.owner,
    proposalsCount: proposals.length,
    votingStatusKeys: Object.keys(votingStatus)
  });

  return (
    <div className="space-y-6">
      {proposals.map((proposal, index) => {
        const proposalStatus = votingStatus[index] || {};
        const isOwner = account && campaign?.owner && account.toLowerCase() === campaign.owner.toLowerCase();

        console.log(`Proposal #${index} isOwner check:`, {
          account,
          owner: campaign?.owner,
          isOwner,
          proposalStatus
        });

        return (
          <ProposalCard
            key={index}
            proposal={proposal}
            index={index}
            proposalStatus={proposalStatus}
            isOwner={isOwner}
            executing={executing}
            onVote={onVote}
            onExecute={onExecute}
            onShowVoters={onShowVoters}
          />
        );
      })}
    </div>
  );
};

export default ProposalsList;