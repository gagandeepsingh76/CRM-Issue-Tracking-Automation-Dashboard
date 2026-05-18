import PropTypes from "prop-types";

const PageTransition = ({ children }) => {
  return <div className="animate-page-enter">{children}</div>;
};

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageTransition;
