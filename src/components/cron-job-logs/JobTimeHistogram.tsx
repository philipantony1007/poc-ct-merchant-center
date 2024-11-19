import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface LogsChartProps {
  logs: LogEntry[];
}

interface LogValue {
  timestamp: string;
  status: 'success' | 'failed';
  message: string;
  details: {
    durationInMilliseconds: number;
    totalOrdersProcessed?: number;
    error?: string;
  };
}

interface LogEntry {
  id: string;
  key: string;
  container: string;
  value: LogValue;
}

const HistoChart: React.FC<LogsChartProps> = ({ logs }) => {
  // Prepare chart data with formatted timestamp and duration in seconds
  const chartData = useMemo(() => {
    return logs.map((log) => {
      const formattedTimestamp = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(log.value.timestamp));

      return {
        timestamp: formattedTimestamp, // Format timestamp as DD-MM-YYYY
        date: log.value.details.durationInMilliseconds / 1000, // Convert duration to seconds
        status: log.value.status, // Include status to determine bar color
      };
    });
  }, [logs]);

  return (
    <div style={{ padding: '20px' }}>
      {/* Heading */}
      <h2 style={{ textAlign: 'left' }}>Histogram - Job Execution Time</h2>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart 
          data={chartData} 
          margin={{
            top: 80, 
            right: 80, 
            bottom: 80, 
            left: 90
          }} // Add margin around the chart
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            label={{ value: "Timestamp", position: "insideBottomRight", offset: -5 }} 
            angle={-90}
            textAnchor="middle" // Center the labels
            dy={80} // Adjust vertical positioning to ensure they don't overlap
          />
          <YAxis 
            label={{ 
              value: "Duration (sec)",  // Label updated to reflect seconds
              angle: -90, 
              position: "insideLeft", 
              dx: 10, // Add horizontal padding
              dy: -10, // Add vertical padding to move the label away from the axis values
            }}
            dy={10} // Adjust vertical position of the Y-axis label
          />
          <Tooltip formatter={(value) => `${value} sec`} /> {/* Update tooltip to show seconds */}
          <Legend />
          <Bar dataKey="date" barSize={60}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.status === 'failed' ? '#FF4C4C' : '#4CAF50'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoChart;
