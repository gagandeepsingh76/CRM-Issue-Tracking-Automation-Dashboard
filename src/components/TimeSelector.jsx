import { useState } from 'react';
import PropTypes from 'prop-types';

const TimeSelector = ({ onSelectTime }) => {
  const [selectedTime, setSelectedTime] = useState('1 Week');

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    onSelectTime(time); 
  };

  return (
    <div>
      {/* Dropdown for small and medium screens */}
      <div className="block lg:hidden">
        <select
          value={selectedTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
        >
          {['1 Day', '1 Week', '1 Month', '1 Year'].map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons for large screens */}
      <div className="hidden lg:flex space-x-2">
        {['1 Day', '1 Week', '1 Month', '1 Year'].map((time) => (
          <button
            key={time}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              selectedTime === time
                ? 'bg-blue-600 text-white'
                : 'border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
            onClick={() => handleTimeChange(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

TimeSelector.propTypes = {
  onSelectTime: PropTypes.func.isRequired,
};

export default TimeSelector;
