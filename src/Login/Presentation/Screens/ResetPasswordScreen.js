import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import styles from '../Styles/stylesResetPassword';

const ResetPasswordScreen = () => {
  const { resetPassword } = useUser();
  const [email, setEmail] = useState('');
  const [textOk, setOk]       = useState('');

  const handleResetPassword = async () => {
    await resetPassword(email);
    setOk('Se te ha enviado un email para poder cambiar la contrasena.');
  };

  return (
    <ImageBackground source={require('../../../../assets/fondos/fondo-claro-acuarelagris.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../../../../assets/logo.png')} style={styles.logo} />

        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        {textOk ? <Text style={styles.textOk}>{textOk}</Text> : null}

        <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
          <Text style={styles.buttonText}>Resetear contraseña</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default ResetPasswordScreen;