import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
    DataProvider.propTypes={
        children : PropTypes.any
    }
  const [data, setData] = useState({ message: 'Initial message', value: 0 });

  const updateData = (newData) => {
    setData({ ...data, ...newData });
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;