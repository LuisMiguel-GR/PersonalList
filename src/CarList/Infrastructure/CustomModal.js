import React from 'react';
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import stylesCustomModal from './../Presentation/Styles/stylesCustomModal';

const CustomModal = ({
  isVisible,
  toggleModal,
  addCarBill,
  isEditing,
  name, setName,
  description, setDescription,
  amount, setAmount,
  currentKms, setCurrentKms,
  nextKms, setNextKms
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={toggleModal}
    >
      <KeyboardAvoidingView behavior="padding" style={stylesCustomModal.modalOverlay}>
        <View style={stylesCustomModal.modalContent}>
        <Text h3 style={stylesCustomModal.title}>{isEditing ? 'Editar gasto' : 'Añadir gasto'}</Text>
        <Text style={stylesCustomModal.label}>Nombre</Text>
          <TextInput
            style={stylesCustomModal.input}
            placeholder="Nombre del cambio realizado"
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
          <Text style={stylesCustomModal.label}>Kms Actuales</Text>
          <TextInput
            style={stylesCustomModal.input}
            placeholder="Kms actuales"
            keyboardType="numeric"
            value={currentKms}
            onChangeText={setCurrentKms}
          />
          <Text style={stylesCustomModal.label}>Kms para el sigueinte cambio</Text>
          <TextInput
            style={stylesCustomModal.input}
            placeholder="Kms siguiente cambio"
            keyboardType="numeric"
            value={nextKms}
            onChangeText={setNextKms}
          />
          <View style={stylesCustomModal.modalButtons}>
            <TouchableOpacity onPress={toggleModal} style={stylesCustomModal.cancelButton}>
              <Text style={stylesCustomModal.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addCarBill} style={stylesCustomModal.addButton}>
              <Text style={stylesCustomModal.buttonText}>Añadir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CustomModal;

