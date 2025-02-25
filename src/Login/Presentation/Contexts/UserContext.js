import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signOut, sendPasswordResetEmail, onAuthStateChanged, updateProfile } from 'firebase/auth';

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
      navigation.navigate('Login', { resetFields: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
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

  const updateUser = async (updatedUser) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoUrl,
        fingerprintEnabled: updatedUser.fingerprintEnabled,
      });
      setUser(auth.currentUser);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, auth, logout, resetPassword, resetSuccess, resetError, updateUser }}>
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
