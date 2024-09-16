import React from "react";
import "./Card.css";

const Card = ({ text, result }) => {
  return (
    <div className="fact-check-card">
      <p>{text}</p>
      <p className={`result ${result.toLowerCase()}`}>{result.toUpperCase()}</p>
    </div>
  );
};

export default Card;
