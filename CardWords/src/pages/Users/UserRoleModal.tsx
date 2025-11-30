import React, { useState, useEffect } from 'react';

interface Role {
  id: number;
  name: string;
  description: string;
}

interface UserRoleModalProps {
  userId: string;
  userName: string;
  show: boolean;
  onClose: () => void;
}

const availableRoles: Role[] = [
  { id: 1, name: 'USER', description: 'Regular user with basic access' },
  { id: 2, name: 'PREMIUM', description: 'Premium user with enhanced features' },
  { id: 3, name: 'MODERATOR', description: 'Content moderator with review permissions' },
  { id: 4, name: 'ADMIN', description: 'Administrator with full system access' },
  { id: 5, name: 'TEACHER', description: 'Teacher role for educational content' },
  { id: 6, name: 'CONTENT_CREATOR', description: 'Can create and manage learning content' }
];

const getUserCurrentRoles = (userId: string): Role[] => {
  const userRoles: { [key: string]: Role[] } = {
    '1': [availableRoles[0], availableRoles[1]], 
    '2': [availableRoles[0], availableRoles[3]], 
    '6': [availableRoles[0], availableRoles[1], availableRoles[3]] 
  };
  return userRoles[userId] || [availableRoles[0]];
};

const UserRoleModal: React.FC<UserRoleModalProps> = ({ userId, userName, show, onClose }) => {
  const [currentRoles, setCurrentRoles] = useState<Role[]>([]);
  const [availableRoleOptions, setAvailableRoleOptions] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (show) {
      setLoading(true);
      setTimeout(() => {
        const userRoles = getUserCurrentRoles(userId);
        setCurrentRoles(userRoles);
        
        const availableRolesFiltered = availableRoles.filter(
          role => !userRoles.some(userRole => userRole.id === role.id)
        );
        setAvailableRoleOptions(availableRolesFiltered);
        
        setSelectedRole('');
        setLoading(false);
      }, 500);
    }
  }, [show, userId]);

  const handleAssignRole = async () => {
    if (!selectedRole) {
      alert('Please select a role to assign');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      const roleToAdd = availableRoles.find(role => role.id === parseInt(selectedRole));
      if (roleToAdd) {
        setCurrentRoles(prev => [...prev, roleToAdd]);
        setAvailableRoleOptions(prev => prev.filter(role => role.id !== parseInt(selectedRole)));
        setSelectedRole('');
        alert(`Role ${roleToAdd.name} assigned successfully to ${userName}`);
      }
      setSaving(false);
    }, 1000);
  };

  const handleRemoveRole = async (roleId: number) => {
    if (currentRoles.length <= 1) {
      alert('User must have at least one role');
      return;
    }

    const roleToRemove = currentRoles.find(role => role.id === roleId);
    if (!roleToRemove) return;

    if (!window.confirm(`Are you sure you want to remove the ${roleToRemove.name} role from ${userName}?`)) {
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setCurrentRoles(prev => prev.filter(role => role.id !== roleId));
      setAvailableRoleOptions(prev => [...prev, roleToRemove]);
      alert(`Role ${roleToRemove.name} removed successfully from ${userName}`);
      setSaving(false);
    }, 1000);
  };

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Manage Roles for {userName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Assign or remove roles to control user permissions
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={saving}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Current Roles */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Current Roles</h4>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : currentRoles.length === 0 ? (
              <p className="text-gray-500 text-sm">No roles assigned</p>
            ) : (
              <div className="space-y-3">
                {currentRoles.map(role => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{role.name}</span>
                        {role.name === 'USER' && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                    {role.name !== 'USER' && (
                      <button
                        onClick={() => handleRemoveRole(role.id)}
                        disabled={saving}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50 p-1"
                        title="Remove role"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Assign New Role</h4>
            
            {availableRoleOptions.length === 0 ? (
              <p className="text-gray-500 text-sm">All available roles have been assigned to this user.</p>
            ) : (
              <>
                <div className="mb-4">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    disabled={saving || availableRoleOptions.length === 0}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="">Select a role to assign...</option>
                    {availableRoleOptions.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleClose}
                    disabled={saving}
                    className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignRole}
                    disabled={saving || !selectedRole}
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {saving && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    Assign Role
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">About Roles</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>USER:</strong> Basic access to learning features and games</p>
              <p><strong>PREMIUM:</strong> Access to premium content and advanced features</p>
              <p><strong>MODERATOR:</strong> Can review and moderate user-generated content</p>
              <p><strong>ADMIN:</strong> Full system access and administrative privileges</p>
              <p><strong>TEACHER:</strong> Can create and manage educational content</p>
              <p><strong>CONTENT_CREATOR:</strong> Can create learning materials and exercises</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleModal;