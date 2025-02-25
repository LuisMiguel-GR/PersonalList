import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signOut, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const auth = getAuth();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, [auth]);

  const logout = async (navigation) => {
    try {
      await signOut(auth);
      setUser(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const signUp = async () => {
  
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regPassword= /^[a-zA-Z0-9]{6,}$/
   
  if (reg.test(email) === false){
      Alert.alert(
        "Email",
        "Please insert a valid email",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
  }  
  else if(password === null || regPassword.test(password) === false){
    Alert.alert(
      "Password",
      "Please enter a password of minimum 6 charachters",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  }
  else{
      await app.emailPasswordAuth.registerUser({ email, password });
      Alert.alert(
        "Confirm User",
        "An email has been sent to you in order to confirm your email",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    }
  };

  const resetPassword = async (email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      await sendPasswordResetEmail(auth, email);
      setResetSuccess(true);
      setResetError('');
    } catch (error) {
      console.error('Error al resetear la contraseña:', error);
      setResetError(error.message);
      setResetSuccess(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, auth, logout, resetPassword, resetSuccess, resetError }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser utilizado dentro de un UserProvider');
  }
  return context;
};
