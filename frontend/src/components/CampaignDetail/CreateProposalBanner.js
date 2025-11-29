import React from 'react';
import { Plus } from 'lucide-react';

const CreateProposalBanner = ({ onCreateProposal }) => {
  return (
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
  );
};

export default CreateProposalBanner;