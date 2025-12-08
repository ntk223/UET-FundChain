import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useCampaign } from '../../hooks/useCampaign.js';
const CreateProposal = ({campaignAddress, onClose}) => {
  const { createProposal } = useCampaign();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    recipient: ''
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProposal(campaignAddress, formData.description, formData.amount, formData.recipient);
      console.log('Đề xuất được tạo:', formData);
      // Reset form sau khi tạo đề xuất thành công
      setFormData({ description: '', amount: '', recipient: '' });
      onClose();
    } catch (error) {
      console.error('Lỗi khi tạo đề xuất:', error);
    }
    setLoading(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tạo Đề Xuất Mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2"
              rows="3"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Số tiền (ETH)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2"
              step="0.0001"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Địa chỉ Người Nhận</label>
            <input
              type="text"
              name="recipient"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="0x..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Tạo Đề Xuất'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;