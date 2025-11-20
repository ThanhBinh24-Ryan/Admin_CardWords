
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/Auth/Login/LoginPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import UserList from '../pages/Users/UserList';
import UserDetail from '../pages/Users/UserDetail';
// import UserEdit from '../pages/Users/UserEdit';
import VocabList from '../pages/Vocab/VocabList';
import VocabForm from '../pages/Vocab/VocabForm';
import VocabDetail from '../pages/Vocab/VocabDetail';
import NotFoundPage from '../pages/NotFoundPage';
import NotificationList from '../pages/Notification/NotificationList';
import NotificationSetting from '../pages/Notification/NotificationSetting';
import ForgotPasswordPage from '../pages/Auth/Forgot/ForgotPasswordPage';
import { Outlet } from 'react-router-dom';
import ProfilePage from '../pages/Profile/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import ChangePasswordPage from '../pages/Profile/ChangePasswordPage/ChangePasswordPage';
import Gamelist from "../pages/Games/GamesList"
import TopicList from "../pages/Topic/TopicList"
import TopicDetail from "../pages/Topic/TopicDetail"
import TocpicEdit from "../pages/Topic/TopicEdit"
import TocpicCreate from "../pages/Topic/TopicCreate"
import CreateWordTypePage from "../pages/WordType/CreateWordTypePage"
import EditWordTypePage from "../pages/WordType/EditWordTypePage"
import WordTypeDetailPage from "../pages/WordType/WordTypeDetailPage"
import WordTypesPage from "../pages/WordType/WordTypesPage"
import ActionLogsPage from '../pages/ActionLogs/index';
import BulkImportVocabs from '../pages/Vocab/BulkImportVocabs'
import TopicBulkCreate from '../pages/Topic/TopicBulkCreate'
import TopicBulkEdit from '../pages/Topic/TopicBulkEdit'
import CreateVocab from '../pages/Vocab/CreateVocab'
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout><Outlet /></AuthLayout>,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'forgotpw', element: <ForgotPasswordPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      
      // Users routes
      { path: 'users', element: <UserList /> },
      { path: '/admin/users/:id', element: <UserDetail /> },
      // { path: '/admin/users/:id/edit', element: <UserEdit /> },
      
      // Vocabulary routes
      { path: 'admin/vocabs', element: <VocabList /> },
      { path: 'admin/vocab/new', element: <CreateVocab/> },
      { path: 'admin/vocabs/:id', element: <VocabDetail /> },
      { path: 'admin/vocabs/:id/edit', element: <VocabForm /> },
        { path: '/admin/vocabs/bulk-import', element: <BulkImportVocabs/> },
      // Games routes
      { path: 'admin/games', element: <Gamelist /> },
      
      // Topics routes
      { path: 'admin/topics', element: <TopicList /> },
      { path: 'admin/topics/new', element: <TocpicCreate /> },
      { path: 'admin/topics/:id', element: <TopicDetail /> },
      { path: 'admin/topics/:id/edit', element: <TocpicEdit /> },
       { path: 'admin/topics/bulk-create', element: <TopicBulkCreate /> },
        { path: 'admin/topics/bulk-edit', element: <TopicBulkEdit /> },
      
      // Word Types routes 
      { path: 'admin/word-types', element: <WordTypesPage /> },
      { path: 'admin/word-types/create', element: <CreateWordTypePage /> },
      { path: 'admin/word-types/:id', element: <WordTypeDetailPage /> },
      { path: 'admin/word-types/:id/edit', element: <EditWordTypePage /> },
      
      // Notifications routes
      { path: 'notifications', element: <NotificationList /> },
      { path: 'notifications/settings', element: <NotificationSetting /> },
      
      // Logs routes
           { path: 'action-logs', element: <ActionLogsPage /> },
      
      // Profile routes
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/change-password', element: <ChangePasswordPage /> },
      
      // Settings routes
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;