import React from 'react';
import './dial.css';

const DialWithRadialFill = ({ percentage }) => {
  percentage = percentage/2;
  const outerDialStyle = {
    background: `conic-gradient(from 270deg, black ${percentage}%, white ${percentage}%)`,
  };


  return (
    <div className="outer-dial" style={outerDialStyle}>
      <div className="inner-dial"></div>
      <span className="dial-text">{percentage}</span>
    </div>
  );
};

export default DialWithRadialFill;
