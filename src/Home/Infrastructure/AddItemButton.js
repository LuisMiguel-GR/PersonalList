import React from 'react';
import { Button } from 'react-native';

const AddGastoButton = ({ handleAddItem }) => {
  return (
    <Button title="Añadir" onPress={handleAddItem} />
  );
};

export default AddGastoButton;
