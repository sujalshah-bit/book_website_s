import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Button = ({ text, url, onClick }) => {
  const handleClick = (event) => {
    // If an onClick function is provided, call it
    if (onClick) {
      onClick(event);
    }
  };
  return (
    <Link to={url} onClick={handleClick}>
      <button className="primary-button" >
        {text}
      </button>
    </Link>
  );
};

export default Button;
