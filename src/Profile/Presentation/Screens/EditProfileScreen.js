import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const EditProfileScreen = ({ route, navigation }) => {
  const { field, value } = route.params;
  const [textValue, setTextValue] = useState(value);

  const handleSave = () => {
    console.log(`Guardando ${field}: ${textValue}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={field === 'nick' ? 'Nick' : field === 'email' ? 'Email' : 'Nombre completo'}
        value={textValue}
        onChangeText={(text) => setTextValue(text)}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Guardar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default EditProfileScreen;
