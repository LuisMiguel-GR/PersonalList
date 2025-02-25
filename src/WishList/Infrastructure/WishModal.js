import React, { useState, useEffect } from 'react';
import { updateDoc, collection, doc, getDocs, deleteDoc, setDoc, addDoc } from 'firebase/firestore';
import db from '../../Config/firebase';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import styles from '../Presentation/Styles/stylesWishModal';
import Icon from 'react-native-vector-icons/FontAwesome';

const WishModal = ({ wish, open, onClose }) => {
  const { user } = useUser();
  const [updatedWish, setUpdatedWish] = useState({ ...wish, urls: wish.urls || [] });

  useEffect(() => {
    const fetchUrls = async () => {
      if (user) {
        const urlsCollection = collection(db, `users/${user.uid}/wish-list/${wish.id}/urls`);
        const urlSnapshot = await getDocs(urlsCollection);
        const urls = urlSnapshot.docs.map(doc => ({
          id: doc.id,
          url: doc.data().url,
          amount: doc.data().amount || ''
        }));
        setUpdatedWish(prevWish => ({
          ...prevWish,
          urls: urls || []
        }));
      }
    };

    if (wish.id) {
      fetchUrls();
    }
  }, [wish, user]);

  const handleChange = (name, value) => {
    setUpdatedWish(prevWish => ({
      ...prevWish,
      [name]: value
    }));
  };

  const handleAddUrl = () => {
    setUpdatedWish(prevWish => ({
      ...prevWish,
      urls: [...prevWish.urls, { id: null, url: '', amount: '' }]
    }));
  };

  const handleUrlChange = (index, name, value) => {
    const newUrls = [...updatedWish.urls];
    newUrls[index][name] = value;
    setUpdatedWish(prevWish => ({
      ...prevWish,
      urls: newUrls
    }));
  };

  const handleUrlDelete = async (index) => {
    const urlToDelete = updatedWish.urls[index];
    if (urlToDelete.id) {
      await deleteDoc(doc(db, `users/${user.uid}/wish-list/${wish.id}/urls/${urlToDelete.id}`));
    }
    const newUrls = [...updatedWish.urls];
    newUrls.splice(index, 1);
    setUpdatedWish(prevWish => ({
      ...prevWish,
      urls: newUrls
    }));
  };

  const handleSave = async () => {
    if (user) {
      const cleanedAmount = updatedWish.amount ? updatedWish.amount.toString().replace(/\s/g, '') : '0';
      const amount = parseFloat(cleanedAmount);

      if (isNaN(amount)) {
        console.error('El importe debe ser un número válido.');
        Toast.show(
          `El importe debe ser un número válido`, Toast.TOP, {
            backgroundColor: 'red',
          }
        );
        return;
      }

      const wishRef = doc(db, `users/${user.uid}/wish-list`, wish.id);
      await updateDoc(wishRef, {
        name: updatedWish.name,
        description: updatedWish.description,
        amount: amount,
        updatedAt: new Date()
      });

      const urlsCollection = collection(db, `users/${user.uid}/wish-list/${wish.id}/urls`);
      await Promise.all(updatedWish.urls.map(async (urlItem) => {
        const cleanedUrlAmount = urlItem.amount ? urlItem.amount.toString().replace(/\s/g, '') : '0';
        const urlAmount = parseFloat(cleanedUrlAmount);

        if (urlItem.url.trim() !== '') { 
          if (urlItem.id) {
            const urlDoc = doc(urlsCollection, urlItem.id);
            await setDoc(urlDoc, { url: urlItem.url, amount: urlAmount });
          } else {
            await addDoc(urlsCollection, { url: urlItem.url, amount: urlAmount });
          }
        } else if (urlItem.id) {
          const urlDoc = doc(urlsCollection, urlItem.id);
          await deleteDoc(urlDoc);
        }
      }));

      onClose();
    }
  };

  if (!open) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Editar Deseo</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButtonX}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nombre:</Text>
            <TextInput
              style={styles.fieldInput}
              value={updatedWish.name}
              onChangeText={(text) => handleChange('name', text)}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Descripción:</Text>
            <TextInput
              style={styles.fieldInput}
              value={updatedWish.description}
              onChangeText={(text) => handleChange('description', text)}
            />
          </View>
          
          <View style={styles.fieldContainerUrls}>
            <View style={styles.inputContainerAmount}>
              <Text style={styles.fieldLabelAmount}>Importe:</Text>
              <TextInput
                style={styles.fieldInputAmount}
                placeholder="Importe"
                value={updatedWish.amount ? updatedWish.amount.toString() : ''}
                onChangeText={(text) => handleChange('amount', text)}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.addButtonUrl} onPress={handleAddUrl}>
              <Text style={styles.addButtonTextUrl}>Añadir URL</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.urlsContainer}>
            <View>
              {updatedWish.urls.length === 0 ? (
                <Text style={styles.noUrlsText}>No existen URLs</Text>
              ) : (
                updatedWish.urls.map((urlItem, index) => (
                  <View key={index} style={styles.urlItem}>
                    <TextInput
                      style={styles.urlInput}
                      placeholder="URL"
                      value={urlItem.url}
                      onChangeText={(text) => handleUrlChange(index, 'url', text)}
                    />
                    <TextInput
                      style={styles.urlInputAmount}
                      placeholder="Importe"
                      value={urlItem.amount !== undefined ? urlItem.amount.toString() : ''}
                      onChangeText={(text) => handleUrlChange(index, 'amount', text)}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={() => handleUrlDelete(index)}>
                      <Text style={styles.deleteButton}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default WishModal;
