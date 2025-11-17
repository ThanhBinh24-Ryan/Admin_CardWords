// import { createBrowserRouter } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
// import AdminLayout from '../layouts/AdminLayout';
// import AuthLayout from '../layouts/AuthLayout';
// import LoginPage from '../pages/Auth/LoginPage';
// import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
// import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
// import DashboardPage from '../pages/DashboardPage/DashboardPage'; // Đảm bảo file này tồn tại
// import UserList from '../pages/Users/UserList';
// import UserDetail from '../pages/Users/UserDetail';
// import UserEdit from '../pages/Users/UserEdit';
// import VocabList from '../pages/Vocab/VocabList';
// import VocabForm from '../pages/Vocab/VocabForm';
// import VocabDetail from '../pages/Vocab/VocabDetail';
// import NotificationList from '../pages/Notification/NotificationList';
// import NotificationSetting from '../pages/Notification/NotificationSetting';
// import ActionLogsPage from '../pages/Logs/ActionLogsPage';
// import NotFoundPage from '../pages/NotFoundPage';

// import { Outlet } from 'react-router-dom';
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>,
//     children: [
//       { path: 'dashboard', element: <DashboardPage /> },
//       { path: 'users', element: <UserList /> },
//       { path: 'users/:id', element: <UserDetail /> },
//       { path: 'users/:id/edit', element: <UserEdit /> },
//       { path: 'vocab', element: <VocabList /> },
//       { path: 'vocab/new', element: <VocabForm /> },
//       { path: 'vocab/detail/:id', element: <VocabDetail /> },
//       { path: 'vocab/edit/:id', element: <VocabForm  /> },
//       { path: 'notifications', element: <NotificationList /> },
//       { path: 'notifications/settings', element: <NotificationSetting /> },
//       { path: 'logs', element: <ActionLogsPage /> },
//     ],
//   },
//   {
//     element: <AuthLayout><Outlet /></AuthLayout>,
//     children: [
//       { path: 'login', element: <LoginPage /> },
//       { path: 'forgot-password', element: <ForgotPasswordPage /> },
//       { path: 'reset-password/:token', element: <ResetPasswordPage /> },
//     ],
//   },
//   { path: '*', element: <NotFoundPage /> },
// ]);

// export default router;
// import { createBrowserRouter } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
// import AdminLayout from '../layouts/AdminLayout';
// import AuthLayout from '../layouts/AuthLayout';
// import LoginPage from '../pages/Auth/Login/LoginPage';
// import DashboardPage from '../pages/DashboardPage/DashboardPage';
// import UserList from '../pages/Users/UserList';
// import UserDetail from '../pages/Users/UserDetail';
// import UserEdit from '../pages/Users/UserEdit';
// import VocabList from '../pages/Vocab/VocabList';
// import VocabForm from '../pages/Vocab/VocabForm';
// import VocabDetail from '../pages/Vocab/VocabDetail';
// import NotFoundPage from '../pages/NotFoundPage';
// import NotificationList from '../pages/Notification/NotificationList';
// import NotificationSetting from '../pages/Notification/NotificationSetting';
// import ActionLogsPage from '../pages/Logs/ActionLogsPage';
// import ForgotPasswordPage from '../pages/Auth/Forgot/ForgotPasswordPage';
// import { Outlet } from 'react-router-dom';
// import ProfilePage from '../pages/Profile/Profile/ProfilePage';
// import SettingsPage from '../pages/Settings/SettingsPage';
// import ChangePasswordPage from '../pages/Profile/ChangePasswordPage/ChangePasswordPage';
// import Gamelist from "../pages/Games/GamesList"
// import TopicList from "../pages/Topic/TopicList"
// import TopicDetail from "../pages/Topic/TopicDetail"
// import TocpicEdit from "../pages/Topic/TopicEdit"
// import TocpicCreate from "../pages/Topic/TopicCreate"
// import CreateWordTypePage from "../pages/WordType/CreateWordTypePage"
// import EditWordTypePage from "../pages/WordType/EditWordTypePage"
// import WordTypeDetailPage from "../pages/WordType/WordTypeDetailPage"
// import WordTypesPage from "../pages/WordType/WordTypesPage"
// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <AuthLayout><Outlet /></AuthLayout>,
//     children: [
//       { index: true, element: <LoginPage /> },
//       { path: 'login', element: <LoginPage /> },
//         { path: 'forgotpw', element: <ForgotPasswordPage /> },
//     ],
//   },
//   {
//     path: '/',
//     element: <ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>,
//     children: [
//       { index: true, element: <DashboardPage /> },
//       { path: 'dashboard', element: <DashboardPage /> },
//       { path: 'users', element: <UserList /> },
//       { path: 'users/:id', element: <UserDetail /> },
//       { path: 'users/:id/edit', element: <UserEdit /> },
//       { path: 'admin/vocabs', element: <VocabList /> },
//       { path: 'vocab/new', element: <VocabForm /> },
//       { path: 'admin/vocabs/:id', element: <VocabDetail /> },
//       { path: 'admin/vocabs/:id/edit', element: <VocabForm /> },
//        { path: 'admin/games', element: <Gamelist /> },
//         { path: 'admin/topics', element: <TopicList /> },
//       { path: 'admin/topics/new', element: <TocpicCreate /> },
//       { path: 'admin/topics/:id', element: <TopicDetail /> },
//       { path: 'admin/topics/:id/edit', element: <TocpicEdit /> },

//       { path: 'notifications', element: <NotificationList /> },
//       { path: 'notifications/settings', element: <NotificationSetting /> },
//       { path: 'logs', element: <ActionLogsPage /> },
//         { path: 'profile', element: <ProfilePage /> },
//       { path: 'profile/change-password', element: <ChangePasswordPage /> },
//        { path: 'settings', element: <SettingsPage /> },
     
//     ],
//   },
//   { path: '*', element: <NotFoundPage /> },
// ]);

// export default router;










import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/Auth/Login/LoginPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import UserList from '../pages/Users/UserList';
import UserDetail from '../pages/Users/UserDetail';
import UserEdit from '../pages/Users/UserEdit';
import VocabList from '../pages/Vocab/VocabList';
import VocabForm from '../pages/Vocab/VocabForm';
import VocabDetail from '../pages/Vocab/VocabDetail';
import NotFoundPage from '../pages/NotFoundPage';
import NotificationList from '../pages/Notification/NotificationList';
import NotificationSetting from '../pages/Notification/NotificationSetting';
import ActionLogsPage from '../pages/Logs/ActionLogsPage';
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
      { path: 'users/:id', element: <UserDetail /> },
      { path: 'users/:id/edit', element: <UserEdit /> },
      
      // Vocabulary routes
      { path: 'admin/vocabs', element: <VocabList /> },
      { path: 'vocab/new', element: <VocabForm /> },
      { path: 'admin/vocabs/:id', element: <VocabDetail /> },
      { path: 'admin/vocabs/:id/edit', element: <VocabForm /> },
      
      // Games routes
      { path: 'admin/games', element: <Gamelist /> },
      
      // Topics routes
      { path: 'admin/topics', element: <TopicList /> },
      { path: 'admin/topics/new', element: <TocpicCreate /> },
      { path: 'admin/topics/:id', element: <TopicDetail /> },
      { path: 'admin/topics/:id/edit', element: <TocpicEdit /> },
      
      // Word Types routes 
      { path: 'admin/word-types', element: <WordTypesPage /> },
      { path: 'admin/word-types/create', element: <CreateWordTypePage /> },
      { path: 'admin/word-types/:id', element: <WordTypeDetailPage /> },
      { path: 'admin/word-types/:id/edit', element: <EditWordTypePage /> },
      
      // Notifications routes
      { path: 'notifications', element: <NotificationList /> },
      { path: 'notifications/settings', element: <NotificationSetting /> },
      
      // Logs routes
      { path: 'logs', element: <ActionLogsPage /> },
      
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