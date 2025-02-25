import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, KeyboardAvoidingView, TextInput } from 'react-native';
import { CheckBox, Button, Card, Icon } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import styles from '../Presentation/Styles/stylesCarBillsList';
import CarListScreenLogic from '../Domain/Hooks/CarListScreenLogic';
import Collapsible from 'react-native-collapsible';
import Toast from 'react-native-simple-toast';

const CarBill = ({ carBill, onPaidChange, onDeleteCarBill }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newCarBillName, setNewCarBillName] = useState(carBill.name);
  const [newCarBillDescription, setNewCarBillDescription] = useState(carBill.description);
  const [newCarBillAmount, setNewCarBillAmount] = useState(carBill.amount);
  const [newCarBillCurrentKms, setNewCarBillCurrentKms] = useState(carBill.currentKms);
  const [newCarBillNextKms, setNewCarBillNextKms] = useState(carBill.nextKms);
  const [isChecked, setIsChecked] = useState(carBill.paid);
  const { handleUpdateCarBill, handleDeleteCarBill, handleUpdatePaidStatus } = CarListScreenLogic();
  const [detailsVisible, setDetailsVisible] = useState(false);

  const handlePress = () => {
    setDetailsVisible(!detailsVisible);
  };

  const handleLongPress = () => {
    setNewCarBillName(carBill.name);
    setNewCarBillDescription(carBill.description);
    setNewCarBillAmount(carBill.amount);
    setNewCarBillCurrentKms(carBill.currentKms);
    setNewCarBillNextKms(carBill.nextKms);
    setModalVisible(true);
  };

  const handleDelete = () => {
    onDeleteCarBill(carBill.id);
    handleDeleteCarBill(carBill.id);
    Toast.show(
      'Eliminado correctamente', Toast.TOP, {
        backgroundColor: 'red',
      }
    );
  };

  const handleUpdate = () => {
    handleUpdateCarBill(carBill.id, {
      name: newCarBillName,
      description: newCarBillDescription,
      amount: newCarBillAmount,
      currentKms: newCarBillCurrentKms,
      nextKms: newCarBillNextKms,
      paid: isChecked,
    });
    setModalVisible(false);
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
    handleUpdatePaidStatus(carBill.id, !isChecked);
  };

  const renderRightActions = () => (
    <View style={styles.rightActions}>
      <Button
        title="Eliminar"
        onPress={handleDelete}
        buttonStyle={{ backgroundColor: 'red', color: 'white' }}
      />
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity onLongPress={handleLongPress}>
        <Card containerStyle={styles.cardContainer}>
          <View style={styles.containerCarBill}>
            <CheckBox
              checked={isChecked}
              onPress={toggleCheckBox}
              containerStyle={styles.checkboxContainer}
            />
            <Text style={styles.textCarBill}>{carBill.name}</Text>
            <Text style={styles.amountText}>{carBill.amount} €</Text>
            <TouchableOpacity onPress={handlePress} style={styles.expandButton}>
              <Icon name={detailsVisible ? 'chevron-up' : 'chevron-down'} type="feather" color="#000" />
            </TouchableOpacity>
          </View>
          <Collapsible collapsed={!detailsVisible}>
            <View style={styles.detailsContainer}>
              <Text style={styles.titleText}>Descripcion: <Text style={styles.descriptionText}>{carBill.description}</Text></Text>
              <View style={styles.kmsContainer}>
                <Text style={styles.kmsText}>Kms actuales: <Text style={styles.kmsTextVar}>{carBill.currentKms}</Text></Text>
              </View>
              <View>
                <Text style={styles.kmsText}>Kms próximo cambio: <Text style={styles.kmsTextVar}>{carBill.nextKms}</Text></Text>
              </View>
            </View>
          </Collapsible>
        </Card>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar cambio</Text>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewCarBillName}
              value={newCarBillName}
              placeholder="Ingrese el nuevo nombre"
            />
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewCarBillDescription}
              value={newCarBillDescription}
              placeholder="Ingrese la nueva descripción"
            />
            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewCarBillAmount}
              value={newCarBillAmount ? newCarBillAmount.toString() : ''}
              keyboardType="numeric"
              placeholder="Ingrese la nueva cantidad"
            />
            <Text style={styles.label}>Kms Actuales</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewCarBillCurrentKms}
              value={newCarBillCurrentKms ? newCarBillCurrentKms.toString() : ''}
              keyboardType="numeric"
              placeholder="Ingrese los kms actuales"
            />
            <Text style={styles.label}>Kms para el siguiente cambio</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewCarBillNextKms}
              value={newCarBillNextKms ? newCarBillNextKms.toString() : ''}
              keyboardType="numeric"
              placeholder="Ingrese los kms para el siguiente cambio"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate} style={styles.addButton}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Swipeable>
  );
};

export default CarBill;
