import './styles/DashboardRecent.css';

export function DashboardRecent() {
  const recent = [
    { id: 1, user: "Nguyễn Văn A", action: "Đăng ký tài khoản", time: "2 phút trước" },
    { id: 2, user: "Trần Thị B", action: "Hoàn thành session 5", time: "10 phút trước" },
    { id: 3, user: "Admin", action: "Thêm từ mới", time: "1 giờ trước" },
  ];

  return (
    <div className="recent-activities">
      <h2>Học viên giỏi</h2>
      <ul>
        {recent.map(item => (
          <li key={item.id}>
            <div className="activity-info">
              <p>{item.user}</p>
              <span>{item.action}</span>
            </div>
            <span>{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}