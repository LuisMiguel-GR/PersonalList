import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Image, ImageBackground, Alert } from 'react-native';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import styles from '../Styles/stylesLogin';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import db from '../../../Config/firebase';

const LoginScreen = ({ navigation, route }) => {
  const { auth, user, setUser, logout } = useUser();
  const [email, setEmail] = useState(user ? user.email : '');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [showBiometricOption, setShowBiometricOption] = useState(false);

  const dbFirestore = getFirestore();

  useEffect(() => {
    if (route.params?.resetFields) {
      setEmail('');
      setPassword('');
      setError('');
      setShowBiometricOption(false);
    }
    checkBiometricAvailability();
    checkFingerprintEnabled();
  }, [route.params]);

  useEffect(() => {
    if (user && biometricSupported) {
      checkFingerprintEnabled();
      setEmail(user.email);
    }
  }, [user, biometricSupported]);
 
  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricSupported(compatible && enrolled);
  };

  const checkFingerprintEnabled = async () => {
    try {
      if (user) {
        const userProfileRef = doc(dbFirestore, 'users', user.uid, 'profile', 'details');
        const docSnapshot = await getDoc(userProfileRef);
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          if (userData && userData.fingerprintEnabled === true) {
            setShowBiometricOption(true);
            authenticateUser();
          } else {
            setShowBiometricOption(false);
            navigation.navigate('Home');
          }
        } else {
          setShowBiometricOption(false);
          navigation.navigate('Home');
          setEmail(user.email);
        }
      }
    } catch (error) {
      console.error('Error al obtener el statusde la huella dactilar:', error);
      setShowBiometricOption(false);
    }
  };

  const authenticateUser = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación biométrica requerida',
    });

    if (result.success) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Autenticación fallida');
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigation.navigate('Home');
    } catch (error) {
      let errorMessage = 'Ha ocurrido un error al iniciar sesión. \nPor favor, inténtalo de nuevo.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El email es incorrecto. \nPor favor, comprueba que está correcto.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'El email o la contraseña no son válidos. \nPor favor, verifica tu email y contraseña e inténtalo de nuevo.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'El usuario no existe. \nPor favor, regístrate antes de iniciar sesión.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta. \nPor favor, verifica tus credenciales.';
          break;
        case 'auth/missing-password':
          errorMessage = 'Debes ingresar una contrasena.';
          break;
        default:
          errorMessage = error.message || errorMessage;
          break;
      }
      setError(errorMessage);
    }
  };

  return (
    <ImageBackground source={require('../../../../assets/fondos/fondo-claro-acuarelagris.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={require('../../../../assets/logo.png')} style={styles.logo} />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput 
          placeholder="Email" 
          onChangeText={setEmail}
          value={email}
          style={styles.input}
        />
        <View style={styles.passwordInputContainer}>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry={!passwordVisible}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIconContainer}>
            <MaterialIcons name={passwordVisible ? 'visibility' : 'visibility-off'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Acceder</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.link}>
          <Text>Crear usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.resetPasswordLink}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        {showBiometricOption && (
          <TouchableOpacity style={styles.biometricButton} onPress={authenticateUser}>
            <MaterialIcons name="fingerprint" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
