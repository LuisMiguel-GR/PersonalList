import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { CheckBox } from 'react-native-elements';
import styles from '../Presentation/Styles/stylesCopyBillsModal';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import db from '../../Config/firebase';

const CopyExpensesModal = ({ isVisible, onClose, userId, selectedMonth, onCopyExpenses }) => {
  const [months, setMonths] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState({});
  const [copyMonth, setCopyMonth] = useState('');
  const [targetMonth, setTargetMonth] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        setIsLoading(true);
  
        const yearsCollection = collection(db, 'users', userId, 'general-list', 'years', 'years-list');
        const yearsSnapshot = await getDocs(yearsCollection);
  
        if (yearsSnapshot.empty) {
          console.error('No se encontraron años.');
          setMonths([]);
          return;
        }
  
        const fetchedYears = yearsSnapshot.docs.map((doc) => doc.id);
        const allMonths = [];
  
        for (const year of fetchedYears) {
          const monthsCollection = collection(
            db,
            'users',
            userId,
            'general-list',
            'years',
            'years-list',
            year,
            'months'
          );
  
          const monthsSnapshot = await getDocs(monthsCollection);
          if (!monthsSnapshot.empty) {
            const monthsForYear = monthsSnapshot.docs.map((doc) => ({
              year,
              month: doc.id,
            }));
            allMonths.push(...monthsForYear);
          }
        }
  
        const sortedMonths = allMonths.sort((a, b) => {
          const yearDiff = b.year - a.year;
          if (yearDiff !== 0) {
            return yearDiff;
          }
          const monthOrder = {
            january: 0,
            february: 1,
            march: 2,
            april: 3,
            may: 4,
            june: 5,
            july: 6,
            august: 7,
            september: 8,
            october: 9,
            november: 10,
            december: 11,
          };
  
          return monthOrder[b.month] - monthOrder[a.month];
        });
  
        const formattedMonths = sortedMonths.map(({ year, month }) => `${year} - ${month}`);
        setMonths(formattedMonths);
      } catch (error) {
        console.error('Error al obtener los meses:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchMonths();
  }, [userId]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        if (!copyMonth) return;

        setIsLoading(true);

        const [year, month] = copyMonth.split(' - ');
        const expensesCollection = collection(
          db,
          'users',
          userId,
          'general-list',
          'years',
          'years-list',
          year,
          'months',
          month,
          'bills'
        );

        const expensesSnapshot = await getDocs(expensesCollection);
        const fetchedExpenses = expensesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExpenses(fetchedExpenses);
        setSelectedExpenses({});
      } catch (error) {
        console.error('Error al obtener los gastos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [copyMonth, userId]);

  const handleSelectExpense = (expenseId) => {
    setSelectedExpenses((prev) => ({
      ...prev,
      [expenseId]: !prev[expenseId],
    }));
  };
  
  const handleCopy = async () => {
    try {
      if (!targetMonth) {
        alert('Por favor selecciona un mes de destino diferente al mes de origen.');
        return;
      }
  
      const selectedExpenseIds = Object.keys(selectedExpenses).filter((id) => selectedExpenses[id]);
      if (!selectedExpenseIds.length) {
        alert('Por favor selecciona al menos un gasto.');
        return;
      }
  
      const expensesToCopy = expenses.filter((expense) =>
        selectedExpenseIds.includes(expense.id)
      );

      const [targetYear, targetMonthName] = targetMonth.split(' - ');
  
      const monthMapping = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };

      const monthIndex = monthMapping[targetMonthName.toLowerCase()];
      if (monthIndex === undefined) {
        alert('Mes no válido');
        return;
      }

      const currentDate = new Date();
      const targetDate = new Date(targetYear, monthIndex, currentDate.getDate());

      if (isNaN(targetDate.getTime())) {
        console.error('Fecha inválida:', targetDate);
        alert('Hubo un problema con la fecha de destino.');
        return;
      }
  
      const targetExpensesCollection = collection(
        db,
        'users',
        userId,
        'general-list',
        'years',
        'years-list',
        targetYear,
        'months',
        targetMonthName,
        'bills'
      );

      await Promise.all(
        expensesToCopy.map((expense) => {
          const updatedExpense = {
            ...expense,
            paid: false,
            createdAt: targetDate,
            timestamp: targetDate,
          };
  
          return setDoc(doc(targetExpensesCollection, expense.id), updatedExpense);
        })
      );
  
      onCopyExpenses();
      onClose();
    } catch (error) {
      console.error('Error al copiar los gastos:', error);
      alert('Error al copiar los gastos');
    }
  };


  return (
    <Modal visible={isVisible} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.headerText}>Copiar gastos</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4caf50" />
      ) : (
        <>
          <Text style={styles.subtitle}>Selecciona un mes de origen</Text>
          <FlatList
            data={months}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.monthsListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.monthButton,
                  copyMonth === item && styles.selectedMonthButton,
                ]}
                onPress={() => {
                  if (item !== targetMonth) {
                    setCopyMonth(item);
                  } else {
                    alert('No puedes seleccionar el mismo mes de origen como destino.');
                  }
                }}
              >
                <Text style={styles.monthButtonText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.subtitle}>Selecciona los gastos</Text>
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            style={{ flexGrow: 1 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No existen gastos</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <CheckBox
                  checked={!!selectedExpenses[item.id]}
                  onPress={() => handleSelectExpense(item.id)}
                  style={styles.checkbox}
                />
                <Text style={styles.expenseName}>{item.name}</Text>
              </View>
            )}
          />

          <Text style={styles.subtitle}>Selecciona un mes de destino</Text>
          <FlatList
            data={months}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.monthsListContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.monthButton,
                  targetMonth === item && styles.selectedMonthButton,
                ]}
                onPress={() => {
                  if (item !== copyMonth) {
                    setTargetMonth(item);
                  } else {
                    alert('No puedes seleccionar el mismo mes de origen como destino.');
                  }
                }}
              >
                <Text style={styles.monthButtonText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCopy} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Copiar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  </View>
</Modal>

  );
};

export default CopyExpensesModal;
