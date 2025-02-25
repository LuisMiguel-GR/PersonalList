import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import Bill from './Bill';
import db from '../../Config/firebase';
import { doc, collection, getDocs, getDoc, onSnapshot } from 'firebase/firestore';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import stylesBillsList from '../Presentation/Styles/stylesBillsList';
import BillsScreenLogic from '../Domain/Hooks/BillsScreenLogic';
import loadSunshineFont from './../../Config/useFonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu } from 'react-native-paper';
import ExtraIncome from './ExtraIncome';

const BillList = ({ year, name, description, amount, createdAt, clearModalData }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [monthsData, setMonthsData] = useState([]);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [currentMonthId, setCurrentMonthId] = useState(null);
  const [isBillAdded, setIsBillAdded] = useState(false);
  const [menuVisible, setMenuVisible] = useState([]);

  const { handleAddBill, handleSort } = BillsScreenLogic();

  useEffect(() => {
    loadSunshineFont().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isBillAdded) {
      // handleAddBillList();
    }
  }, [isBillAdded]);

  useEffect(() => {
    const fetchMonthsData = async () => {
      try {
        if (!user || !year) return;

        const monthsCollectionRef = collection(db, `users/${user.uid}/general-list/years/years-list/${year}/months`);
        const monthsSnapshot = await getDocs(monthsCollectionRef);

        if (monthsSnapshot.empty) {
          console.log('No se encontraron documentos de meses para el año:', year);
          setIsLoading(false);
          return;
        }

        const monthsData = monthsSnapshot.docs.map(monthDoc => ({
          id: monthDoc.id,
          data: monthDoc.data(),
          bills: [],
          amounts: {}
        }));

        const monthNames = [
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"
        ];
        const orderedMonthsData = monthsData.sort((a, b) => {
          return monthNames.indexOf(a.data.name.toLowerCase()) - monthNames.indexOf(b.data.name.toLowerCase());
        });

        setMonthsData(orderedMonthsData);

        const currentMonthName = monthNames[new Date().getMonth()];
        const currentMonth = orderedMonthsData.find(month => month.data.name.toLowerCase() === currentMonthName);

        if (currentMonth) {
          setCurrentMonthId(currentMonth.id);
          setExpandedMonths({ [currentMonth.id]: true });
          await fetchBillsForMonth(currentMonth.id, orderedMonthsData);
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
      if (monthIndex === -1) {
        throw new Error(`Mes con id ${monthId} no encontrado`);
      }

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

  const openMenu = (monthIndex) => {
    const updatedMenus = [...menuVisible];
    updatedMenus[monthIndex] = true;
    setMenuVisible(updatedMenus);
  };

  const closeMenu = (monthIndex) => {
    const updatedMenus = [...menuVisible];
    updatedMenus[monthIndex] = false;
    setMenuVisible(updatedMenus);
  };

  const sortBills = async (type, monthId) => {
    handleSortBills(type, monthId);
    closeMenu(monthId);
  };

  const handleSortBills = async (type, monthId) => {
    try {
      const monthIndex = monthsData.findIndex(month => month.id === monthId);
      if (monthIndex === -1) {
        throw new Error(`Mes con id ${monthId} no encontrado`);
      }

      const bills = monthsData[monthIndex].bills;

      switch (type) {
        case 'noPaid':
          const sortedByPaid = [...bills].sort((a, b) => (a.data.paid > b.data.paid) ? 1 : -1);
          updateMonthsData(monthIndex, sortedByPaid);
          break;
        case 'paid':
          const sortedByNoPaid = [...bills].sort((a, b) => (a.data.paid < b.data.paid) ? 1 : -1);
          updateMonthsData(monthIndex, sortedByNoPaid);
          break;
        case 'highestAmount':
          const sortedByHighestAmount = [...bills].sort((a, b) => b.data.amount - a.data.amount);
          updateMonthsData(monthIndex, sortedByHighestAmount);
          break;
        case 'lowestAmount':
          const sortedByLowestAmount = [...bills].sort((a, b) => a.data.amount - b.data.amount);
          updateMonthsData(monthIndex, sortedByLowestAmount);
          break;
        case 'creation':
          const sortedByCreation = [...bills].sort((a, b) => (a.data.createdAt > b.data.createdAt) ? 1 : -1);
          updateMonthsData(monthIndex, sortedByCreation);
          break;
        case 'alphabeticalAsc':
          const sortedAlphabeticalAsc = [...bills].sort((a, b) => {
            if (a.data.name && b.data.name) {
              return a.data.name.localeCompare(b.data.name);
            } else {
              return 0;
            }
          });
          updateMonthsData(monthIndex, sortedAlphabeticalAsc);
          break;
        case 'alphabeticalDesc':
          const sortedAlphabeticalDesc = [...bills].sort((a, b) => {
            if (a.data.name && b.data.name) {
              return b.data.name.localeCompare(a.data.name);
            } else {
              return 0;
            }
          });
          updateMonthsData(monthIndex, sortedAlphabeticalDesc);
          break;
        default:
          console.error('tipo de ordenación no reconocido');
          break;
      }
      closeMenu(monthId);
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

  const renderMonthCard = (month, index) => {
    const isExpanded = expandedMonths[month.id];
    const bills = month.bills || [];
    const amounts = month.amounts || {};

    const getTotalAmountStyle = () => ({
      color: amounts.totalAmount < 0 ? 'red' : 'green',
    });

    const getOutstandingBalanceStyle = () => ({
      color: amounts.outstandingBalance < 0 ? 'red' : 'green',
    });

    const getAmountPaidStyle = () => ({
      color: amounts.amountPaid < 0 ? 'red' : 'green',
    });

    const getRemainingStyle = () => ({
      color: amounts.remaining < 0 ? 'red' : 'green',
    });

    return (
      <TouchableOpacity
        key={month.id}
        onPress={() => {
          if (!isExpanded) {
            fetchBillsForMonth(month.id);
          }
          toggleExpandMonth(month.id);
        }}
        style={[stylesBillsList.cardContainer, { height: isExpanded ? 400 : 50 }]}
      >
        <View style={stylesBillsList.cardHeader}>
          <Text style={stylesBillsList.cardTitle}>{month.data.name}</Text>
          <View style={stylesBillsList.iconsCard}>
            <ExtraIncome 
              year={year}
              month={month.id}
              updateAmounts={updateAmounts}
            />
            <Menu
              visible={menuVisible[index] || false}
              onDismiss={() => closeMenu(index)}
              anchor={
                <TouchableOpacity onPress={() => openMenu(index)}>
                  <Icon name="sort" size={20} color="#000" />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={() => { sortBills('noPaid', month.id); }} title="Ordenar por no pagado" />
              <Menu.Item onPress={() => { sortBills('paid', month.id); }} title="Ordenar por pagado" />
              <Menu.Item onPress={() => { sortBills('highestAmount', month.id); }} title="Ordenar por mayor importe" />
              <Menu.Item onPress={() => { sortBills('lowestAmount', month.id); }} title="Ordenar por menor importe" />
              <Menu.Item onPress={() => { sortBills('creation', month.id); }} title="Ordenar por creación" />
              <Menu.Item onPress={() => { sortBills('alphabeticalAsc', month.id); }} title="Ordenar alfabéticamente (A-Z)" />
              <Menu.Item onPress={() => { sortBills('alphabeticalDesc', month.id); }} title="Ordenar alfabéticamente (Z-A)" />
            </Menu>
          </View>
          
        </View>
        {isExpanded && (
          <View style={stylesBillsList.flatListContainer}>
            <View style={stylesBillsList.containerText}>
              <Text style={stylesBillsList.text}>Total: <Text style={getTotalAmountStyle()}>{parseFloat(amounts.totalAmount).toFixed(2).replace(".", ",")}€</Text></Text>
              <Text style={stylesBillsList.text}>Sin pagar: <Text style={getOutstandingBalanceStyle()}>{parseFloat(amounts.amountUnpaid).toFixed(2).replace(".", ",")}€</Text></Text>
              <Text style={stylesBillsList.text}>Pagado: <Text style={getAmountPaidStyle()}>{parseFloat(amounts.amountPaid).toFixed(2).replace(".", ",")}€</Text></Text>
              <Text style={stylesBillsList.text}>Restante: <Text style={getRemainingStyle()}>{parseFloat(amounts.remaining).toFixed(2).replace(".", ",")}€</Text></Text>
            </View>
            <ScrollView>
              <FlatList
                data={bills}
                renderItem={({ item }) => (
                  <Bill
                    bill={item}
                    onPaidChange={(newPaidStatus) => handlePaidChange(month.id, item.id, newPaidStatus)}
                    onBillDeleted={handleBillDeleted}
                    onBillUpdated={handleBillAddedOrUpdated}
                  />
                )}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={stylesBillsList.emptyText}>No hay gastos para este mes</Text>}
              />
            </ScrollView>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const toggleExpandMonth = (monthId) => {
    setExpandedMonths(prevState => ({
      ...prevState,
      [monthId]: !prevState[monthId]
    }));
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={monthsData}
      renderItem={({ item, index }) => renderMonthCard(item, index)}
      keyExtractor={item => item.id}
    />
  );
};

export default BillList;
