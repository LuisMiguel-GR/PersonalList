import React, { useState, useEffect } from 'react';
import { View, TextInput,  Button, Text, TouchableOpacity  } from 'react-native';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import { IconButton, Menu } from 'react-native-paper';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast';
import { FontAwesome6 } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const EditValue = ({ sortBills, salary, onUpdateSalary, remainingMoney, totalAmount  }) => {
  const { user } = useUser();
  const [iconMenuVisible, setIconMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState(number);
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
    }
  }, [salary]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="coins" size={16} color="#fff" />
        </TouchableOpacity>
       <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View style={{ backgroundColor: 'white', padding: 20 }}>
          <Text style={{ marginBottom: 10 }}>Ingresa el importe total del mes</Text>
          <TextInput
            placeholder="Ingresa un número"
            value={newSalary}
            onChangeText={(text) => setNewSalary(text)}
            keyboardType="numeric"
            style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10 }}
          />
          <TouchableOpacity onPress={handleUpdateSalary} style={{ backgroundColor: '#5caece', padding: 10, borderRadius: 5 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default EditValue;
