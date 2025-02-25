import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Button, Text, View, Modal, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import CarListScreenLogic from '../../Domain/Hooks/CarListScreenLogic';
import styles from '../../Presentation/Styles/stylesListFatherCar';
import CarBillList from '../../Infrastructure/CarBillList';
import { Menu, Provider, Appbar, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CustomModal from '../../Infrastructure/CustomModal';
import BarUpCarList from '../../Infrastructure/BarUpCarList';

const CarListScreen = ({ navigation }) => {
  const { user, logout } = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setNewCarBill] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currentKms, setCurrentKms] = useState('');
  const [nextKms, setNextKms] = useState('');
  const [salaryRef, setNewSalary] = useState('');
  const [iconMenuVisible, setIconMenuVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const textInputRef = useRef(null);

  const { carBills, handleAddCarBill, handleSort, handleAddSalary, getSalaryByUser } = CarListScreenLogic();
  const [salary, setSalary] = useState(0);
  const [remainingMoney, setRemainingMoney] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const updateSalary = (newSalary) => {
    handleAddSalary(newSalary);
  };

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      getSalaryByUser(userId).then((fetchedSalary) => setSalary(fetchedSalary));
    }
    const totalAmountSpent = carBills.reduce((total, carBill) => total + parseFloat(carBill.amount), 0);
    const remaining = salary - totalAmountSpent;

    setRemainingMoney(remaining);
    setTotalExpenses(totalAmountSpent);
  }, [salary, carBills]);

  const handleLogout = async () => {
    await logout(navigation);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addCarBill = () => {
    handleAddCarBill({ name, description, amount, currentKms, nextKms });
    setNewCarBill('');
    setDescription('');
    setAmount('');
    setCurrentKms('');
    setNextKms('');
    toggleModal();
  };

  const sortCarBills = (type) => {
    handleSort(type);
  };

  useLayoutEffect(() => {
    if (isModalVisible && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isModalVisible]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        null
      ),
    });
  }, [navigation, iconMenuVisible, menuVisible, carBills, salary]);

  return (
    <Provider>
      <View style={styles.containerMain}>
        <ImageBackground 
          source={require('../../../../assets/fondos/fondo-claro-papel.png')} 
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <CarBillList carBills={carBills} />
          <CustomModal
            isVisible={isModalVisible}
            toggleModal={toggleModal}
            addCarBill={addCarBill}
            name={name}
            setName={setNewCarBill}
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            currentKms={currentKms}
            setCurrentKms={setCurrentKms}
            nextKms={nextKms}
            setNextKms={setNextKms}
          />
        </ImageBackground>
      </View>
    </Provider>
  );
};

export default CarListScreen;
