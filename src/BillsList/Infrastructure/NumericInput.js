import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';

const NumericInput = ({ value, onChangeText, style, placeholder }) => {
  const [displayValue, setDisplayValue] = useState(value?.toString() || '');

  useEffect(() => {
    setDisplayValue(value?.toString() || '');
  }, [value]);

  const handleChange = (text) => {
    const cleaned = text
      .replace(/[^0-9]/g, '')
      .replace(/^0+/, '0')
      .slice(0, 8);

    if (cleaned !== displayValue) {
    setDisplayValue(cleaned);
    }
  };

  return (
    <TextInput
      style={{
        minHeight: 40,
        paddingHorizontal: 10,
        includeFontPadding: false,
        textAlignVertical: 'center',
        fontSize: 16,
        ...style
      }}
      value={displayValue}
      onChangeText={handleChange}
      placeholder={placeholder}
      keyboardType="number-pad"
      selectTextOnFocus
      onBlur={() => {
        if (displayValue && onChangeText) {
          const formatted = (parseFloat(displayValue)/100).toFixed(2);
          onChangeText(formatted);
        }
      }}
    />
  );
};

export default NumericInput;

// Ejemplo en BillsListScreen.js
import NumericInput from '../Infrastructure/NumericInput';

// Reemplaza todos los TextInput numéricos con:
<NumericInput
  value={editedAmount}
  onChangeText={setEditedAmount}
  style={styles.editInput}
/>

