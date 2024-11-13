import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LogsChartProps {
  logs: LogEntry[];
}

interface LogValue {
  timestamp: string;
  status: 'success' | 'failed';
  message: string;
  details: {
    durationInMilliseconds: number;
    totalOrdersProcessed
?: number;
    error?: string;
  };
}

interface LogEntry {
  id: string;
  key: string;
  container: string;
  value: LogValue;
}

const LogsChart: React.FC<LogsChartProps> = ({ logs }) => {
  // Calculate the success and failure counts
  const chartData = useMemo(() => {
    const successCount = logs.filter(log => log.value.status === 'success').length;
    const failureCount = logs.filter(log => log.value.status === 'failed').length;

    return [
      { name: 'Success', value: successCount },
      { name: 'Failure', value: failureCount },
    ];
  }, [logs]);

  // Colors for the Pie chart slices
  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
     
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          label
        >
          {chartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LogsChart;
