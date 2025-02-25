import React from 'react';
import { Button } from 'react-native';

const AddBillButton = ({ handleAddBill }) => {
  return (
    <Button title="Añadir" onPress={handleAddBill} />
  );
};

export default AddBillButton;
