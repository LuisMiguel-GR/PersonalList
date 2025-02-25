import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const BiometricAuthScreen = ({ onAuthenticated }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      checkBiometricAvailability();
    }
  }, [isFocused]);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert('Biometría no compatible en este dispositivo');
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert('No tienes biometría registrada en este dispositivo');
      return;
    }

    authenticateUser();
  };

  const authenticateUser = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación biométrica requerida',
    });

    if (result.success) {
      onAuthenticated();
    } else {
      Alert.alert('Autenticación fallida');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Presiona el botón para autenticar con biometría</Text>
      <Button title="Autenticar" onPress={authenticateUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
  },
});

export default BiometricAuthScreen;
