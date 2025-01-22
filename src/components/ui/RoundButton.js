import React from 'react';
import './roundButton.css';

export const RoundButton = ({onClick}) => {
  return (
    <button className="round-button" onClick={onClick}>
      <div className="pulse"></div>
      <i className="fa-solid fa-plus"></i>
    </button>
  );
};
