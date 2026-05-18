import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const PieChart = ({ data, labels, title }) => {
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

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
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
