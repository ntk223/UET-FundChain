import React from 'react';
import { Check, X, Users, Play, Loader2 } from 'lucide-react';

const ProposalCard = ({
  proposal,
  index,
  proposalStatus,
  isOwner,
  executing,
  onVote,
  onExecute,
  onShowVoters
}) => {
  const totalVotes = parseFloat(proposal.voteYes) + parseFloat(proposal.voteNo);
  const yesPercentage = totalVotes > 0 ? (parseFloat(proposal.voteYes) / totalVotes) * 100 : 0;

  // Debug log
  console.log(`Proposal #${index}:`, {
    executed: proposal.executed,
    isOwner,
    canExecute: proposalStatus.canExecute,
    showExecuteButton: !proposal.executed && isOwner
  });

  return (
    <div 
      className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-slideInFromLeft hover-lift"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Proposal Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-2 transition-colors duration-300">
            Đề xuất #{index + 1}
          </h4>
          <p className="text-gray-700 mb-3 transition-colors duration-300">
            <span className="font-medium">Mô tả:</span> {proposal.description}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-500 transform ${
          proposal.executed 
            ? 'bg-green-100 text-green-800 animate-pulse' 
            : yesPercentage > 50
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {proposal.executed 
            ? '✅ Đã thực hiện' 
            : yesPercentage > 50 
            ? '🟢 Được thông qua'
            : '⏳ Đang bình chọn'}
        </div>
      </div>

      {/* Proposal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
          <span className="text-gray-600 text-sm">Số tiền yêu cầu:</span>
          <div className="font-bold text-gray-800 text-lg">
            {parseFloat(proposal.amount).toFixed(3)} ETH
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
          <span className="text-gray-600 text-sm">Người nhận:</span>
          <div className="font-mono text-xs text-gray-800 break-all">
            {proposal.recipient}
          </div>
        </div>
      </div>

      {/* Vote Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="transition-all duration-500">
            Ủng hộ: {yesPercentage.toFixed(1)}%
          </span>
          <span className="transition-all duration-500">
            Phản đối: {(100 - yesPercentage).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${yesPercentage}%` }}
          />
        </div>
      </div>

      {/* Voted Status Message */}
      {proposalStatus.hasVoted && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">
            Bạn đã vote đề xuất này
          </span>
        </div>
      )}

      {/* Can Execute Status for Owner */}
      {!proposal.executed && isOwner && (
        <div className={`mb-4 p-3 rounded-lg animate-fadeIn ${
          proposalStatus.canExecute 
            ? 'bg-green-50 border border-green-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          {proposalStatus.canExecute ? (
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">
                  ✅ Đề xuất đã đủ điều kiện thực thi
                </p>
                {proposalStatus.voterCount !== undefined && proposalStatus.donorCount !== undefined && (
                  <p className="text-green-700 text-xs mt-1">
                    📊 Quorum: {proposalStatus.voterCount}/{proposalStatus.donorCount} donors đã vote ({((proposalStatus.voterCount / proposalStatus.donorCount) * 100).toFixed(1)}%)
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-yellow-800 text-sm flex-1">
                <p className="font-medium mb-2">⏳ Các điều kiện thực thi:</p>
                <ul className="ml-4 space-y-1.5 text-xs">
                  {proposalStatus.conditions && (
                    <>
                      <li className={proposalStatus.conditions.isSuccessful ? 'text-green-700' : 'text-yellow-700'}>
                        {proposalStatus.conditions.isSuccessful ? '✅' : '⏳'} Chiến dịch đạt mục tiêu
                        {!proposalStatus.conditions.isSuccessful && proposalStatus.conditions.progressPercentage !== undefined && (
                          <span className="ml-1 font-semibold">
                            (hiện tại: {proposalStatus.conditions.progressPercentage.toFixed(1)}%)
                          </span>
                        )}
                      </li>
                      <li className={proposalStatus.conditions.hasQuorum ? 'text-green-700' : 'text-yellow-700'}>
                        {proposalStatus.conditions.hasQuorum ? '✅' : '⏳'} Đạt quorum ({'>'} 50% donors vote)
                        {proposalStatus.voterCount !== undefined && proposalStatus.donorCount !== undefined && (
                          <span className="ml-1 font-semibold">
                            - {proposalStatus.voterCount}/{proposalStatus.donorCount} ({((proposalStatus.voterCount / proposalStatus.donorCount) * 100).toFixed(1)}%)
                          </span>
                        )}
                      </li>
                      <li className={proposalStatus.conditions.isApproved ? 'text-green-700' : 'text-yellow-700'}>
                        {proposalStatus.conditions.isApproved ? '✅' : '❌'} Phiếu ủng hộ {'>'} Phiếu phản đối
                        <span className="ml-1 font-semibold">
                          ({parseFloat(proposal.voteYes).toFixed(2)} vs {parseFloat(proposal.voteNo).toFixed(2)} ETH)
                        </span>
                      </li>
                      <li className={proposalStatus.conditions.hasSufficientBalance ? 'text-green-700' : 'text-red-700'}>
                        {proposalStatus.conditions.hasSufficientBalance ? '✅' : '❌'} Đủ số dư để thực hiện
                        {proposalStatus.conditions.balance !== undefined && (
                          <span className="ml-1 font-semibold">
                            (cần {proposalStatus.conditions.amountNeeded} ETH, có {parseFloat(proposalStatus.conditions.balance).toFixed(3)} ETH)
                          </span>
                        )}
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Voting Buttons */}
        {!proposal.executed && (
          <>
            <button
              onClick={() => onVote(index, true)}
              disabled={proposalStatus.hasVoted || proposalStatus.voting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                proposalStatus.hasVoted 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                  : 'bg-green-100 hover:bg-green-200 text-green-800 hover:shadow-lg'
              }`}
            >
              {proposalStatus.voting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              {proposalStatus.voting ? 'Đang vote...' : 
               proposalStatus.hasVoted ? 'Đã vote' : 'Ủng hộ'}
            </button>
            
            <button
              onClick={() => onVote(index, false)}
              disabled={proposalStatus.hasVoted || proposalStatus.voting}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                proposalStatus.hasVoted 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                  : 'bg-red-100 hover:bg-red-200 text-red-800 hover:shadow-lg'
              }`}
            >
              {proposalStatus.voting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              {proposalStatus.voting ? 'Đang vote...' : 
               proposalStatus.hasVoted ? 'Đã vote' : 'Phản đối'}
            </button>
          </>
        )}

        {/* View Voters Button */}
        <button
          onClick={() => onShowVoters(proposal, index)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          <Users className="w-4 h-4" />
          Chi tiết votes
        </button>

        {/* Execute Button - Always show for owner */}
        {isOwner && (
          <button
            onClick={() => onExecute(index)}
            disabled={proposal.executed || executing[index] || !proposalStatus.canExecute}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
              !proposal.executed && proposalStatus.canExecute && !executing[index]
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            {executing[index] ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {executing[index] ? 'Đang thực hiện...' : 
             proposal.executed ? 'Đã thực hiện' :
             proposalStatus.canExecute ? 'Thực hiện đề xuất' : 'Chưa đủ điều kiện'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;