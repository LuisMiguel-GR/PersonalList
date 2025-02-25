import React from 'react';
import { TextInput } from 'react-native';

const AddBillInput = ({ inputValue, setInputValue }) => {
  return (
    <TextInput
      value={inputValue}
      onChangeText={setInputValue}
      placeholder="Añadir nuevo gasto"
    />
  );
};

export default AddBillInput;
