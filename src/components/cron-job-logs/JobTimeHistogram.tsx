import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const HistoChart: React.FC<LogsChartProps> = ({ logs }) => {
  // Calculate the execution time histogram based on log duration
  const chartData = useMemo(() => {
    // Bin data based on execution time ranges (1-minute intervals from 0-1 min to 29-30 min)
    const bins: { [key: string]: number } = {};

    // Initialize bins for 0-30 minute intervals (30 bins total)
    for (let i = 0; i < 30; i++) {
      bins[`${i}-${i + 1} min`] = 0;
    }

    logs.forEach(log => {
      const duration = log.value.details.durationInMilliseconds; // duration in ms
      const durationInMinutes = Math.floor(duration / 60000); // Convert ms to minutes

      // If the duration is within 30 minutes, add it to the respective bin
      if (durationInMinutes < 30) {
        bins[`${durationInMinutes}-${durationInMinutes + 1} min`] += 1;
      } else {
        bins['30+ min'] = (bins['30+ min'] || 0) + 1; // For durations greater than 30 mins
      }
    });

    // Return bins as chart data
    return Object.keys(bins).map(key => ({
      name: key,
      count: bins[key],
    }));
  }, [logs]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#4CAF50" name="Execution Time Bins" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HistoChart;
