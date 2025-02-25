import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Modal, View, Text, TextInput, Dimensions, ImageBackground, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { CheckBox } from 'react-native-elements';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import styles from '../../Presentation/Styles/stylesBillsList';
import BillList from '../../Infrastructure/BillList';
import BarUpGeneral from '../../Infrastructure/BarUpGeneral';
import { Menu, Provider, Button } from 'react-native-paper';
import CustomModal from '../../Infrastructure/CustomModal';
import CopyBillsModal from '../../Infrastructure/CopyBillsModal';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useInitializeUser from '../../Domain/Hooks/useInitializeUser';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import db from '../../../Config/firebase';
import stylesCustomModal from './../../Presentation/Styles/stylesCustomModal';
import BillsScreenLogic from '../../Domain/Hooks/BillsScreenLogic';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';

import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";

const BillsListScreen = ({ navigation }) => {
  const { user, logout } = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setNewBill] = useState('');
  const [description, setDescription] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [amount, setAmount] = useState('');
  const [periodicity, setPeriodicity] = useState(1);
  const [years, setYears] = useState([]);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [isLoadingYears, setIsLoadingYears] = useState(true);
  const [addBillTrigger, setAddBillTrigger] = useState(false);
  const [salaryRef, setNewSalary] = useState('');
  const [sliderValuePeriodicity, setSliderValuePeriodicity] = useState(1);

  // Popover opciones
  const [visible, setVisible] = useState(false);
  const [isCopyModalVisible, setCopyModalVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);


  const { salary, bills, setSalary, handleAddSalary, handleAddBill, handleSort } = BillsScreenLogic();

  const maxVisibleYears = 5;

  useInitializeUser(user?.uid);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BarUpGeneral
        salary={salary} bills={bills} onUpdateSalary={updateSalary}
        />
      ),
    });
  }, [navigation, bills, salary]);

  const updateSalary = (newSalary) => {
    handleAddSalary(newSalary);
    setNewSalary();
  };

  useEffect(() => {
    setNewSalary();
  }, [salary, bills]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const yearsCollectionRef = collection(db, 'users', user.uid, 'general-list', 'years', 'years-list');
        const yearsSnapshot = await getDocs(yearsCollectionRef);

        if (yearsSnapshot.empty) {
          console.error('No se encontraron documentos de años.');
          setIsLoadingYears(false);
          return;
        }

        const yearsList = yearsSnapshot.docs.map(yearDoc => ({
          id: yearDoc.id,
          data: yearDoc.data(),
        }));

        setYears(yearsList);

        setRoutes(yearsList.map(year => ({ key: year.id.toString(), title: year.id.toString() })));

        const currentYear = new Date().getFullYear().toString();
        const currentIndex = yearsList.findIndex(year => year.id === currentYear);
        setIndex(currentIndex > -1 ? currentIndex : 0);
      } catch (error) {
        console.error('Error al obtener los años: ', error);
      } finally {
        setIsLoadingYears(false);
      }
    };

    if (user?.uid) {
      fetchYears();
    }
  }, [user]);

  const handleIndexChange = (newIndex) => {
    setIndex(newIndex);
  };

  const handleAddBillList = async () => {
    handleAddBill(
      {
        name: name,
        description: description,
        amount: amount,
        paid: false,
        periodicity: periodicity,
        createdAt: createdAt
      }
    );
    setNewBill('');
    setDescription('');
    setAmount('');
    setCreatedAt('');
    setSliderValuePeriodicity(1);
    toggleModal();
  };
  

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

  const renderScene = ({ route }) => {
    const year = route.key;
    return (
      <View style={styles.centralContainer}>
        <BillList
          year={year}
          name={name}
          description={description}
          amount={amount}
          createdAt={createdAt}
          clearModalData={() => {
            setNewBill('');
            setDescription('');
            setAmount('');
            setCreatedAt('');
            setModalVisible(false);
          }}
        />
      </View>
    );
  };



  const handleLogout = async () => {
    await logout(navigation);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const sliderChangePeriodicity = (value) => {
    setPeriodicity(value);
    setSliderValuePeriodicity(value);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../../assets/fondos/fondo-oscuro-montanas.png')}
          style={styles.imageBackground}
        >
          {isLoadingYears ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={handleIndexChange}
              initialLayout={{ width: Dimensions.get('window').width }}
              renderTabBar={props => (
                <TabBar
                  {...props}
                  scrollEnabled={true}
                  indicatorStyle={{ backgroundColor: 'white' }}
                  style={{ backgroundColor: 'black' }}
                />
              )}
            />
          )}
          <View style={styles.addBillButtonContainer}>
            <TouchableOpacity onPress={toggleModal} style={styles.addBillButton}>
              <MaterialCommunityIcons name="bank-plus" size={24} color="black" style={styles.addBillButtonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.addBillButton}>
        <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
      </TouchableOpacity>

      {visible && (
        <Animated.View
          entering={SlideInUp.duration(300)}
          exiting={SlideOutUp.duration(300)}
          style={[
            styles.bubbleContainer,
            { left: 10, top: -60 },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setCopyModalVisible(true);
              setVisible(false);
            }}
            style={styles.bubbleOption}
          >
            <Text>Copiar gastos</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
           
          <CopyBillsModal
            isVisible={isCopyModalVisible}
            onClose={() => setCopyModalVisible(false)}
            userId={user.uid}
            selectedMonth={routes[index]?.key}
            onCopyExpenses={() => {
              console.log('Gastos copiados correctamente');
              setCopyModalVisible(false);
            }}
          />

          </View>

          <Modal
              visible={isModalVisible}
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
                    onChangeText={setNewBill}
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
                  <View>
                    <Text style={stylesCustomModal.labelFecha}>Periocidad: cada {sliderValuePeriodicity} {sliderValuePeriodicity > 1 ? 'meses' : 'mes'}</Text>
                    <Slider
                      style={{ width: '100%', height: 40 }}
                      minimumValue={0}
                      maximumValue={12}
                      step={1}
                      value={periodicity}
                      minimumTrackTintColor="#5caece"
                      maximumTrackTintColor="#000000"
                      thumbTintColor="#5caece"
                      onValueChange={sliderChangePeriodicity}
                    />
                  </View>

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
                          placeholder="AAAA-MM-DD"
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
                    <TouchableOpacity onPress={handleAddBillList} style={stylesCustomModal.addButton}>
                      <Text style={stylesCustomModal.buttonText}>Añadir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </Modal>


        </ImageBackground>
      </View>
    </Provider>
  );
};

export default BillsListScreen;
