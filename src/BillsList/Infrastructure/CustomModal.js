import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import stylesCustomModal from './../Presentation/Styles/stylesCustomModal';

const CustomModal = ({ isVisible, toggleModal, handleAddBill, name, setName, description, setDescription, amount, setAmount, createdAt, setCreatedAt}) => {
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
      <KeyboardAvoidingView behavior="padding" style={stylesCustomModal.modalOverlay}>
        <View style={stylesCustomModal.modalContent}>
          <Text style={stylesCustomModal.title}>Añadir gasto</Text>
          
          <Text style={stylesCustomModal.label}>Nombre</Text>
          <TextInput
            style={stylesCustomModal.input}
            placeholder="Nombre del nuevo gasto"
            value={name}
            onChangeText={setName}
          />

          <Text style={stylesCustomModal.label}>Descripción</Text>
          <TextInput
            style={stylesCustomModal.input}
            placeholder="Descripción"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={stylesCustomModal.label}>Importe</Text>
          <TextInput
            style={stylesCustomModal.input}
            placeholder="Importe"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <View style={stylesCustomModal.checkboxContainer}>
            <CheckBox
              checked={useCurrentDate}
              onPress={handleCheckboxToggle}
              containerStyle={stylesCustomModal.checkbox}
            />
            <Text style={stylesCustomModal.labelFecha}>Fecha actual</Text>
          </View>

          {!useCurrentDate && (
            <>
              <Text style={stylesCustomModal.label}>Fecha del gasto</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  style={stylesCustomModal.input}
                  placeholder="YYYY-MM-DD"
                  value={createdAt}
                  editable={false}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </>
          )}

          <View style={stylesCustomModal.modalButtons}>
            <TouchableOpacity onPress={toggleModal} style={stylesCustomModal.cancelButton}>
              <Text style={stylesCustomModal.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAddBill} style={stylesCustomModal.addButton}>
              <Text style={stylesCustomModal.buttonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomModal;