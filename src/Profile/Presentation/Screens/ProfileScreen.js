import { useUser } from '../../../Login/Presentation/Contexts/UserContext';

import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableWithoutFeedback, Image, Text } from 'react-native';
import { Button, List, TextInput, Modal, Portal, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from '../Styles/stylesProfile';
import EditValue from '../../Infrastructure/EditValue';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const defaultAvatar = require('../../../../assets/avatar-default.png');

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useUser();

  const [nick, setNick] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatarUrl] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const userProfileRef = doc(db, 'users', user.uid, 'profile', 'details');
          const unsubscribe = onSnapshot(userProfileRef, (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.data();
              setNick(userData.nick || '');
              setName(userData.name || '');
              setLastName(userData.lastName || '');
              setEmail(user?.email || '');
              setAvatarUrl(userData.avatar || '');
              setBiometricEnabled(userData.fingerprintEnabled || false);
            } else {
              console.log('No se encontró el documento del perfil del usuario.');
            }
          });
  
          return unsubscribe;
        } catch (error) {
          console.error('Error al cargar el perfil del usuario:', error.message);
        }
      }
    };
  
    loadUserProfile();
  
    return () => {
    };
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'details');
      const fieldToUpdate = editingField === 'nick' ? 'nick' :
                            editingField === 'name' ? 'name' :
                            editingField === 'lastName' ? 'lastName' :
                            editingField === 'email' ? 'email' : '';

      if (fieldToUpdate) {
        await updateDoc(userProfileRef, {
          [fieldToUpdate]: editValue,
        });

        const updatedUser = {
          ...user,
          [fieldToUpdate]: editValue,
        };

        await updateUser(updatedUser);
      }

      setEditingField(null);
      setEditValue('');

    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const openImagePickerAsync = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Se necesita permiso para acceder a la galería de fotos.');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (pickerResult.cancelled) {
        console.log('Selección de imagen cancelada.');
        return;
      }

      if (!pickerResult.assets || pickerResult.assets.length === 0) {
        console.error('La respuesta del picker no contiene assets válidos.');
        alert('Ocurrió un error al seleccionar la imagen. Por favor, intenta nuevamente.');
        return;
      }

      const localUri = pickerResult.assets[0].uri;
      const response = await fetch(localUri);
      const blob = await response.blob();

      const path = `users/${user.uid}/profile/images/profile.jpg`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, blob);

      const photoURL = await getDownloadURL(storageRef);

      await updateDoc(userProfileRef, {
        avatar: photoURL,
      });

      setAvatarUrl(photoURL);
      setShowPhotoModal(false);

    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      alert('Ocurrió un error al cargar la imagen. Por favor, intenta nuevamente.');
    }
  };

  const showImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      openImagePickerAsync();
    } else {
      alert('Se necesita acceso a la galería de fotos para cambiar la foto de perfil.');
    }
  };

  const toggleBiometricEnabled = async () => {
    try {
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'details');
      await updateDoc(userProfileRef, {
        fingerprintEnabled: !biometricEnabled
      });

      setBiometricEnabled(!biometricEnabled);
    } catch (error) {
      console.error('Error updating biometric status:', error);
      alert('Ocurrió un error al actualizar la configuración de huella dactilar. Por favor, intenta nuevamente.');
    }
  };

  const handleLogout = async () => {
    try {
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'details');
      await updateDoc(userProfileRef, {
        fingerprintEnabled: false
      });
      
      logout(navigation);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderEditModal = () => {
    return (
      <Modal visible={editingField !== null} onDismiss={() => setEditingField(null)} contentContainerStyle={[styles.modalContainer, { justifyContent: 'flex-end', margin: 0 }]}>
        <View style={styles.editModalContent}>
          <Text style={styles.editModalLabel}>
            {editingField === 'nick' && 'Editar Nick'}
            {editingField === 'name' && 'Editar Nombre'}
            {editingField === 'lastName' && 'Editar Apellidos'}
          </Text>
          <TextInput
            value={editValue}
            onChangeText={setEditValue}
            mode="outlined"
            style={styles.input}
            autoFocus
          />
           <View style={styles.editModalButtonsContainer}>
            <Button mode="outlined" onPress={() => { setEditingField(null); setEditValue(''); }} style={styles.modalButtonCancel}>Cancelar</Button>
            <Button mode="contained" onPress={handleUpdateProfile} style={styles.modalButtonSave}>Guardar</Button>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <TouchableWithoutFeedback onPress={() => setShowPhotoModal(true)}>
            <View style={styles.avatarContainer}>
              <Image source={avatar ? { uri: avatar } : defaultAvatar} style={styles.avatar} />
              <Button mode="outlined" onPress={() => setShowPhotoModal(true)}>Cambiar foto</Button>
            </View>
          </TouchableWithoutFeedback>
          
          

          <List.Item
            title="Nick"
            description={<Text style={styles.text}>{nick}</Text>}
            left={() => <List.Icon icon="account-circle" />}
            right={() => (
              <TouchableWithoutFeedback onPress={() => { setEditingField('nick'); setEditValue(nick); }}>
                <View style={styles.editIconContainer}>
                  <List.Icon icon="pencil" />
                </View>
              </TouchableWithoutFeedback>
            )}
            style={styles.listItem}
          />

          <List.Item
            title="Nombre"
            description={<Text style={styles.text}>{name}</Text>}
            left={() => <List.Icon icon="account-circle" />}
            right={() => (
              <TouchableWithoutFeedback onPress={() => { setEditingField('name'); setEditValue(name); }}>
                <View style={styles.editIconContainer}>
                  <List.Icon icon="pencil" />
                </View>
              </TouchableWithoutFeedback>
            )}
            style={styles.listItem}
          />

          <List.Item
            title="Apellidos"
            description={<Text style={styles.text}>{lastName}</Text>}
            left={() => <List.Icon icon="account" />}
            right={() => (
              <TouchableWithoutFeedback onPress={() => { setEditingField('lastName'); setEditValue(lastName); }}>
                <View style={styles.editIconContainer}>
                  <List.Icon icon="pencil" />
                </View>
              </TouchableWithoutFeedback>
            )}
            style={styles.listItem}
          />

          <List.Item
            title="Email"
            description={<Text style={styles.text}>{email}</Text>}
            left={() => <List.Icon icon="email" />}
            
            style={styles.listItem}
          />

          <List.Item
            title="Configurar Huella Dactilar"
            left={() => <List.Icon icon="fingerprint" />}
            onPress={toggleBiometricEnabled}
            right={() => <List.Icon icon={biometricEnabled ? 'check' : 'close'} />}
          />

        <View style={styles.logoutButtonContainer}>
          <Button mode="contained" style={styles.logoutButton} onPress={handleLogout}>
            Cerrar sesión
          </Button>
        </View>
        </ScrollView>
       
        <Portal>
          <Modal visible={showPhotoModal} onDismiss={() => setShowPhotoModal(false)} contentContainerStyle={styles.modalContainer}>
            <View>
              <Button mode="outlined" onPress={showImagePicker}>Seleccionar de la galería</Button>
            </View>
          </Modal>
        </Portal>

        {renderEditModal()}
        
      </View>
    </Provider>
  );
};

export default ProfileScreen;
