import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, useUser } from './src/Login/Presentation/Contexts/UserContext';
import AuthStackNavigator from './src/Login/Presentation/Screens/AuthStackNavigator';
import HomeStackNavigator from './src/Home/Presentation/Screens/HomeStackNavigator';
import { ActivityIndicator, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import loadSunshineFont from './src/Config/useFonts';
import BiometricAuthScreen from './src/Login/Presentation/Screens/BiometricAuthScreen';
import LoginScreen from './src/Login/Presentation/Screens/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      setIsLoading(false);
    };

    checkUserStatus();
  }, [user]);

  useEffect(() => {
    const loadFonts = async () => {
      await loadSunshineFont();
      setFontsLoaded(true);
    };
  
    loadFonts();
  }, []);
  
  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        {/* {!user ? ( */}
          {/* <AuthStackNavigator /> */}
        {/* ) : ( */}
          <HomeStackNavigator />
        {/* )} */}
      </NavigationContainer>
    </PaperProvider>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppNavigator />
    </UserProvider>
  );
};

export default App;
