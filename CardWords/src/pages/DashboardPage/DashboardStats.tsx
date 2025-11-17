import { FaUser, FaBook, FaBell, FaGamepad } from "react-icons/fa";
import './styles/DashboardStats.css'
export function DashboardStats() {
  const stats = [
    { title: "Người dùng", value: "1,230", icon: <FaUser />, color: "bg-blue-500" },
    { title: "Từ vựng", value: "8,540", icon: <FaBook />, color: "bg-green-500" },
    { title: "Thông báo", value: "35", icon: <FaBell />, color: "bg-yellow-500" },
    { title: "Lượt học", value: "12,430", icon: <FaGamepad />, color: "bg-purple-500" },
  ];

  return (
    <div className="stats-container">
      {stats.map((item, index) => (
        <div key={index} className="stat-card">
          <div className={`stat-icon ${item.color}`}>
            {item.icon}
          </div>
          <div className="stat-info">
            <p>{item.title}</p>
            <h3>{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}