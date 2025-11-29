import React from 'react';
import { Vote } from 'lucide-react';

const ProposalLoadingState = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <Vote className="w-8 h-8 mx-auto mb-2 animate-pulse" />
      <p>Đang tải đề xuất...</p>
    </div>
  );
};

export default ProposalLoadingState;