import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import './styles/DashboardCharts.css';

export function DashboardCharts() {
  const data = [
    { date: "01/10", words: 20 },
    { date: "02/10", words: 30 },
    { date: "03/10", words: 25 },
    { date: "04/10", words: 40 },
    { date: "05/10", words: 50 },
  ];

  return (
    <div className="chart-container">
      <h2 className="chart-title">Số người đăng ký học</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="words" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}