import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import LoginScreen from './LoginScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createStackNavigator();

const AuthStackNavigator = ({ navigation }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigation.navigate('HomeStack');
    }
  }, [user, navigation]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{ title: 'Iniciar sesión' }} component={LoginScreen} />
      <Stack.Screen name="SignUp" options={{ title: 'Crear usuario' }} component={SignUpScreen} />
      <Stack.Screen name="ResetPassword" options={{ title: 'Cambiar contraseña' }} component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;