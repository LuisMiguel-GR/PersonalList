import React, { useState, useEffect } from 'react';
import { View, TextInput,  Button, Text, TouchableOpacity  } from 'react-native';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import { IconButton, Menu } from 'react-native-paper';
import Modal from 'react-native-modal';
import CarListScreenLogic from '../Domain/Hooks/CarListScreenLogic';
import Toast from 'react-native-simple-toast';
import { FontAwesome6 } from '@expo/vector-icons';

const BarUpCarList = ({ sortCarBills, salary, onUpdateSalary  }) => {
  const { user } = useUser();
  const [iconMenuVisible, setIconMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [number, setNumber] = useState(number);
  const { handleSort, handleAddSalary, getSalaryByUser } = CarListScreenLogic();
  const [newSalary, setNewSalary] = useState(salary);

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

    }
  }, [salary]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
      <Menu
            visible={iconMenuVisible}
            onDismiss={() => setIconMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter"
                size={20}
                onPress={() => setIconMenuVisible(true)}
              />
            }
          >
            <Menu.Item onPress={() => { sortCarBills('noPaid'); setIconMenuVisible(false); }} title="Ordenar por no pagado" />
            <Menu.Item onPress={() => { sortCarBills('paid'); setIconMenuVisible(false); }} title="Ordenar por pagado" />
            <Menu.Item onPress={() => { sortCarBills('highestAmount'); setIconMenuVisible(false); }} title="Ordenar por mayor importe" />
            <Menu.Item onPress={() => { sortCarBills('lowestAmount'); setIconMenuVisible(false); }} title="Ordenar por menor importe" />
            <Menu.Item onPress={() => { sortCarBills('creation'); setIconMenuVisible(false); }} title="Ordenar por creación" />
            <Menu.Item onPress={() => { sortCarBills('alphabeticalAsc'); setIconMenuVisible(false); }} title="Ordenar alfabéticamente (A-Z)" />
            <Menu.Item onPress={() => { sortCarBills('alphabeticalDesc'); setIconMenuVisible(false); }} title="Ordenar alfabéticamente (Z-A)" />
          </Menu>
          
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <FontAwesome6 name="money-bill-transfer" size={16} color="black" />
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

export default BarUpCarList;
