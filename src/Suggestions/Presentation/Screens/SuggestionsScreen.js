import React, { useState } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, ScrollView, TouchableOpacity, Linking, Image, Modal } from 'react-native';
import styles from '../Styles/stylesSuggestions';
import Toast from 'react-native-simple-toast';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import db from '../../../Config/firebase';
import { collection, addDoc } from 'firebase/firestore';


const Suggestions = () => {
  const { user } = useUser();
  const [suggestion, setSuggestion] = useState('');
  const [imageClickCount, setImageClickCount] = useState(0);
  const [clicksLeft, setClicksLeft] = useState(6);
  const [showModal, setShowModal] = useState(false);

  const handleSendSuggestion = async () => {
    if (suggestion.trim()) {
      try {
        await addDoc(collection(db, 'suggestions'), {
          text: suggestion,
          createdAt: new Date(),
          user: user ? user.uid : 'Anonymous',
          email: user ? user.email : 'Sin correo'
        });

        setSuggestion('');
        Toast.show(
          `Mil gracias por colaborar!`, Toast.TOP, {
            backgroundColor: '#5caece',
          }
        );
      } catch (error) {
        console.error('Error al enviar sugerencia: ', error);
      }
    }
  };

  const handleEmailPress = () => {
    const email = 'luismiguelgr@gmx.com';
    Linking.openURL(`mailto:${email}`);
  };

  const handleImageClick = () => {
    const newCount = imageClickCount + 1;
    setImageClickCount(newCount);

    const newClicksLeft = 6 - newCount;
    setClicksLeft(newClicksLeft);

    if (newClicksLeft === 3 || newClicksLeft === 2 || newClicksLeft === 1) {
      Toast.show(`¡Solo faltan ${newClicksLeft} clics más!`, Toast.SHORT);
    }

    if (newClicksLeft === 0) {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setImageClickCount(0);
    setClicksLeft(6);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.headerText}>
          Envíame una sugerencia relacionada con errores, funcionalidades nuevas, cambios de estilos, etc... o cualquier otra cosa interesante.
        </Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={8}
          placeholder="Escribe tu sugerencia aquí..."
          value={suggestion}
          onChangeText={text => setSuggestion(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleSendSuggestion}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
        <TouchableOpacity onPress={handleImageClick} style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/foto-huevo-pascua.png')}
            style={styles.image}
          />
        </TouchableOpacity>
          <Text style={styles.footerText}>Creado por Luis Miguel Garcia Rodriguez</Text>
          <TouchableOpacity onPress={handleEmailPress}><Text style={styles.blueText}>miguelgrdaw@gmail.com</Text></TouchableOpacity>
          <Text style={styles.versionText}>versión 1.1.1</Text>
        </View>

        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <Image
              source={require('../../../../assets/heart.gif')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>Por todos mis peludos!!!</Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Suggestions;