import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import styles from '../Styles/stylesSignUp';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../Config/firebase'; 

const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();

  const handleSignup = async () => {
    try {
        if (displayName.length < 3) {
            throw new Error('El nombre de usuario debe tener al menos 3 caracteres.');
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('El correo electrónico no es válido.');
        }
    
        if (password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
  
        try {
            const userCredential = await  createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userProfileRef = doc(db, 'users', user.uid, 'profile', 'details');
            await setDoc(userProfileRef, {
              nick: user.displayName,
              email: user.email,
              name: user.displayName,
              lastName: '',
              avatar: '',
              fingerprintEnabled: false,
            });

            navigation.navigate('Login');
          } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
              throw new Error('El correo electrónico ya está en uso. \nPor favor, utiliza otro correo electrónico.');
            } else {
              throw error;
            }
          }
    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <ImageBackground source={require('../../../../assets/fondos/fondo-claro-acuarelagris.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../../../../assets/logo.png')} style={styles.logo} />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          placeholder="Nombre de usuario"
          value={displayName}
          onChangeText={setDisplayName}
          style={styles.input}
        />
        <TextInput
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleSignup} style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
          <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión aquí</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground> 
  );
};

export default SignupScreen;