// // components/GameStatsCard.tsx
// import React from 'react';

// interface StatsCardProps {
//   title: string;
//   value: number | string;
//   subtitle?: string;
//   type?: 'default' | 'score' | 'accuracy' | 'sessions' | 'percentage';
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
//   icon?: string;
//   className?: string;
// }

// export const GameStatsCard: React.FC<StatsCardProps> = ({
//   title,
//   value,
//   subtitle,
//   type = 'default',
//   trend,
//   icon,
//   className = ''
// }) => {
//   const getValueColor = () => {
//     if (type === 'accuracy' || type === 'percentage') {
//       if (typeof value === 'number') {
//         if (value >= 90) return 'text-green-600';
//         if (value >= 70) return 'text-blue-600';
//         if (value >= 50) return 'text-yellow-600';
//         return 'text-red-600';
//       }
//     }
    
//     if (type === 'score') {
//       if (typeof value === 'number') {
//         if (value >= 90) return 'text-green-600';
//         if (value >= 70) return 'text-blue-600';
//         if (value >= 50) return 'text-yellow-600';
//         return 'text-red-600';
//       }
//     }
    
//     return 'text-gray-900';
//   };

//   const getValueDisplay = () => {
//     if (type === 'accuracy' || type === 'percentage') {
//       if (typeof value === 'number') {
//         return `${value}%`;
//       }
//     }
//     if (type === 'score') {
//       if (typeof value === 'number') {
//         return value.toFixed(1);
//       }
//     }
//     return value;
//   };

//   const getCardColor = () => {
//     if (type === 'accuracy' || type === 'percentage') {
//       if (typeof value === 'number') {
//         if (value >= 90) return 'border-green-200 bg-green-50';
//         if (value >= 70) return 'border-blue-200 bg-blue-50';
//         if (value >= 50) return 'border-yellow-200 bg-yellow-50';
//         return 'border-red-200 bg-red-50';
//       }
//     }
//     return 'border-gray-200 bg-white';
//   };

//   return (
//     <div className={`rounded-lg border p-6 ${getCardColor()} ${className}`}>
//       <div className="flex items-center">
//         {icon && (
//           <div className="flex-shrink-0">
//             <span className="text-2xl">{icon}</span>
//           </div>
//         )}
//         <div className="ml-4 flex-1">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//               <p className={`text-2xl font-bold ${getValueColor()}`}>
//                 {getValueDisplay()}
//               </p>
//               {subtitle && (
//                 <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
//               )}
//             </div>
            
//             {trend && (
//               <div className={`flex items-center text-sm ${
//                 trend.isPositive ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 <span className={trend.isPositive ? '▲' : '▼'}>
//                   {trend.isPositive ? '↑' : '↓'}
//                 </span>
//                 <span className="ml-1">{Math.abs(trend.value)}%</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GameStatsCard;