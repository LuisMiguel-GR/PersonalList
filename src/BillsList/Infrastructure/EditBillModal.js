import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './../Presentation/Styles/stylesEditBillModal';
import Slider from '@react-native-community/slider';

const EditBillModal = ({ isVisible, toggleModal, handleUpdate, name, setName, description, setDescription, amount, setAmount, periodicity, setPeriodicity }) => {
  const [useCurrentDate, setUseCurrentDate] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCheckboxToggle = () => {
    setUseCurrentDate(!useCurrentDate);
    if (useCurrentDate) {
      setCreatedAt('');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; 
      setCreatedAt(formattedDate);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={toggleModal}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Editar gasto</Text>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del nuevo gasto"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Importe</Text>
          <TextInput
            style={styles.input}
            placeholder="Importe"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <View>
            <Text style={styles.label}>Periocidad: cada {periodicity} {periodicity > 1 ? 'meses' : 'mes'}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={12}
              step={1}
              value={periodicity}
              minimumTrackTintColor="#5caece"
              maximumTrackTintColor="#000000"
              thumbTintColor="#5caece"
              onValueChange={setPeriodicity}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={toggleModal} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdate} style={styles.addButton}>
              <Text style={styles.buttonText}>Actualizar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditBillModal;