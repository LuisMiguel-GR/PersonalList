import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Modal, View, Text, TextInput, ImageBackground, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import styles from '../../Presentation/Styles/stylesBillsList';
import BillList from '../../Infrastructure/BillList';
import BarUpGeneral from '../../Infrastructure/BarUpGeneral';
import { Provider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useInitializeUser from '../../Domain/Hooks/useInitializeUser';
import { collection, getDocs } from 'firebase/firestore';
import db from '../../../Config/firebase';
import stylesCustomModal from './../../Presentation/Styles/stylesCustomModal';
import BillsScreenLogic from '../../Domain/Hooks/BillsScreenLogic';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CheckBox } from 'react-native-elements';
import CopyBillsModal from '../../Infrastructure/CopyBillsModal';

const BillsListScreen = ({ navigation }) => {
  const { user } = useUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setNewBill] = useState('');
  const [description, setDescription] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [amount, setAmount] = useState('');
  const [periodicity, setPeriodicity] = useState(1);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonthId, setSelectedMonthId] = useState('');
  const [isLoadingYears, setIsLoadingYears] = useState(true);
  const [sliderValuePeriodicity, setSliderValuePeriodicity] = useState(1);
  const [isCopyModalVisible, setCopyModalVisible] = useState(false);

  const { salary, bills, handleAddSalary, handleAddBill } = BillsScreenLogic();

  useInitializeUser(user?.uid);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
          {/* Botón Copiar Gastos en la Barra de Navegación de Arriba de todo */}
          <TouchableOpacity 
            onPress={() => setCopyModalVisible(true)} 
            style={{ padding: 10, marginRight: 5 }}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="content-copy" size={20} color="#ffffff" />
          </TouchableOpacity>
          <BarUpGeneral
            salary={salary} bills={bills} onUpdateSalary={updateSalary}
          />
        </View>
      ),
    });
  }, [navigation, bills, salary, selectedMonthId]);

  const updateSalary = (newSalary) => {
    handleAddSalary(newSalary);
  };

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
        })).sort((a, b) => b.id.localeCompare(a.id));

        setYears(yearsList);

        const currentYear = new Date().getFullYear().toString();
        const hasCurrentYear = yearsList.some(year => year.id === currentYear);
        setSelectedYear(hasCurrentYear ? currentYear : (yearsList[0]?.id || ''));
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
            <View style={{ flex: 1 }}>
              {/* Selector de Años horizontal */}
              <View style={styles.yearSelectorContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.yearScrollContent}>
                  {years.map((y) => {
                    const isSelected = y.id === selectedYear;
                    return (
                      <TouchableOpacity
                        key={y.id}
                        style={[
                          styles.yearChip,
                          isSelected && styles.yearChipActive
                        ]}
                        onPress={() => setSelectedYear(y.id)}
                      >
                        <Text style={[
                          styles.yearChipText,
                          isSelected && styles.yearChipTextActive
                        ]}>
                          {y.id}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Lista Principal de Gastos (Con Selector de Meses y Card Fintech como Header) */}
              {selectedYear ? (
                <View style={styles.centralContainer}>
                  <BillList
                    year={selectedYear}
                    name={name}
                    description={description}
                    amount={amount}
                    createdAt={createdAt}
                    onMonthChange={(monthId) => setSelectedMonthId(monthId)}
                    clearModalData={() => {
                      setNewBill('');
                      setDescription('');
                      setAmount('');
                      setCreatedAt('');
                      setModalVisible(false);
                    }}
                  />
                </View>
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: 'white' }}>Seleccione un año para ver los gastos.</Text>
                </View>
              )}
            </View>
          )}

          {/* Botón de Acción Flotante Principal para Añadir Gasto */}
          <View style={styles.addBillButtonContainer}>
            <TouchableOpacity onPress={toggleModal} style={styles.addBillButton}>
              <MaterialCommunityIcons name="bank-plus" size={24} color="black" style={styles.addBillButtonIcon} />
            </TouchableOpacity>
          </View>

          {/* Modal para Añadir Gasto */}
          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={toggleModal}
          >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={stylesCustomModal.modalOverlay}>
              <View style={stylesCustomModal.modalContent}>
                <Text style={stylesCustomModal.title}>Añadir gasto</Text>
                
                <Text style={stylesCustomModal.label}>Nombre</Text>
                <TextInput
                  style={stylesCustomModal.input}
                  placeholder="Nombre del nuevo gasto"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={name}
                  onChangeText={setNewBill}
                />

                <Text style={stylesCustomModal.label}>Descripción</Text>
                <TextInput
                  style={stylesCustomModal.input}
                  placeholder="Descripción"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={description}
                  onChangeText={setDescription}
                />

                <Text style={stylesCustomModal.label}>Importe</Text>
                <TextInput
                  style={stylesCustomModal.input}
                  placeholder="Importe"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
                
                <View style={{ marginTop: 10 }}>
                  <Text style={stylesCustomModal.labelFecha}>Periodicidad: cada {sliderValuePeriodicity} {sliderValuePeriodicity > 1 ? 'meses' : 'mes'}</Text>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={12}
                    step={1}
                    value={periodicity}
                    minimumTrackTintColor="#5caece"
                    maximumTrackTintColor="#ffffff"
                    thumbTintColor="#5caece"
                    onValueChange={sliderChangePeriodicity}
                  />
                </View>

                <View style={stylesCustomModal.checkboxContainer}>
                  <CheckBox
                    checked={useCurrentDate}
                    onPress={handleCheckboxToggle}
                    containerStyle={stylesCustomModal.checkbox}
                    checkedColor="#5caece"
                    uncheckedColor="rgba(255, 255, 255, 0.4)"
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
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
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

          {/* Modal para Copiar Gastos General en la Raíz */}
          <CopyBillsModal
            isVisible={isCopyModalVisible}
            onClose={() => setCopyModalVisible(false)}
            userId={user?.uid}
            selectedMonth={selectedMonthId}
            onCopyExpenses={() => {
              console.log('Gastos copiados correctamente');
              setCopyModalVisible(false);
            }}
          />

        </ImageBackground>
      </View>
    </Provider>
  );
};

export default BillsListScreen;
