import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { 
  ArrowLeft,
  Save,
  X,
  Loader2,
  User,
  Mail,
  Calendar,
  Shield,
  AlertTriangle
} from 'lucide-react';

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    currentUser,
    loading,
    fetchUserById,
    clearCurrentUser
  } = useUserStore();

  const [saving, setSaving] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentLevel: '',
    gender: '',
    dateOfBirth: '',
    avatar: ''
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  const availableLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const availableGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  useEffect(() => {
    if (id) {
      loadUserData();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      clearCurrentUser();
    };
  }, []);

  const loadUserData = async () => {
    if (!id) return;
    try {
      await fetchUserById(id);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const initialFormData = {
        name: currentUser.name || '',
        email: currentUser.email || '',
        currentLevel: currentUser.currentLevel || '',
        gender: currentUser.gender || '',
        dateOfBirth: currentUser.dateOfBirth || '',
        avatar: currentUser.avatar || ''
      };
      setFormData(initialFormData);
      setOriginalData(initialFormData);
    }
  }, [currentUser]);

  // Check if form has changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    setChangesMade(hasChanges);
  }, [formData, originalData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/admin/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
      
        setOriginalData({ ...formData });
        setChangesMade(false);
        await loadUserData(); // Reload updated data
        navigate(`/admin/users/${id}`);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
     
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (changesMade) {
      if (window.confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn hủy?')) {
        navigate(`/admin/users/${id}`);
      }
    } else {
      navigate(`/admin/users/${id}`);
    }
  };

  const resetForm = () => {
    if (window.confirm('Bạn có chắc muốn đặt lại tất cả thay đổi?')) {
      setFormData({ ...originalData });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Không tìm thấy người dùng</h2>
          <p className="text-gray-600 mb-6">Người dùng bạn đang tìm kiếm không tồn tại.</p>
          <button
            onClick={() => navigate('/users')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate(`/users`)}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Người dùng</h1>
              <p className="text-gray-600 mt-1">Cập nhật thông tin và cài đặt người dùng</p>
            </div>
            {changesMade && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Thay đổi chưa lưu
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Thông tin cơ bản
              </h2>
              <p className="text-sm text-gray-600 mt-1">Thông tin cá nhân và liên hệ</p>
            </div>
            <div className="p-6 space-y-6">
              {/* Avatar Section */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&size=200`}
                    alt={formData.name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh đại diện
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Thay đổi ảnh
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    {formData.avatar && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG hoặc GIF. Kích thước tối đa 2MB.</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Chọn giới tính</option>
                    {availableGenders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Trình độ hiện tại
                  </label>
                  <select
                    id="currentLevel"
                    name="currentLevel"
                    value={formData.currentLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Chọn trình độ</option>
                    {availableLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={!changesMade || saving}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Đặt lại thay đổi
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!changesMade || saving}
                className="px-6 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Changes Indicator */}
        {changesMade && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Thay đổi chưa lưu</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEdit;