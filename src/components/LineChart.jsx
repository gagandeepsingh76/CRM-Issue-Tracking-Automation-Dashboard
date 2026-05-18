import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

const LineChart = ({ data, labels, title, datasetLabel }) => {
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

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
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
