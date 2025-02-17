import React from "react";
import "./Card.css";

const Card = ({ text }) => {
  return (
    <div className="fact-check-card">
      <p>{text}</p>
    </div>
  );
};

export default Card;
