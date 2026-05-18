import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../hooks/useTheme';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data, labels, title }) => {
  const { isDarkMode } = useTheme();

  const pieData = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Departments',
        data: data,
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#64748B',
        ],
      },
    ],
  }), [data, labels]);

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
  }), [isDarkMode]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-semibold text-gray-950 dark:text-white">
        {title}
      </h2>
      <div className="h-72">
        <Pie data={pieData} options={chartOptions} />
      </div>
    </div>
  );
};

PieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
};

PieChart.defaultProps = {
  labels: ['Marketing', 'Sales', 'Support'],
  title: "Distribution",
};

export default memo(PieChart);
