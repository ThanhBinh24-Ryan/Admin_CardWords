// import React, { useState, useEffect } from 'react';

// interface NotificationSettings {
//   email: EmailSettings;
//   push: PushSettings;
//   inApp: InAppSettings;
//   frequency: FrequencySettings;
// }

// interface EmailSettings {
//   enabled: boolean;
//   vocabReminders: boolean;
//   studyProgress: boolean;
//   achievements: boolean;
//   systemUpdates: boolean;
//   securityAlerts: boolean;
//   promotional: boolean;
// }

// interface PushSettings {
//   enabled: boolean;
//   vocabReminders: boolean;
//   studyProgress: boolean;
//   achievements: boolean;
//   securityAlerts: boolean;
// }

// interface InAppSettings {
//   enabled: boolean;
//   vocabReminders: boolean;
//   studyProgress: boolean;
//   achievements: boolean;
//   systemUpdates: boolean;
//   newFeatures: boolean;
//   maintenance: boolean;
// }

// interface FrequencySettings {
//   dailyDigest: boolean;
//   weeklyReport: boolean;
//   realTime: boolean;
//   quietHours: {
//     enabled: boolean;
//     start: string;
//     end: string;
//   };
// }

// const NotificationSetting: React.FC = () => {
//   const [settings, setSettings] = useState<NotificationSettings>({
//     email: {
//       enabled: true,
//       vocabReminders: true,
//       studyProgress: true,
//       achievements: true,
//       systemUpdates: true,
//       securityAlerts: true,
//       promotional: false
//     },
//     push: {
//       enabled: true,
//       vocabReminders: true,
//       studyProgress: false,
//       achievements: true,
//       securityAlerts: true
//     },
//     inApp: {
//       enabled: true,
//       vocabReminders: true,
//       studyProgress: true,
//       achievements: true,
//       systemUpdates: true,
//       newFeatures: true,
//       maintenance: true
//     },
//     frequency: {
//       dailyDigest: true,
//       weeklyReport: true,
//       realTime: true,
//       quietHours: {
//         enabled: false,
//         start: '22:00',
//         end: '08:00'
//       }
//     }
//   });

//   const [saving, setSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState<'email' | 'push' | 'inApp' | 'frequency'>('email');

//   useEffect(() => {
//     // Simulate loading settings from API
//     setTimeout(() => {
//       // In real app, this would be an API call
//       console.log('Settings loaded');
//     }, 500);
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setSaving(false);
//       alert('Notification settings updated successfully!');
//     }, 1500);
//   };

//   const handleReset = () => {
//     if (window.confirm('Are you sure you want to reset all notification settings to default?')) {
//       setSettings({
//         email: {
//           enabled: true,
//           vocabReminders: true,
//           studyProgress: true,
//           achievements: true,
//           systemUpdates: true,
//           securityAlerts: true,
//           promotional: false
//         },
//         push: {
//           enabled: true,
//           vocabReminders: true,
//           studyProgress: false,
//           achievements: true,
//           securityAlerts: true
//         },
//         inApp: {
//           enabled: true,
//           vocabReminders: true,
//           studyProgress: true,
//           achievements: true,
//           systemUpdates: true,
//           newFeatures: true,
//           maintenance: true
//         },
//         frequency: {
//           dailyDigest: true,
//           weeklyReport: true,
//           realTime: true,
//           quietHours: {
//             enabled: false,
//             start: '22:00',
//             end: '08:00'
//           }
//         }
//       });
//     }
//   };

//   const updateEmailSetting = (key: keyof EmailSettings, value: boolean) => {
//     setSettings(prev => ({
//       ...prev,
//       email: {
//         ...prev.email,
//         [key]: value
//       }
//     }));
//   };

//   const updatePushSetting = (key: keyof PushSettings, value: boolean) => {
//     setSettings(prev => ({
//       ...prev,
//       push: {
//         ...prev.push,
//         [key]: value
//       }
//     }));
//   };

//   const updateInAppSetting = (key: keyof InAppSettings, value: boolean) => {
//     setSettings(prev => ({
//       ...prev,
//       inApp: {
//         ...prev.inApp,
//         [key]: value
//       }
//     }));
//   };

//   const updateFrequencySetting = (key: keyof FrequencySettings, value: any) => {
//     setSettings(prev => ({
//       ...prev,
//       frequency: {
//         ...prev.frequency,
//         [key]: value
//       }
//     }));
//   };

//   const updateQuietHours = (key: keyof NotificationSettings['frequency']['quietHours'], value: any) => {
//     setSettings(prev => ({
//       ...prev,
//       frequency: {
//         ...prev.frequency,
//         quietHours: {
//           ...prev.frequency.quietHours,
//           [key]: value
//         }
//       }
//     }));
//   };

//   const toggleChannel = (channel: 'email' | 'push' | 'inApp') => {
//     setSettings(prev => ({
//       ...prev,
//       [channel]: {
//         ...prev[channel],
//         enabled: !prev[channel].enabled
//       }
//     }));
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-4xl">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Settings</h1>
//         <p className="text-gray-600">Customize how and when you receive notifications</p>
//       </div>

//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Tabs */}
//         <div className="border-b border-gray-200">
//           <nav className="flex -mb-px">
//             {[
//               { id: 'email', name: 'Email Notifications', icon: '📧' },
//               { id: 'push', name: 'Push Notifications', icon: '📱' },
//               { id: 'inApp', name: 'In-App Notifications', icon: '💬' },
//               { id: 'frequency', name: 'Delivery Frequency', icon: '⏰' }
//             ].map(tab => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as any)}
//                 className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
//                   activeTab === tab.id
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 <span className="mr-2">{tab.icon}</span>
//                 {tab.name}
//               </button>
//             ))}
//           </nav>
//         </div>

//         <div className="p-6">
//           {/* Email Settings */}
//           {activeTab === 'email' && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>
//                   <p className="text-gray-600 text-sm">Receive notifications via email</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={settings.email.enabled}
//                     onChange={() => toggleChannel('email')}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>

//               {settings.email.enabled && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <SettingToggle
//                       label="Vocabulary Reminders"
//                       description="Get reminded about pending vocabulary reviews"
//                       checked={settings.email.vocabReminders}
//                       onChange={(checked) => updateEmailSetting('vocabReminders', checked)}
//                     />
//                     <SettingToggle
//                       label="Study Progress Reports"
//                       description="Weekly and monthly learning progress updates"
//                       checked={settings.email.studyProgress}
//                       onChange={(checked) => updateEmailSetting('studyProgress', checked)}
//                     />
//                     <SettingToggle
//                       label="Achievements & Milestones"
//                       description="Celebrate your learning achievements"
//                       checked={settings.email.achievements}
//                       onChange={(checked) => updateEmailSetting('achievements', checked)}
//                     />
//                     <SettingToggle
//                       label="System Updates"
//                       description="Important updates about the platform"
//                       checked={settings.email.systemUpdates}
//                       onChange={(checked) => updateEmailSetting('systemUpdates', checked)}
//                     />
//                     <SettingToggle
//                       label="Security Alerts"
//                       description="Important security-related notifications"
//                       checked={settings.email.securityAlerts}
//                       onChange={(checked) => updateEmailSetting('securityAlerts', checked)}
//                     />
//                     <SettingToggle
//                       label="Promotional Offers"
//                       description="Special offers and new feature announcements"
//                       checked={settings.email.promotional}
//                       onChange={(checked) => updateEmailSetting('promotional', checked)}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Push Settings */}
//           {activeTab === 'push' && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
//                   <p className="text-gray-600 text-sm">Receive notifications on your device</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={settings.push.enabled}
//                     onChange={() => toggleChannel('push')}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>

//               {settings.push.enabled && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 gap-4">
//                     <SettingToggle
//                       label="Vocabulary Reminders"
//                       description="Instant reminders for vocabulary reviews"
//                       checked={settings.push.vocabReminders}
//                       onChange={(checked) => updatePushSetting('vocabReminders', checked)}
//                     />
//                     <SettingToggle
//                       label="Study Progress Updates"
//                       description="Real-time progress notifications"
//                       checked={settings.push.studyProgress}
//                       onChange={(checked) => updatePushSetting('studyProgress', checked)}
//                     />
//                     <SettingToggle
//                       label="Achievement Unlocks"
//                       description="Celebrate when you reach milestones"
//                       checked={settings.push.achievements}
//                       onChange={(checked) => updatePushSetting('achievements', checked)}
//                     />
//                     <SettingToggle
//                       label="Security Alerts"
//                       description="Critical security notifications"
//                       checked={settings.push.securityAlerts}
//                       onChange={(checked) => updatePushSetting('securityAlerts', checked)}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* In-App Settings */}
//           {activeTab === 'inApp' && (
//             <div className="space-y-6">
//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">In-App Notifications</h3>
//                   <p className="text-gray-600 text-sm">Notifications within the application</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={settings.inApp.enabled}
//                     onChange={() => toggleChannel('inApp')}
//                     className="sr-only peer"
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>

//               {settings.inApp.enabled && (
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <SettingToggle
//                       label="Vocabulary Reminders"
//                       description="Review reminders and study suggestions"
//                       checked={settings.inApp.vocabReminders}
//                       onChange={(checked) => updateInAppSetting('vocabReminders', checked)}
//                     />
//                     <SettingToggle
//                       label="Study Progress"
//                       description="Learning statistics and progress updates"
//                       checked={settings.inApp.studyProgress}
//                       onChange={(checked) => updateInAppSetting('studyProgress', checked)}
//                     />
//                     <SettingToggle
//                       label="Achievements"
//                       description="Milestone celebrations and badges"
//                       checked={settings.inApp.achievements}
//                       onChange={(checked) => updateInAppSetting('achievements', checked)}
//                     />
//                     <SettingToggle
//                       label="System Updates"
//                       description="Platform updates and announcements"
//                       checked={settings.inApp.systemUpdates}
//                       onChange={(checked) => updateInAppSetting('systemUpdates', checked)}
//                     />
//                     <SettingToggle
//                       label="New Features"
//                       description="Announcements about new features"
//                       checked={settings.inApp.newFeatures}
//                       onChange={(checked) => updateInAppSetting('newFeatures', checked)}
//                     />
//                     <SettingToggle
//                       label="Maintenance Notices"
//                       description="Scheduled maintenance announcements"
//                       checked={settings.inApp.maintenance}
//                       onChange={(checked) => updateInAppSetting('maintenance', checked)}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Frequency Settings */}
//           {activeTab === 'frequency' && (
//             <div className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <SettingToggle
//                   label="Daily Learning Digest"
//                   description="Summary of your daily learning activity"
//                   checked={settings.frequency.dailyDigest}
//                   onChange={(checked) => updateFrequencySetting('dailyDigest', checked)}
//                 />
//                 <SettingToggle
//                   label="Weekly Progress Report"
//                   description="Comprehensive weekly learning report"
//                   checked={settings.frequency.weeklyReport}
//                   onChange={(checked) => updateFrequencySetting('weeklyReport', checked)}
//                 />
//                 <SettingToggle
//                   label="Real-time Notifications"
//                   description="Instant notifications for important updates"
//                   checked={settings.frequency.realTime}
//                   onChange={(checked) => updateFrequencySetting('realTime', checked)}
//                 />
//               </div>

//               {/* Quiet Hours */}
//               <div className="border-t pt-6 mt-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">Quiet Hours</h3>
//                     <p className="text-gray-600 text-sm">Pause notifications during specific hours</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={settings.frequency.quietHours.enabled}
//                       onChange={(e) => updateQuietHours('enabled', e.target.checked)}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>

//                 {settings.frequency.quietHours.enabled && (
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Start Time
//                       </label>
//                       <input
//                         type="time"
//                         value={settings.frequency.quietHours.start}
//                         onChange={(e) => updateQuietHours('start', e.target.value)}
//                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         End Time
//                       </label>
//                       <input
//                         type="time"
//                         value={settings.frequency.quietHours.end}
//                         onChange={(e) => updateQuietHours('end', e.target.value)}
//                         className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div className="flex items-end">
//                       <p className="text-sm text-gray-600">
//                         Notifications will be paused during these hours
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
//             <button
//               onClick={handleReset}
//               className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//             >
//               Reset to Defaults
//             </button>
            
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => window.history.back()}
//                 className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
//               >
//                 {saving && (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 )}
//                 {saving ? 'Saving...' : 'Save Settings'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable setting toggle component
// const SettingToggle: React.FC<{
//   label: string;
//   description: string;
//   checked: boolean;
//   onChange: (checked: boolean) => void;
// }> = ({ label, description, checked, onChange }) => {
//   return (
//     <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
//       <div className="flex-1">
//         <h4 className="font-medium text-gray-900">{label}</h4>
//         <p className="text-sm text-gray-600 mt-1">{description}</p>
//       </div>
//       <label className="relative inline-flex items-center cursor-pointer ml-4">
//         <input
//           type="checkbox"
//           checked={checked}
//           onChange={(e) => onChange(e.target.checked)}
//           className="sr-only peer"
//         />
//         <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//       </label>
//     </div>
//   );
// };

// export default NotificationSetting;