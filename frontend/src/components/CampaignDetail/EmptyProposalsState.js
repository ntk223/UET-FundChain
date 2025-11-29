import React from 'react';
import { Vote } from 'lucide-react';

const EmptyProposalsState = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <Vote className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>Chưa có đề xuất nào được tạo</p>
      <p className="text-sm">Đề xuất sẽ xuất hiện khi campaign thành công</p>
    </div>
  );
};

export default EmptyProposalsState;