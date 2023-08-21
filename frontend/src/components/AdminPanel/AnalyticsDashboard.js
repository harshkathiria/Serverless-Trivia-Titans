import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AnalyticsDashboard = () => {
  // Dummy data for the charts
  const barChartData = [
    { month: 'Jan', gameplayData: 65 },
    { month: 'Feb', gameplayData: 59 },
    { month: 'Mar', gameplayData: 80 },
    { month: 'Apr', gameplayData: 81 },
    { month: 'May', gameplayData: 56 },
    { month: 'Jun', gameplayData: 55 },
    { month: 'Jul', gameplayData: 40 },
  ];

  const lineChartData = [
    { week: 'Week1', userEngagement: 15 },
    { week: 'Week2', userEngagement: 25 },
    { week: 'Week3', userEngagement: 20 },
    { week: 'Week4', userEngagement: 32 },
    { week: 'Week5', userEngagement: 18 },
    { week: 'Week6', userEngagement: 24 },
  ];

  return (
    <div className="dashboard-container">
      <div className="chart">
        <h2>Gameplay Data</h2>
        <BarChart width={400} height={300} data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="gameplayData" fill="#FAA0A0" />
        </BarChart>
      </div>
      <div className="chart">
        <h2>User Engagement</h2>
        <LineChart width={400} height={300} data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="userEngagement" stroke="#FAA0A0" />
        </LineChart>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
