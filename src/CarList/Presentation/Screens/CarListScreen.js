import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import CarListScreenLogic from '../../Domain/Hooks/CarListScreenLogic';
import { styles } from '../Styles/stylesCarBillsList';
import { Provider as PaperProvider } from 'react-native-paper';
import CustomModal from '../../Infrastructure/CustomModal';

const CarListScreen = ({ navigation }) => {
  const { user } = useUser();
  const {
    carBills,
    availableYears,
    salary,
    fetchBillsForYear,
    handleAddCarBill,
    getSalaryByUser,
    handleAddSalary,
    updateCarBill,
    deleteCarBill
  } = CarListScreenLogic();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    currentKms: '',
    nextKms: ''
  });
  const [editingBill, setEditingBill] = useState(null);
  
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears]);

  useEffect(() => {
    if (selectedYear) {
      fetchBillsForYear(selectedYear);
    }
  }, [selectedYear]);

  // Obtener salario al cargar
  useEffect(() => {
    if (user?.uid) {
      getSalaryByUser(user.uid).then(salary => {
        if (salary) setSalary(salary);
      });
    }
  }, [user]);

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleEditPress = (bill) => {
    setEditingBill(bill);
    setFormData({
      name: bill.name,
      description: bill.description || '',
      amount: bill.amount.toString(),
      currentKms: bill.currentKms?.toString() || '',
      nextKms: bill.nextKms?.toString() || ''
    });
    setModalVisible(true);
  };

  const handleDeletePress = async (billId) => {
    const confirmed = await showConfirmationAlert();
    if (confirmed) {
      await deleteCarBill(billId, selectedYear);
    }
  };

  const showConfirmationAlert = () => {
    return new Promise((resolve) => {
      Alert.alert(
        'Eliminar gasto',
        '¿Estás seguro de que quieres eliminar este gasto?',
        [
          { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
          { text: 'Eliminar', onPress: () => resolve(true), style: 'destructive' }
        ]
      );
    });
  };

  const handleSubmit = async () => {
    const billData = {
      name: formData.name,
      description: formData.description,
      amount: formData.amount,
      currentKms: formData.currentKms,
      nextKms: formData.nextKms,
      createdAt: editingBill ? editingBill.createdAt : new Date()
    };

    if (editingBill) {
      await updateCarBill(editingBill.id, billData, selectedYear);
    } else {
      await handleAddCarBill(billData);
    }

    resetForm();
  };

  const resetForm = () => {
    setModalVisible(false);
    setEditingBill(null);
    setFormData({
      name: '',
      description: '',
      amount: '',
      currentKms: '',
      nextKms: ''
    });
  };

  const renderBillItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditPress(item)}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="#5caece" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeletePress(item.id)}
        >
          <MaterialCommunityIcons name="delete" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="car" size={24} color="#5caece" />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.name}</Text>
        </View>
      </View>

      <View style={styles.descriptionAmountContainer}>
        {item.description && (
                <Text style={styles.cardDescription}>{item.description}</Text>
              )}
        <Text style={styles.cardAmount}>{item.amount}€</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardKms}>
          {item.currentKms ? `Actual: ${item.currentKms} km` : ''}
          {item.currentKms && item.nextKms ? ' - ' : ''}
          {item.nextKms ? `Próximo: ${item.nextKms} km` : ''}
        </Text>
        <Text style={styles.cardDate}>
          {new Date(item.createdAt?.seconds * 1000 || item.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short'
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.yearSelectorContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.yearScrollContent}
          >
            {availableYears.map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.yearButton,
                  selectedYear === year && styles.yearButtonActive
                ]}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={styles.yearButtonText}>{year}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>Total en {selectedYear}</Text>
          <Text style={styles.summaryAmount}>
            {carBills.reduce((total, bill) => total + (parseFloat(bill.amount) || 0), 0).toFixed(2)}€
          </Text>
        </View>

        <View style={styles.listContainer}>
          {carBills.length > 0 ? (
            <FlatList
              data={carBills}
              renderItem={renderBillItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="car-off" size={50} color="#bdc3c7" />
              <Text style={styles.emptyText}>No hay gastos registrados en {selectedYear}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPress}
        >
          <MaterialCommunityIcons name="plus" size={30} color="white" />
        </TouchableOpacity>

        <CustomModal
          isVisible={isModalVisible}
          toggleModal={() => {
            setModalVisible(false);
            setEditingBill(null);
          }}
          addCarBill={handleSubmit}
          isEditing={!!editingBill}
          {...formData}
          setName={(text) => setFormData({...formData, name: text})}
          setDescription={(text) => setFormData({...formData, description: text})}
          setAmount={(text) => setFormData({...formData, amount: text})}
          setCurrentKms={(text) => setFormData({...formData, currentKms: text})}
          setNextKms={(text) => setFormData({...formData, nextKms: text})}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default CarListScreen;


