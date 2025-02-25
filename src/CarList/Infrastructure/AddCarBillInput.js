import React from 'react';
import { TextInput } from 'react-native';

const AddCarBillInput = ({ inputValue, setInputValue }) => {
  return (
    <TextInput
      value={inputValue}
      onChangeText={setInputValue}
      placeholder="Añadir cambio realizado"
    />
  );
};

export default AddCarBillInput;
