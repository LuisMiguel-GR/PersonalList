import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BillsScreenLogic from '../Domain/Hooks/BillsScreenLogic';
import styles from './../Presentation/Styles/stylesExtraIncome';
import db from '../../Config/firebase';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import { onSnapshot, collection } from 'firebase/firestore';

const ExtraIncome = ({ year, month, updateAmounts }) => {
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState([]);

  const { handleAddExtraIncome, handleDeleteExtraIncome } = BillsScreenLogic();

  useEffect(() => {
    let unsubscribe;
    if (user && modalVisible) {
      const userId = user.uid;
      const billsCollectionRef = collection(db, `users/${userId}/general-list/years/years-list/${year}/months/${month}/extra-income`);
      
      unsubscribe = onSnapshot(billsCollectionRef, (snapshot) => {
        const extraIncomeList = snapshot.docs.map(billDoc => ({
          id: billDoc.id,
          ...billDoc.data()
        }));
        setItems(extraIncomeList);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, year, month, modalVisible]);

  const addItem = () => {
    if (amount && description) {
      handleAddExtraIncome({ amount, description }, year, month);
      setAmount('');
      setDescription('');
      updateAmounts();
    }
  };

  const deleteItem = (id) => {
    handleDeleteExtraIncome(id, year, month);
    setItems(items.filter(item => item.id !== id));
    updateAmounts();
  };

  return (
    <View >
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
        <FontAwesome6 name="money-bill-trend-up" size={18} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.title}>Gastos extra</Text>
              <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <Text style={styles.itemText}>{item.amount}€ - {item.description}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.deleteButton}>
                      <FontAwesome name="trash" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
                contentContainerStyle={styles.flatListContent}
              />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputAmount}
                placeholder="Importe"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
              <TextInput
                style={styles.inputDescription}
                placeholder="Descripción"
                value={description}
                onChangeText={setDescription}
              />
              <TouchableOpacity onPress={addItem} style={styles.addButton}>
                <MaterialIcons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ExtraIncome;