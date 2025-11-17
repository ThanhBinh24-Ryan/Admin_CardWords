import { DashboardStats } from "./DashboardStats";
import { DashboardCharts } from "./DashboardCharts";
import { DashboardRecent } from "./DashboardRecent";
import './styles/DashboardPage.css'
export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Khối thống kê nhanh */}
      <DashboardStats />

      {/* Biểu đồ */}
      <DashboardCharts />

      {/* Hoạt động gần đây */}
      <DashboardRecent />
    </div>
  );
}
