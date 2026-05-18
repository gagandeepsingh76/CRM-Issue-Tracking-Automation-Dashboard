import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../hooks/useTheme';

// Register the necessary components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const LineChart = ({ data, labels, title, datasetLabel }) => {
  const { isDarkMode } = useTheme();

  const lineData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: datasetLabel,
        data: data,
        fill: false,
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        tension: 0.1,
      },
    ],
  }), [data, datasetLabel, labels]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#CBD5E1' : '#374151',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#CBD5E1' : '#374151',
        },
        grid: {
          color: isDarkMode ? '#334155' : '#E5E7EB',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#CBD5E1' : '#374151',
        },
        grid: {
          color: isDarkMode ? '#334155' : '#E5E7EB',
        },
      },
    },
  }), [isDarkMode]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-950 dark:text-white">
        {title}
      </h2>
      <div className="h-72">
        <Line data={lineData} options={chartOptions} />
      </div>
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  datasetLabel: PropTypes.string,
};

LineChart.defaultProps = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  title: "Trend",
  datasetLabel: "Value",
};

export default memo(LineChart);
