import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Modal, TouchableOpacity } from 'react-native';
import styles from '../Presentation/Styles/stylesWishAddModal';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddWishModal = ({ open, onClose, onAddWish }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [urls, setUrls] = useState([]);

  const handleAddUrl = () => {
    setUrls(prevUrls => [...prevUrls, { url: '', amount: '' }]);
  };

  const handleUrlChange = (index, key, value) => {
    const newUrls = [...urls];
    newUrls[index][key] = value;
    setUrls(newUrls);
  };

  const handleUrlDelete = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleSave = () => {
    const cleanedAmount = amount.replace(/\s/g, '');
    const newWish = {
      name,
      description,
      amount: cleanedAmount,
      urls,
      bought: false,
      createdAt: new Date(),
    };
    onAddWish(newWish);
    setName('');
    setDescription('');
    setAmount('');
    setUrls([]);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Añadir nuevo deseo</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButtonX}>
            <Icon name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nombre:</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="Nombre"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Descripción:</Text>
            <TextInput
              style={[styles.fieldInput]}
              placeholder="Descripción"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
          
          <View style={styles.fieldContainerUrls}>
            <View style={styles.inputContainerAmount}>
              <Text style={styles.fieldLabelAmount}>Importe:</Text>
              <TextInput
                style={styles.fieldInputAmount}
                placeholder="Importe"
                value={amount}
                onChangeText={text => setAmount(text.replace(/\s/g, ''))}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity style={styles.addButtonUrl} onPress={handleAddUrl}>
              <Text style={styles.addButtonTextUrl}>Añadir URL</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.urlsContainer}>
            {urls.map((urlObj, index) => (
              <View key={index} style={styles.urlItem}>
                <TextInput
                  style={styles.urlInput}
                  placeholder="URL"
                  value={urlObj.url}
                  onChangeText={(text) => handleUrlChange(index, 'url', text)}
                />
                <TextInput
                  style={styles.fieldInputAmount}
                  placeholder="Importe"
                  value={urlObj.amount}
                  onChangeText={(text) => handleUrlChange(index, 'amount', text.replace(/\s/g, ''))}
                  keyboardType="numeric"
                />
                <TouchableOpacity onPress={() => handleUrlDelete(index)}>
                  <Text style={styles.deleteButton}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default AddWishModal;
