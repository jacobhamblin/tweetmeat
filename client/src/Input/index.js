import React, { Component } from 'react';
import './Input.css';

const Input = ({ type, name, label, error, value, onChange }) => {
  return (
    <div className="input-container">
      <label for={name}>{label}</label>
      <div className="input-and-error">
        <input type={type} name={name} value={value} onChange={onChange} />
        <span className="error" style={{ display: error ? 'block' : 'none' }}>
          {error}
        </span>
      </div>
    </div>
  );
};

export default Input;
