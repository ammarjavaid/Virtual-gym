import React from "react";
import "./button.scss";

const Button = ({ onClick, className, children, type }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`primary-button ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
