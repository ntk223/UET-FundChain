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
  return (
    <div className="space-y-6">
      {proposals.map((proposal, index) => {
        const proposalStatus = votingStatus[index] || {};
        const isOwner = account && account.toLowerCase() === campaign.owner.toLowerCase();

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