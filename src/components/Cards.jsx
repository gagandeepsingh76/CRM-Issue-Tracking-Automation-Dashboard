import PropTypes from 'prop-types';

const Cards = ({ title, value }) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-slate-300">
        {title}
      </h2>
      <p className="mt-2 text-2xl font-bold text-gray-950 dark:text-white">
        {value}
      </p>
    </div>
  );
};

Cards.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Cards;
