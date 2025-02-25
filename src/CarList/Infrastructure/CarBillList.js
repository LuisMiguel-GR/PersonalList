import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import CarBill from './CarBill';
import { Menu } from 'react-native-paper';
import { doc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import loadSunshineFont from './../../Config/useFonts';
import stylesListFatherCar from '../Presentation/Styles/stylesListFatherCar';
import CustomModal from './CustomModal';
import CarListScreenLogic from './../Domain/Hooks/CarListScreenLogic';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const CarBillList = ({ carBills }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setNewCarBill] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currentKms, setCurrentKms] = useState('');
  const [nextKms, setNextKms] = useState('');
  const [selectedYear, setSelectedYear] = useState(null);
  const [iconMenuVisible, setIconMenuVisible] = useState(false);
  const [expandedYears, setExpandedYears] = useState({});
  const [visibleCards, setVisibleCards] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);

  const { handleAddCarBill, handleSort } = CarListScreenLogic();

  useEffect(() => {
    loadSunshineFont().then(() => setFontsLoaded(true));
    initializeExpandedYears();
  }, []);

  useEffect(() => {
    setIsLoading(false);
    if (carBills && carBills.length > 0) {
      setTotalAmount(calculateTotalAmount(carBills));
    }
  }, [carBills]);

  const initializeExpandedYears = () => {
    const initialExpanded = {};
    const initialVisible = {};
    Object.keys(groupedCarBills).forEach(year => {
      initialExpanded[year] = false;
      initialVisible[year] = false;
    });
    setExpandedYears(initialExpanded);
    setVisibleCards(initialVisible);

    // Expandir automáticamente el año actual al iniciar
    const currentYear = new Date().getFullYear().toString();
    setExpandedYears(prev => ({
      ...prev,
      [currentYear]: true
    }));
  };

  const toggleModal = (year) => {
    setSelectedYear(year);
    setModalVisible(!isModalVisible);
  };

  const addCarBill = () => {
    const createdAt = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
    handleAddCarBill({ name, description, amount, currentKms, nextKms, createdAt });
    setNewCarBill('');
    setDescription('');
    setAmount('');
    setCurrentKms('');
    setNextKms('');
    // Expandir la tarjeta del año seleccionado después de añadir el gasto
    setExpandedYears(prev => ({
      ...prev,
      [selectedYear]: true
    }));
    toggleModal();
  };

  const handlePaidChange = async (id, newPaidStatus) => {
    const userDocRef = doc(db, 'users', user.uid);
    const carBillsCollectionRef = collection(userDocRef, 'bills');
    const carBillDocRef = doc(carBillsCollectionRef, id);
    await updateDoc(carBillDocRef, { paid: newPaidStatus });
  };

  const handleDeleteCarBill = async (id) => {
    const userDocRef = doc(db, 'users', user.uid);
    const carBillsCollectionRef = collection(userDocRef, 'bills');
    const carBillDocRef = doc(carBillsCollectionRef, id);
    await deleteDoc(carBillDocRef);
  };

  const convertFirestoreTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  };

  const calculateTotalAmount = (carBills) => {
    return carBills.reduce((total, carBill) => total + parseFloat(carBill.amount), 0);
  };

  const groupedCarBills = carBills.reduce((acc, carBill) => {
    const date = convertFirestoreTimestampToDate(carBill.createdAt);
    const year = date.getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(carBill);
    return acc;
  }, {});

  const currentYear = new Date().getFullYear().toString();
  if (!groupedCarBills[currentYear]) {
    groupedCarBills[currentYear] = [];
  }

  const sortedYears = Object.keys(groupedCarBills).sort((a, b) => b - a);

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const toggleVisibleCard = (year) => {
    setVisibleCards((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const sortCarBills = (type, year) => {
    handleSort(type, year);
  };

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      {sortedYears.map((year) => (
        <View key={year} style={[stylesListFatherCar.cardContainer, expandedYears[year] && { height: 450 }]}>
          <TouchableOpacity onPress={() => toggleYear(year)}>
            <View style={[stylesListFatherCar.yearHeader, { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
              <TouchableOpacity onPress={() => toggleVisibleCard(year)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={stylesListFatherCar.yearText}>{year}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => toggleModal(year)}>
                  <Icon name="plus" type="feather" color="#fff" size={20} style={stylesListFatherCar.plusIconContainer} />
                </TouchableOpacity>
                <Icon name={expandedYears[year] ? 'chevron-up' : 'chevron-down'} type="feather" />
              </View>
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={!expandedYears[year]}>
            <View style={{ height: 400 }}>
            <Text style={stylesListFatherCar.totalAmountText}>Total gastado: {parseFloat(totalAmount).toFixed(2).replace(".", ",")}€</Text>
              <FlatList
                data={groupedCarBills[year]}
                renderItem={({ item }) => (
                  <CarBill
                    carBill={item}
                    onPaidChange={handlePaidChange}
                    onDeleteCarBill={handleDeleteCarBill}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
              />
            </View>
          </Collapsible>
          <CustomModal
            isVisible={isModalVisible}
            toggleModal={() => toggleModal(selectedYear)}
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
        </View>
      ))}
    </View>
  );
};

export default CarBillList;
