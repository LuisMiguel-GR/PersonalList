import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import BillsListScreen from '../../../BillsList/Presentation/Screens/BillsListScreen';
import CarListScreen from '../../../CarList/Presentation/Screens/CarListScreen';
import ProfileScreen from '../../../Profile/Presentation/Screens/ProfileScreen';
import SuggestionsScreen from '../../../Suggestions/Presentation/Screens/SuggestionsScreen';
import HeaderRight from '../../../Config/header';
import LoginScreen from '../../../Login/Presentation/Screens/LoginScreen';
import SignUpScreen from '../../../Login/Presentation/Screens/SignUpScreen';
import ResetPasswordScreen from '../../../Login/Presentation/Screens/ResetPasswordScreen';
import WishListScreen from '../../../WishList/Presentation/Screens/WishListScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: 'gray',
        },
        headerTintColor: '#fff',
        // headerRight: route.name === 'Home' ? () => <HeaderRight title={route.name} /> : undefined,
      })}
    >
      <Stack.Screen name="Login" options={{ title: 'Iniciar sesión' }} component={LoginScreen} />
      <Stack.Screen name="SignUp" options={{ title: 'Crear usuario' }} component={SignUpScreen} />
      <Stack.Screen name="ResetPassword" options={{ title: 'Cambiar contraseña' }} component={ResetPasswordScreen} />
   
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'PersonalList' }} 
      />
      <Stack.Screen 
        name="BillsListScreen" 
        component={BillsListScreen} 
        options={{ title: 'Gastos generales' }}
      />
      <Stack.Screen 
        name="CarListScreen" 
        component={CarListScreen} 
        options={{ title: 'Gastos coche' }}
      />
      <Stack.Screen 
        name="WishListScreen" 
        component={WishListScreen} 
        options={{ title: 'Lista de deseos' }}
      />
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ title: 'Mi Perfil' }} 
      />
      <Stack.Screen 
        name="SuggestionsScreen" 
        component={SuggestionsScreen} 
        options={{ title: 'Sugerencias' }} 
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;