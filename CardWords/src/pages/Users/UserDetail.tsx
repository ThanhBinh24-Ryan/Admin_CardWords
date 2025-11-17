import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Types
interface Role {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: string;
  created_at: string;
  updated_at: string;
  activated: boolean;
  activation_expired_date: string | null;
  activation_key: string | null;
  avatar: string | null;
  banned: boolean;
  current_level: string | null;
  date_of_birth: string | null;
  email: string;
  gender: string | null;
  name: string;
  next_activation_time: string | null;
  password: string;
  status: string;
  roles?: Role[];
}

interface GameSession {
  id: number;
  game_name: string;
  topic_name: string;
  score: number;
  accuracy: number;
  duration: number;
  finished_at: string;
}

interface LearningProgress {
  level: string;
  progress: number;
  points: number;
  completed_topics: number;
  total_topics: number;
}

interface UserStats {
  total_games: number;
  average_score: number;
  total_learning_time: number;
  current_streak: number;
  longest_streak: number;
}

// Mock data
const mockUser: User = {
  id: '1',
  created_at: '2024-01-15T10:30:00',
  updated_at: '2024-02-20T14:25:00',
  activated: true,
  activation_expired_date: null,
  activation_key: null,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
  banned: false,
  current_level: 'B2',
  date_of_birth: '1990-05-15',
  email: 'john.doe@example.com',
  gender: 'Male',
  name: 'John Doe',
  next_activation_time: null,
  password: 'encrypted_password',
  status: 'ACTIVE',
  roles: [
    { id: 1, name: 'USER', description: 'Regular user' },
    { id: 2, name: 'PREMIUM', description: 'Premium user' }
  ]
};

const mockGameSessions: GameSession[] = [
  {
    id: 1,
    game_name: 'Vocabulary Quiz',
    topic_name: 'Business English',
    score: 85,
    accuracy: 92.5,
    duration: 1200,
    finished_at: '2024-02-20T10:30:00'
  },
  {
    id: 2,
    game_name: 'Listening Challenge',
    topic_name: 'Daily Conversations',
    score: 78,
    accuracy: 85.0,
    duration: 900,
    finished_at: '2024-02-18T14:20:00'
  },
  {
    id: 3,
    game_name: 'Grammar Test',
    topic_name: 'Advanced Grammar',
    score: 92,
    accuracy: 95.5,
    duration: 1500,
    finished_at: '2024-02-15T16:45:00'
  },
  {
    id: 4,
    game_name: 'Speaking Practice',
    topic_name: 'Job Interviews',
    score: 88,
    accuracy: 90.0,
    duration: 1800,
    finished_at: '2024-02-12T09:15:00'
  },
  {
    id: 5,
    game_name: 'Reading Comprehension',
    topic_name: 'Academic Texts',
    score: 95,
    accuracy: 97.0,
    duration: 2100,
    finished_at: '2024-02-10T11:30:00'
  }
];

const mockLearningProgress: LearningProgress[] = [
  { level: 'A1', progress: 100, points: 950, completed_topics: 12, total_topics: 12 },
  { level: 'A2', progress: 100, points: 1200, completed_topics: 15, total_topics: 15 },
  { level: 'B1', progress: 100, points: 1500, completed_topics: 18, total_topics: 18 },
  { level: 'B2', progress: 75, points: 2100, completed_topics: 15, total_topics: 20 },
  { level: 'C1', progress: 30, points: 800, completed_topics: 6, total_topics: 20 },
  { level: 'C2', progress: 5, points: 150, completed_topics: 1, total_topics: 20 }
];

const mockUserStats: UserStats = {
  total_games: 47,
  average_score: 84,
  total_learning_time: 28600,
  current_streak: 12,
  longest_streak: 25
};

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'progress' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setUser(mockUser);
      setGameSessions(mockGameSessions);
      setLearningProgress(mockLearningProgress);
      setUserStats(mockUserStats);
      setLoading(false);
    }, 1500);
  }, [id]);

  const handleEdit = () => {
    navigate(`/users/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/users');
  };

  const handleResetPassword = () => {
    if (window.confirm('Send password reset email to this user?')) {
      // Simulate API call
      setTimeout(() => {
        alert('Password reset email sent successfully!');
      }, 1000);
    }
  };

  const handleActivateDeactivate = () => {
    const action = user?.activated ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this account?`)) {
      // Simulate API call
      setTimeout(() => {
        alert(`Account ${action}d successfully!`);
        setUser(prev => prev ? { ...prev, activated: !prev.activated } : null);
      }, 1000);
    }
  };

  const handleBanUnban = () => {
    const action = user?.banned ? 'unban' : 'ban';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      // Simulate API call
      setTimeout(() => {
        alert(`User ${action}ned successfully!`);
        setUser(prev => prev ? { ...prev, banned: !prev.banned } : null);
      }, 1000);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      // Simulate API call
      setTimeout(() => {
        alert('Account deleted successfully!');
        navigate('/users');
      }, 1000);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { class: string; icon: string } } = {
      'ACTIVE': { class: 'bg-green-100 text-green-800 border-green-200', icon: '🟢' },
      'PENDING': { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🟡' },
      'SUSPENDED': { class: 'bg-red-100 text-red-800 border-red-200', icon: '🔴' },
      'INACTIVE': { class: 'bg-gray-100 text-gray-800 border-gray-200', icon: '⚫' }
    };
    
    const config = statusConfig[status] || statusConfig.INACTIVE;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.class}`}>
        <span className="mr-2">{config.icon}</span>
        {status}
      </span>
    );
  };

  const getLevelBadge = (level: string | null) => {
    if (!level) return null;
    
    const levelColors: { [key: string]: string } = {
      'A1': 'bg-blue-100 text-blue-800 border-blue-200',
      'A2': 'bg-blue-200 text-blue-800 border-blue-300',
      'B1': 'bg-green-100 text-green-800 border-green-200',
      'B2': 'bg-green-200 text-green-800 border-green-300',
      'C1': 'bg-purple-100 text-purple-800 border-purple-200',
      'C2': 'bg-purple-200 text-purple-800 border-purple-300'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${levelColors[level] || 'bg-gray-100 text-gray-800'}`}>
        {level}
      </span>
    );
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
          <div className="flex-1">
            <button
              onClick={handleBack}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors group"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Users
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(user.status)}
                  {user.banned && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                      🔨 BANNED
                    </span>
                  )}
                  {getLevelBadge(user.current_level)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6 lg:mt-0">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
            <button
              onClick={handleResetPassword}
              className="inline-flex items-center px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Reset Password
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <span className="text-2xl">🎮</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Games Played</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.total_games}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.average_score}%</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <span className="text-2xl">⏱️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Learning Time</p>
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(userStats.total_learning_time)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg mr-4">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.current_streak} days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'overview' as const, name: 'Overview', icon: '📊' },
                { id: 'activity' as const, name: 'Activity', icon: '🎮' },
                { id: 'progress' as const, name: 'Learning Progress', icon: '📚' },
                { id: 'settings' as const, name: 'Account Settings', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2 text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Personal Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Full Name</span>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Email Address</span>
                        <span className="font-medium text-gray-900">{user.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Date of Birth</span>
                        <span className="font-medium text-gray-900">
                          {user.date_of_birth ? `${new Date(user.date_of_birth).toLocaleDateString()} (${calculateAge(user.date_of_birth)} years)` : 'Not specified'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Gender</span>
                        <span className="font-medium text-gray-900">{user.gender || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">User ID</span>
                        <span className="font-mono text-sm text-gray-900">{user.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Member Since</span>
                        <span className="font-medium text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-medium text-gray-900">{new Date(user.updated_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-gray-600">Activation Status</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.activated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.activated ? '✅ Activated' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {gameSessions.slice(0, 5).map(session => (
                      <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg">🎯</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{session.game_name}</div>
                            <div className="text-sm text-gray-500">{session.topic_name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-lg">{session.score}%</div>
                          <div className="text-sm text-gray-500">
                            {new Date(session.finished_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Game Sessions</h3>
                  <div className="text-sm text-gray-500">
                    Total: {gameSessions.length} sessions
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Game
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Topic
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Accuracy
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {gameSessions.map(session => (
                        <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-sm">🎮</span>
                              </div>
                              <span className="font-medium text-gray-900">{session.game_name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.topic_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              session.score >= 90 ? 'bg-green-100 text-green-800' :
                              session.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {session.score}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.accuracy}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {Math.floor(session.duration / 60)}m {session.duration % 60}s
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(session.finished_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Learning Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Learning Journey</h3>
                
                {/* Progress Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {learningProgress.map(progress => (
                    <div key={progress.level} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">Level {progress.level}</h4>
                          <p className="text-sm text-gray-600">{progress.completed_topics}/{progress.total_topics} topics</p>
                        </div>
                        {getLevelBadge(progress.level)}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{progress.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{progress.points} points</span>
                        {progress.progress === 100 && (
                          <span className="text-green-600 font-medium">✅ Completed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Current Level Focus */}
                {user.current_level && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">Current Level Focus: {user.current_level}</h4>
                    <div className="space-y-3">
                      {learningProgress
                        .find(p => p.level === user.current_level)
                        ?.completed_topics && (
                        <div className="text-blue-800">
                          <strong>Progress:</strong> {learningProgress.find(p => p.level === user.current_level)?.completed_topics} of {learningProgress.find(p => p.level === user.current_level)?.total_topics} topics completed
                        </div>
                      )}
                      <div className="text-blue-700">
                        <strong>Focus Areas:</strong> Advanced grammar, Business vocabulary, Professional communication
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-yellow-800">
                        Account Management
                      </h3>
                      <div className="mt-2 text-yellow-700">
                        <p>Be cautious when performing these actions as they may affect user access and data.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reset Password */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <span className="text-2xl">🔑</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Reset Password</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Send a password reset email to the user. They will receive instructions to set a new password.
                        </p>
                        <button 
                          onClick={handleResetPassword}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                        >
                          Send Reset Email
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activation Status */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <span className="text-2xl">✅</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {user.activated ? 'Deactivate Account' : 'Activate Account'}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {user.activated 
                            ? 'Temporarily deactivate this account. User will not be able to access the platform.' 
                            : 'Activate this account. User will regain full access to the platform.'}
                        </p>
                        <button 
                          onClick={handleActivateDeactivate}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            user.activated
                              ? 'bg-gray-600 text-white hover:bg-gray-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {user.activated ? 'Deactivate Account' : 'Activate Account'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ban/Unban */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <span className="text-2xl">🔨</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {user.banned ? 'Unban User' : 'Ban User'}
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                          {user.banned 
                            ? 'Remove restrictions and restore full platform access to this user.' 
                            : 'Restrict this user from accessing the platform due to policy violations.'}
                        </p>
                        <button 
                          onClick={handleBanUnban}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            user.banned
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          {user.banned ? 'Unban User' : 'Ban User'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="border border-gray-200 rounded-xl p-6 hover:border-red-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <span className="text-2xl">🗑️</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Delete Account</h4>
                        <p className="text-gray-600 text-sm mb-4">
                          Permanently delete this user account and all associated data. This action cannot be undone.
                        </p>
                        <button 
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;