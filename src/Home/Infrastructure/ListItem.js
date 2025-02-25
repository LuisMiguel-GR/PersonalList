import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Button } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Swipeable } from 'react-native-gesture-handler';
import styles from '../Presentation/Styles/stylesHome';
import HomeScreenLogic from '../../Home/Domain/Hooks/HomeScreenLogic';


const ListItem = ({ item, onPaidChange, onDeleteItem, onUpdateItem }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState(item.name);
  const [newItemDescription, setNewItemDescription] = useState(item.description);
  const [newItemAmount, setNewItemAmount] = useState(item.amount);
  const [isChecked, setIsChecked] = useState(item.paid);
  const { handleUpdateGasto } = HomeScreenLogic();


  const handleLongPress = () => {
    setModalVisible(true);
  };

  const handleDelete = () => {
    onDeleteItem(item.id);
    setModalVisible(false);
  };

  const handleUpdate = () => {
    handleUpdateGasto(item.id, {
      name: newItemName,
      description: newItemDescription,
      amount: newItemAmount
    });
    setModalVisible(false);
  };

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
    onPaidChange(item.id, !isChecked);
  };

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <Button
          title="Eliminar"
          onPress={handleDelete}
          color="red"
        />
      </View>
    );
  };

  return (
    
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <TouchableOpacity onLongPress={handleLongPress}>
        <View style={styles.containerItem}>
          <CheckBox
            checked={isChecked}
            onPress={toggleCheckBox}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            checkedIcon={<Text style={styles.customCheckbox}>☑</Text>}
            uncheckedIcon={<Text style={styles.customCheckbox}>☐</Text>}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.textGasto}>{item.name}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <Text style={styles.amountText}>{item.amount} €</Text>
        </View>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text>Editar Nombre</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewItemName}
                value={newItemName}
              />
              <Text>Editar Descripción</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewItemDescription}
                value={newItemDescription}
              />
              <Text>Editar Cantidad</Text>
              <TextInput
                style={styles.input}
                onChangeText={setNewItemAmount}
                value={newItemAmount ? newItemAmount.toString() : ''}
                keyboardType="numeric"
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Guardar" onPress={handleUpdate} />
              </View>
            </View>
          </View>
        </Modal>
      </Swipeable>

  );
};

export default ListItem;
