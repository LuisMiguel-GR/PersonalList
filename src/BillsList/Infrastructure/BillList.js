import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Modal } from 'react-native';
import Bill from './Bill';
import db from '../../Config/firebase';
import { doc, collection, getDocs, getDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import stylesBillsList from '../Presentation/Styles/stylesBillsList';
import BillsScreenLogic from '../Domain/Hooks/BillsScreenLogic';
import loadSunshineFont from './../../Config/useFonts';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ExtraIncome from './ExtraIncome';

const monthTranslations = {
  january: "Enero",
  february: "Febrero",
  march: "Marzo",
  april: "Abril",
  may: "Mayo",
  june: "Junio",
  july: "Julio",
  august: "Agosto",
  september: "Septiembre",
  october: "Octubre",
  november: "Noviembre",
  december: "Diciembre"
};

const BillList = ({ year, name, description, amount, createdAt, clearModalData, onMonthChange }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [monthsData, setMonthsData] = useState([]);
  const [currentMonthId, setCurrentMonthId] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const { handleAddBill, handleSort } = BillsScreenLogic();

  useEffect(() => {
    loadSunshineFont().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const fetchMonthsData = async () => {
      try {
        if (!user || !year) return;
        setIsLoading(true);

        const monthsCollectionRef = collection(db, `users/${user.uid}/general-list/years/years-list/${year}/months`);
        const monthsSnapshot = await getDocs(monthsCollectionRef);

        if (monthsSnapshot.empty) {
          console.log('No se encontraron documentos de meses para el año:', year);
          setIsLoading(false);
          return;
        }

        const months = monthsSnapshot.docs.map(monthDoc => ({
          id: monthDoc.id,
          data: monthDoc.data(),
          bills: [],
          amounts: {}
        }));

        const monthNames = [
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"
        ];

        const currentYear = new Date().getFullYear().toString();
        const currentMonthIndex = new Date().getMonth();

        const orderedMonthsData = months.sort((a, b) => {
          const aIndex = monthNames.indexOf(a.data.name.toLowerCase());
          const bIndex = monthNames.indexOf(b.data.name.toLowerCase());

          if (year === currentYear) {
            const distanceFromCurrent = (index) =>
              index <= currentMonthIndex ? currentMonthIndex - index : index + 12;
            return distanceFromCurrent(aIndex) - distanceFromCurrent(bIndex);
          }

          return bIndex - aIndex;
        });

        setMonthsData(orderedMonthsData);

        const currentMonthName = monthNames[new Date().getMonth()];
        const currentMonth = orderedMonthsData.find(month => month.data.name.toLowerCase() === currentMonthName);

        const initialMonthId = currentMonth ? currentMonth.id : orderedMonthsData[0]?.id;
        if (initialMonthId) {
          setCurrentMonthId(initialMonthId);
          if (onMonthChange) {
            onMonthChange(initialMonthId);
          }
          await fetchBillsForMonth(initialMonthId, orderedMonthsData);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener los meses: ', error);
        setIsLoading(false);
      }
    };

    fetchMonthsData();
  }, [user, year]);

  useEffect(() => {
    if (currentMonthId) {
      const unsubscribeBills = onSnapshot(
        collection(db, `users/${user.uid}/general-list/years/years-list/${year}/months/${currentMonthId}/bills`),
        () => fetchBillsForMonth(currentMonthId)
      );

      const unsubscribeSalary = onSnapshot(
        doc(db, `users/${user.uid}/general-list/years/years-list/${year}/months/${currentMonthId}`),
        () => fetchBillsForMonth(currentMonthId)
      );

      return () => {
        unsubscribeBills();
        unsubscribeSalary();
      };
    }
  }, [user, year, currentMonthId]);

  const fetchBillsForMonth = async (monthId, currentMonthsData = monthsData, removedBillId = null) => {
    try {
      const monthIndex = currentMonthsData.findIndex(month => month.id === monthId);
      if (monthIndex === -1) return;

      const billsCollectionRef = collection(db, `users/${user.uid}/general-list/years/years-list/${year}/months/${monthId}/bills`);
      const billsSnapshot = await getDocs(billsCollectionRef);

      const bills = billsSnapshot.docs.map(billDoc => ({
        id: billDoc.id,
        data: billDoc.data()
      })).sort((a, b) => b.data.timestamp - a.data.timestamp);

      if (removedBillId) {
        const billIndex = bills.findIndex(bill => bill.id === removedBillId);
        if (billIndex !== -1) {
          bills.splice(billIndex, 1);
        }
      }

      const salaryDocRef = doc(db, `users/${user.uid}/general-list/years/years-list/${year}/months/${monthId}`);
      const salaryDoc = await getDoc(salaryDocRef);
      const salary = salaryDoc.exists() ? salaryDoc.data().salary : 0;

      const extraIncomeCollectionRef = collection(db, `users/${user.uid}/general-list/years/years-list/${year}/months/${monthId}/extra-income`);
      const extraIncomeSnapshot = await getDocs(extraIncomeCollectionRef);
      const extraIncomeTotal = extraIncomeSnapshot.docs.reduce((sum, doc) => sum + parseFloat(doc.data().amount), 0);
      const adjustedSalary = salary + extraIncomeTotal;

      const totalAmount = bills.reduce((sum, bill) => sum + parseFloat(bill.data.amount), 0);
      const amountPaid = bills.filter(bill => bill.data.paid).reduce((sum, bill) => sum + parseFloat(bill.data.amount), 0);
      const amountUnpaid = bills.filter(bill => !bill.data.paid).reduce((sum, bill) => sum + parseFloat(bill.data.amount), 0);
      const remaining = adjustedSalary - amountPaid;

      const amounts = {
        totalAmount,
        amountPaid,
        amountUnpaid,
        remaining
      };

      const newMonthsData = [...currentMonthsData];
      newMonthsData[monthIndex].bills = bills;
      newMonthsData[monthIndex].amounts = amounts;

      setMonthsData(newMonthsData);
    } catch (error) {
      console.error('Error al obtener las facturas del mes: ', error);
    }
  };

  const handlePaidChange = async (month) => {
    await fetchBillsForMonth(month, monthsData);
  };

  const handleBillDeleted = async (month) => {
    await fetchBillsForMonth(month, monthsData);
  };

  const handleBillAddedOrUpdated = async (month) => {
    await fetchBillsForMonth(month, monthsData);
  };

  const applySort = async (type) => {
    try {
      const monthIndex = monthsData.findIndex(month => month.id === currentMonthId);
      if (monthIndex === -1) return;

      const bills = monthsData[monthIndex].bills;
      let sorted = [];

      switch (type) {
        case 'noPaid':
          sorted = [...bills].sort((a, b) => (a.data.paid > b.data.paid) ? 1 : -1);
          break;
        case 'paid':
          sorted = [...bills].sort((a, b) => (a.data.paid < b.data.paid) ? 1 : -1);
          break;
        case 'highestAmount':
          sorted = [...bills].sort((a, b) => b.data.amount - a.data.amount);
          break;
        case 'lowestAmount':
          sorted = [...bills].sort((a, b) => a.data.amount - b.data.amount);
          break;
        case 'creation':
          sorted = [...bills].sort((a, b) => (a.data.createdAt > b.data.createdAt) ? 1 : -1);
          break;
        case 'alphabeticalAsc':
          sorted = [...bills].sort((a, b) => {
            if (a.data.name && b.data.name) {
              return a.data.name.localeCompare(b.data.name);
            }
            return 0;
          });
          break;
        case 'alphabeticalDesc':
          sorted = [...bills].sort((a, b) => {
            if (a.data.name && b.data.name) {
              return b.data.name.localeCompare(a.data.name);
            }
            return 0;
          });
          break;
        default:
          break;
      }
      
      updateMonthsData(monthIndex, sorted);
      setSortModalVisible(false);
    } catch (error) {
      console.error('Error ordenando los gastos: ', error);
    }
  };

  const updateMonthsData = (monthIndex, sortedBills) => {
    const updatedMonthsData = [...monthsData];
    updatedMonthsData[monthIndex].bills = sortedBills;
    setMonthsData(updatedMonthsData);
  };

  const updateAmounts = async () => {
    await fetchBillsForMonth(currentMonthId);
  };

  const renderMonthSelector = () => {
    return (
      <View style={stylesBillsList.monthSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={stylesBillsList.monthScrollContent}>
          {monthsData.map((month) => {
            const isSelected = month.id === currentMonthId;
            const translatedName = monthTranslations[month.data.name.toLowerCase()] || month.data.name;
            return (
              <TouchableOpacity
                key={month.id}
                style={[
                  stylesBillsList.monthChip,
                  isSelected && stylesBillsList.monthChipActive
                ]}
                onPress={() => {
                  setCurrentMonthId(month.id);
                  fetchBillsForMonth(month.id);
                  if (onMonthChange) {
                    onMonthChange(month.id);
                  }
                }}
              >
                <Text style={[
                  stylesBillsList.monthChipText,
                  isSelected && stylesBillsList.monthChipTextActive
                ]}>
                  {translatedName.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderHeader = () => {
    const selectedMonthObj = monthsData.find(m => m.id === currentMonthId);
    if (!selectedMonthObj) return renderMonthSelector();

    const amounts = selectedMonthObj.amounts || {};
    const totalAmount = parseFloat(amounts.totalAmount || 0);
    const amountPaid = parseFloat(amounts.amountPaid || 0);
    const amountUnpaid = parseFloat(amounts.amountUnpaid || 0);
    const remaining = parseFloat(amounts.remaining || 0);

    const translatedMonthName = monthTranslations[selectedMonthObj.data.name.toLowerCase()] || selectedMonthObj.data.name;

    return (
      <View style={stylesBillsList.headerWrapper}>
        {/* Selector de Meses Horizontal */}
        {renderMonthSelector()}

        {/* Tarjeta de Resumen Financiero Estilo Fintech */}
        <View style={stylesBillsList.fintechCard}>
          <View style={stylesBillsList.fintechCardHeader}>
            <Text style={stylesBillsList.fintechCardMonth}>
              {translatedMonthName.toUpperCase()} {year}
            </Text>
            <View style={stylesBillsList.fintechCardActions}>
              {/* Botón 1: Gastos Extra */}
              <ExtraIncome 
                year={year}
                month={currentMonthId}
                updateAmounts={updateAmounts}
                color="#5caece"
                style={stylesBillsList.toolbarButton}
              />

              {/* Botón: Ordenar Gastos */}
              <TouchableOpacity 
                style={stylesBillsList.toolbarButton} 
                onPress={() => setSortModalVisible(true)}
              >
                <FontAwesome name="sort" size={18} color="#5caece" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Principal: Restante */}
          <View style={stylesBillsList.fintechMainBalanceContainer}>
            <Text style={stylesBillsList.fintechBalanceLabel}>RESTANTE / DISPONIBLE</Text>
            <Text style={[
              stylesBillsList.fintechBalanceValue,
              { color: remaining < 0 ? '#ff6b6b' : '#2ecc71' }
            ]}>
              {remaining.toFixed(2).replace(".", ",")}€
            </Text>
          </View>

          {/* Grid de Detalle de Gastos */}
          <View style={stylesBillsList.fintechDetailsGrid}>
            <View style={stylesBillsList.fintechGridItem}>
              <Text style={stylesBillsList.fintechGridLabel}>Total Gastos</Text>
              <Text style={[stylesBillsList.fintechGridValue, { color: '#ffffff' }]}>
                {totalAmount.toFixed(2).replace(".", ",")}€
              </Text>
            </View>

            <View style={stylesBillsList.fintechGridItem}>
              <Text style={stylesBillsList.fintechGridLabel}>Pagado</Text>
              <Text style={[stylesBillsList.fintechGridValue, { color: '#2ecc71' }]}>
                {amountPaid.toFixed(2).replace(".", ",")}€
              </Text>
            </View>

            <View style={stylesBillsList.fintechGridItem}>
              <Text style={stylesBillsList.fintechGridLabel}>Por Pagar</Text>
              <Text style={[stylesBillsList.fintechGridValue, { color: '#f1c40f' }]}>
                {amountUnpaid.toFixed(2).replace(".", ",")}€
              </Text>
            </View>
          </View>
        </View>

        <Text style={stylesBillsList.sectionTitle}>Listado de Gastos</Text>
      </View>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;
  }

  const selectedMonthObj = monthsData.find(m => m.id === currentMonthId);
  const bills = selectedMonthObj?.bills || [];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={bills}
        renderItem={({ item }) => (
          <Bill
            bill={item}
            onPaidChange={(newPaidStatus) => handlePaidChange(currentMonthId)}
            onBillDeleted={handleBillDeleted}
            onBillUpdated={handleBillAddedOrUpdated}
          />
        )}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={stylesBillsList.emptyText}>No hay gastos para este mes</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Modal de Ordenación Estilo Premium */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <TouchableOpacity 
          style={stylesBillsList.sortModalOverlay} 
          activeOpacity={1} 
          onPress={() => setSortModalVisible(false)}
        >
          <View style={stylesBillsList.sortModalContent}>
            <Text style={stylesBillsList.sortModalTitle}>Ordenar Gastos</Text>

            <TouchableOpacity style={stylesBillsList.sortOptionItem} onPress={() => applySort('noPaid')}>
              <MaterialCommunityIcons name="checkbox-blank-outline" size={20} color="#5caece" />
              <Text style={stylesBillsList.sortOptionText}>Por no pagado primero</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylesBillsList.sortOptionItem} onPress={() => applySort('paid')}>
              <MaterialCommunityIcons name="checkbox-marked" size={20} color="#5caece" />
              <Text style={stylesBillsList.sortOptionText}>Por pagado primero</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylesBillsList.sortOptionItem} onPress={() => applySort('highestAmount')}>
              <MaterialCommunityIcons name="trending-up" size={20} color="#5caece" />
              <Text style={stylesBillsList.sortOptionText}>Por mayor importe</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylesBillsList.sortOptionItem} onPress={() => applySort('lowestAmount')}>
              <MaterialCommunityIcons name="trending-down" size={20} color="#5caece" />
              <Text style={stylesBillsList.sortOptionText}>Por menor importe</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylesBillsList.sortOptionItem} onPress={() => applySort('creation')}>
              <MaterialCommunityIcons name="calendar-plus" size={20} color="#5caece" />
              <Text style={stylesBillsList.sortOptionText}>Por orden de creación</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylesBillsList.sortOptionItem} onPress={() => applySort('alphabeticalAsc')}>
              <MaterialCommunityIcons name="sort-alphabetical-ascending" size={20} color="#5caece" />
              <Text style={stylesBillsList.sortOptionText}>Alfabéticamente (A-Z)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={stylesBillsList.sortOptionItem} onPress={() => applySort('alphabeticalDesc')}>
              <MaterialCommunityIcons name="sort-alphabetical-descending" size={20} color="#5caece" />
              <Text style={stylesBillsList.sortOptionText}>Alfabéticamente (Z-A)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={stylesBillsList.sortModalCloseButton} 
              onPress={() => setSortModalVisible(false)}
            >
              <Text style={stylesBillsList.sortModalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default BillList;
