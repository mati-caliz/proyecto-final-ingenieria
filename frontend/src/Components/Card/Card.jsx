import React from "react";
import "./Card.css";

const Card = ({ title, text, result }) => {
  return (
    <div className="fact-check-card">
      <h3>{title}</h3>
      <p>{text}</p>
      &nbsp;
      <p className={`result ${result.toLowerCase()}`}>{result.toUpperCase()}</p>
    </div>
  );
};

export default Card;
