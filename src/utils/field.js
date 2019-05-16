import React from 'react';

export default function Field({ id, label, error, ...props }) {
  return (
    <div className="ant-row ant-form-item">
      <div className="ant-col ant-form-item-label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="ant-col ant-form-item-control-wrapper">
        <input id={id} type="text" {...props} className="ant-input" />
      </div>

      {error && <div className="ant-form-explain">{error}</div>}
    </div>
  );
}
