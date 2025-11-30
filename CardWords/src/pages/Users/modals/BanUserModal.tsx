import React from 'react';
import { X, Ban, UserCheck, Loader2, AlertTriangle } from 'lucide-react';
import { User } from '../../../types/user';

interface BanUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onBanUser: (banned: boolean) => Promise<void>;
  loading: boolean;
}

const BanUserModal: React.FC<BanUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onBanUser,
  loading
}) => {
  const isCurrentlyBanned = user.banned;
  const actionText = isCurrentlyBanned ? 'bỏ cấm' : 'cấm';
  const actionTitle = isCurrentlyBanned ? 'Bỏ cấm người dùng' : 'Cấm người dùng';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onBanUser(!isCurrentlyBanned);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            {isCurrentlyBanned ? (
              <UserCheck className="w-6 h-6 text-green-600 mr-3" />
            ) : (
              <Ban className="w-6 h-6 text-red-600 mr-3" />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {actionTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700 mb-2">
                  Bạn sắp {actionText} người dùng:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {isCurrentlyBanned 
                    ? 'Người dùng sẽ được khôi phục toàn quyền truy cập vào hệ thống.'
                    : 'Người dùng sẽ bị hạn chế truy cập vào hệ thống do vi phạm chính sách.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors flex items-center justify-center ${
                isCurrentlyBanned ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isCurrentlyBanned ? (
                    <UserCheck className="w-4 h-4 mr-2" />
                  ) : (
                    <Ban className="w-4 h-4 mr-2" />
                  )}
                  {actionTitle}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BanUserModal;