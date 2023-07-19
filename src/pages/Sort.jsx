import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;

const Sort = ({ sortOrder, onSortOrderChange }) => {
  const handleChange = (value) => {
    onSortOrderChange(value);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <span style={{ marginRight: '8px' }}>Sort by:</span>
      <Select value={sortOrder} onChange={handleChange} style={{ width: '120px' }}>
        <Option value='distance'>Distance</Option>
        <Option value='asc'>A-Z</Option>
        <Option value='desc'>Z-A</Option>
      </Select>
    </div>
  );
};

Sort.propTypes = {
  sortOrder: PropTypes.string.isRequired,
  onSortOrderChange: PropTypes.func.isRequired,
};

export default Sort;
