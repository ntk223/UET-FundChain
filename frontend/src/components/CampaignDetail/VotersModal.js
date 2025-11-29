import React from 'react';
import { X, Check, X as XIcon } from 'lucide-react';

const VotersModal = ({ isOpen, onClose, proposal, proposalId }) => {
  if (!isOpen || !proposal) return null;

  const totalVotes = parseFloat(proposal.voteYes) + parseFloat(proposal.voteNo);
  const yesPercentage = totalVotes > 0 ? (parseFloat(proposal.voteYes) / totalVotes) * 100 : 0;
  const noPercentage = totalVotes > 0 ? (parseFloat(proposal.voteNo) / totalVotes) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Thống kê vote - Đề xuất #{proposalId + 1}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {proposal.description.length > 100 
                ? `${proposal.description.substring(0, 100)}...` 
                : proposal.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Vote Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Yes Votes */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Ủng hộ</span>
            </div>
            <div className="text-2xl font-bold text-green-800">
              {parseFloat(proposal.voteYes).toFixed(3)} ETH
            </div>
            <div className="text-sm text-green-600">
              {yesPercentage.toFixed(1)}% tổng votes
            </div>
            <div className="mt-2 bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${yesPercentage}%` }}
              />
            </div>
          </div>

          {/* No Votes */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XIcon className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Phản đối</span>
            </div>
            <div className="text-2xl font-bold text-red-800">
              {parseFloat(proposal.voteNo).toFixed(3)} ETH
            </div>
            <div className="text-sm text-red-600">
              {noPercentage.toFixed(1)}% tổng votes
            </div>
            <div className="mt-2 bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${noPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Chi tiết đề xuất</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Số tiền yêu cầu:</span>
              <div className="font-semibold text-gray-800">
                {parseFloat(proposal.amount).toFixed(3)} ETH
              </div>
            </div>
            <div>
              <span className="text-gray-600">Người nhận:</span>
              <div className="font-mono text-xs text-gray-800 break-all">
                {proposal.recipient}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Tổng votes:</span>
              <div className="font-semibold text-gray-800">
                {totalVotes.toFixed(3)} ETH
              </div>
            </div>
            <div>
              <span className="text-gray-600">Trạng thái:</span>
              <div className={`font-semibold ${proposal.executed ? 'text-green-600' : 'text-orange-600'}`}>
                {proposal.executed ? '✅ Đã thực hiện' : '⏳ Chưa thực hiện'}
              </div>
            </div>
          </div>
        </div>

        {/* Result Summary */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Kết quả</h3>
          {totalVotes === 0 ? (
            <p className="text-gray-600 text-center py-2">Chưa có vote nào</p>
          ) : (
            <div>
              {yesPercentage > 50 ? (
                <div className="text-green-600 font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Đề xuất được thông qua ({yesPercentage.toFixed(1)}% ủng hộ)
                </div>
              ) : (
                <div className="text-red-600 font-semibold flex items-center gap-2">
                  <XIcon className="w-5 h-5" />
                  Đề xuất bị từ chối ({yesPercentage.toFixed(1)}% ủng hộ)
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Cần {'>'} 50% tổng votes để thông qua đề xuất
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotersModal;