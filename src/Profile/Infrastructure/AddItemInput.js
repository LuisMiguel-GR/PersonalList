import React from 'react';
import { TextInput } from 'react-native';
import { styles } from '../Presentation/Styles/stylesHome';

const AddItemInput = ({ inputValue, setInputValue }) => {
  return (
    <TextInput
      value={inputValue}
      onChangeText={setInputValue}
      placeholder="Añadir nuevo gasto"
    />
  );
};

export default AddItemInput;
