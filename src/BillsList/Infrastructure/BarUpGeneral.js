import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import Modal from 'react-native-modal';
import BillsScreenLogic from '../Domain/Hooks/BillsScreenLogic';
import Toast from 'react-native-simple-toast';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const BarUpGeneral = ({ sortBills, salary, onUpdateSalary, remainingMoney, totalAmount }) => {
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const { handleSort, handleAddSalary, getSalaryByUser, getTotalAmountByUser, getRemainingAmountByUser } = BillsScreenLogic();
  const [newSalary, setNewSalary] = useState(salary);
  const [newTotalAmount, setTotalAmount] = useState(salary);
  const [newRemainingMoney, setRemainingMoney] = useState(salary);

  const handleUpdateSalary = () => {
    onUpdateSalary(newSalary);
    handleAddSalary(newSalary);
    setModalVisible(false);
    Toast.show(
      'Guardado correctamente', Toast.TOP, {
        backgroundColor: 'blue',
      }
    );
  };

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      getSalaryByUser(userId).then((fetchedSalary) => setNewSalary(fetchedSalary));
      getTotalAmountByUser(userId).then((fetchedTotalAmount) => setTotalAmount(fetchedTotalAmount));
      getRemainingAmountByUser(userId).then((fetchedRemainingAmount) => setRemainingMoney(fetchedRemainingAmount));
    }
  }, [salary]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 5 }}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ padding: 10 }}>
        <FontAwesome5 name="coins" size={18} color="#fff" />
      </TouchableOpacity>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.7}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={{ 
          backgroundColor: '#1c2431', 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20, 
          padding: 24,
          borderWidth: 1.5,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderBottomWidth: 0,
        }}>
          <Text style={{ 
            color: '#ffffff', 
            fontSize: 18, 
            fontWeight: 'bold', 
            marginBottom: 15,
            textAlign: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            paddingBottom: 10
          }}>
            Ingresa el importe total del mes
          </Text>
          <TextInput
            placeholder="Ingresa un número"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={newSalary}
            onChangeText={(text) => setNewSalary(text)}
            keyboardType="numeric"
            style={{ 
              color: '#5caece', 
              borderBottomWidth: 1.5, 
              borderBottomColor: 'rgba(255, 255, 255, 0.15)', 
              paddingVertical: 10, 
              marginBottom: 20,
              fontSize: 18,
              textAlign: 'center'
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={{ 
                backgroundColor: '#d9534f', 
                padding: 12, 
                borderRadius: 8,
                width: '48%',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleUpdateSalary} 
              style={{ 
                backgroundColor: '#5caece', 
                padding: 12, 
                borderRadius: 8,
                width: '48%',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BarUpGeneral;
