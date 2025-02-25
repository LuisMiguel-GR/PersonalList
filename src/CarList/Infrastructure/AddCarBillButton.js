import React from 'react';
import { Button } from 'react-native';

const AddCarBillButton = ({ handleAddCarBill }) => {
  return (
    <Button title="Añadir" onPress={handleAddCarBill} />
  );
};

export default AddCarBillButton;
