import React from 'react';
import { X, UserCheck, UserX, Loader2, AlertTriangle } from 'lucide-react';
import { User } from '../../../types/user';

interface ActivateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onActivateUser: (activated: boolean) => Promise<void>;
  loading: boolean;
}

const ActivateUserModal: React.FC<ActivateUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onActivateUser,
  loading
}) => {
  const isCurrentlyActivated = user.activated;
  const actionText = isCurrentlyActivated ? 'vô hiệu hóa' : 'kích hoạt';
  const actionTitle = isCurrentlyActivated ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt tài khoản';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onActivateUser(!isCurrentlyActivated);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            {isCurrentlyActivated ? (
              <UserX className="w-6 h-6 text-yellow-600 mr-3" />
            ) : (
              <UserCheck className="w-6 h-6 text-green-600 mr-3" />
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-gray-700 mb-2">
                  Bạn sắp {actionText} tài khoản:
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {isCurrentlyActivated 
                    ? 'Người dùng sẽ không thể đăng nhập và sử dụng hệ thống.'
                    : 'Người dùng sẽ được kích hoạt và có thể sử dụng hệ thống bình thường.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
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
                isCurrentlyActivated ? 'bg-yellow-600' : 'bg-green-600'
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isCurrentlyActivated ? (
                    <UserX className="w-4 h-4 mr-2" />
                  ) : (
                    <UserCheck className="w-4 h-4 mr-2" />
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

export default ActivateUserModal;