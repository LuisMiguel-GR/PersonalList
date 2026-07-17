import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../Presentation/Styles/stylesCopyBillsModal';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import db from '../../Config/firebase';

const monthTranslations = {
  january: 'Enero',
  february: 'Febrero',
  march: 'Marzo',
  april: 'Abril',
  may: 'Mayo',
  june: 'Junio',
  july: 'Julio',
  august: 'Agosto',
  september: 'Septiembre',
  october: 'Octubre',
  november: 'Noviembre',
  december: 'Diciembre',
};

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

const formatMonthLabel = (year, month) => {
  const translated = monthTranslations[month.toLowerCase()] || month;
  return `${translated} ${year}`;
};

const CopyExpensesModal = ({ isVisible, onClose, userId, onCopyExpenses }) => {
  const [months, setMonths] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState({});
  const [copyMonth, setCopyMonth] = useState(null);
  const [targetMonth, setTargetMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCopyMonth(null);
      setTargetMonth(null);
      setExpenses([]);
      setSelectedExpenses({});
      return;
    }

    const fetchMonths = async () => {
      try {
        setIsLoading(true);

        const yearsCollection = collection(db, 'users', userId, 'general-list', 'years', 'years-list');
        const yearsSnapshot = await getDocs(yearsCollection);

        if (yearsSnapshot.empty) {
          setMonths([]);
          return;
        }

        const fetchedYears = yearsSnapshot.docs.map((yearDoc) => yearDoc.id);
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
            monthsSnapshot.docs.forEach((monthDoc) => {
              allMonths.push({ year, month: monthDoc.id });
            });
          }
        }

        const sortedMonths = allMonths.sort((a, b) => {
          const yearDiff = b.year - a.year;
          if (yearDiff !== 0) return yearDiff;
          return monthOrder[b.month.toLowerCase()] - monthOrder[a.month.toLowerCase()];
        });

        setMonths(sortedMonths);
      } catch (error) {
        console.error('Error al obtener los meses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchMonths();
    }
  }, [userId, isVisible]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!copyMonth) {
        setExpenses([]);
        setSelectedExpenses({});
        return;
      }

      try {
        setIsLoading(true);
        const { year, month } = copyMonth;

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
        const fetchedExpenses = expensesSnapshot.docs.map((expenseDoc) => ({
          id: expenseDoc.id,
          ...expenseDoc.data(),
        }));

        setExpenses(fetchedExpenses);
        setSelectedExpenses({});
        setTargetMonth(null);
      } catch (error) {
        console.error('Error al obtener los gastos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, [copyMonth, userId]);

  const monthKey = (monthItem) => `${monthItem.year}|${monthItem.month}`;

  const handleSelectSourceMonth = (monthItem) => {
    if (targetMonth && monthKey(monthItem) === monthKey(targetMonth)) {
      alert('No puedes seleccionar el mismo mes como origen y destino.');
      return;
    }
    setCopyMonth(monthItem);
  };

  const handleSelectTargetMonth = (monthItem) => {
    if (copyMonth && monthKey(monthItem) === monthKey(copyMonth)) {
      alert('No puedes seleccionar el mismo mes como origen y destino.');
      return;
    }
    setTargetMonth(monthItem);
  };

  const handleSelectExpense = (expenseId) => {
    setSelectedExpenses((prev) => ({
      ...prev,
      [expenseId]: !prev[expenseId],
    }));
  };

  const handleSelectAll = () => {
    const allSelected = expenses.every((expense) => selectedExpenses[expense.id]);
    if (allSelected) {
      setSelectedExpenses({});
    } else {
      const all = {};
      expenses.forEach((expense) => {
        all[expense.id] = true;
      });
      setSelectedExpenses(all);
    }
  };

  const selectedCount = Object.values(selectedExpenses).filter(Boolean).length;
  const canCopy = targetMonth && selectedCount > 0 && !isCopying;

  const handleCopy = async () => {
    if (!targetMonth) {
      alert('Por favor selecciona un mes de destino.');
      return;
    }

    const selectedExpenseIds = Object.keys(selectedExpenses).filter((id) => selectedExpenses[id]);
    if (!selectedExpenseIds.length) {
      alert('Por favor selecciona al menos un gasto.');
      return;
    }

    try {
      setIsCopying(true);
      const expensesToCopy = expenses.filter((expense) =>
        selectedExpenseIds.includes(expense.id)
      );

      const { year: targetYear, month: targetMonthName } = targetMonth;
      const monthIndex = monthOrder[targetMonthName.toLowerCase()];

      if (monthIndex === undefined) {
        alert('Mes no válido');
        return;
      }

      const currentDate = new Date();
      const targetDate = new Date(targetYear, monthIndex, currentDate.getDate());

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
    } finally {
      setIsCopying(false);
    }
  };

  const renderMonthChips = (selected, onSelect, excludeMonth) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.monthScrollContent}
    >
      {months.map((monthItem) => {
        const key = monthKey(monthItem);
        const isExcluded = excludeMonth && key === monthKey(excludeMonth);
        const isSelected =
          selected &&
          selected.year === monthItem.year &&
          selected.month === monthItem.month;

        return (
          <TouchableOpacity
            key={key}
            style={[styles.monthChip, isSelected && styles.monthChipActive]}
            onPress={() => !isExcluded && onSelect(monthItem)}
            disabled={isExcluded}
            activeOpacity={0.7}
          >
            <Text style={[styles.monthChipText, isSelected && styles.monthChipTextActive]}>
              {formatMonthLabel(monthItem.year, monthItem.month).toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderSectionTitle = (step, title) => (
    <View style={styles.sectionTitleRow}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{step}</Text>
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {isLoading && !copyMonth ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#5caece" />
            </View>
          ) : (
            <>
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.headerText}>Copiar Gastos</Text>
                <Text style={styles.headerSubtitle}>
                  Selecciona el mes de origen, los gastos y el mes de destino
                </Text>

                <View style={styles.section}>
                  {renderSectionTitle('1', 'Mes de origen')}
                  {months.length === 0 ? (
                    <Text style={styles.emptyText}>No hay meses disponibles</Text>
                  ) : (
                    renderMonthChips(copyMonth, handleSelectSourceMonth, targetMonth)
                  )}
                </View>

                {copyMonth && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      {renderSectionTitle('2', 'Gastos a copiar')}
                      {expenses.length > 0 && (
                        <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
                          <Text style={styles.selectAllText}>
                            {expenses.every((e) => selectedExpenses[e.id]) ? 'Quitar todo' : 'Seleccionar todo'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {isLoading ? (
                      <ActivityIndicator size="small" color="#5caece" style={{ marginVertical: 20 }} />
                    ) : expenses.length === 0 ? (
                      <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="file-document-outline" size={32} color="rgba(255,255,255,0.2)" />
                        <Text style={styles.emptyText}>No hay gastos en este mes</Text>
                      </View>
                    ) : (
                      <>
                        <ScrollView style={styles.expensesContainer} nestedScrollEnabled>
                          {expenses.map((expense) => (
                            <TouchableOpacity
                              key={expense.id}
                              style={styles.expenseItem}
                              onPress={() => handleSelectExpense(expense.id)}
                              activeOpacity={0.7}
                            >
                              <CheckBox
                                checked={!!selectedExpenses[expense.id]}
                                onPress={() => handleSelectExpense(expense.id)}
                                checkedColor="#5caece"
                                containerStyle={{ padding: 0, margin: 0, backgroundColor: 'transparent', borderWidth: 0 }}
                              />
                              <View style={styles.expenseInfo}>
                                <Text style={styles.expenseName}>{expense.name}</Text>
                                {expense.amount != null && (
                                  <Text style={styles.expenseAmount}>
                                    {parseFloat(expense.amount).toFixed(2).replace('.', ',')}€
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                        {selectedCount > 0 && (
                          <Text style={styles.selectedCount}>
                            {selectedCount} gasto{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                )}

                {copyMonth && expenses.length > 0 && (
                  <View style={styles.section}>
                    {renderSectionTitle('3', 'Mes de destino')}
                    {renderMonthChips(targetMonth, handleSelectTargetMonth, copyMonth)}
                    {!targetMonth && (
                      <Text style={styles.hintText}>Elige el mes al que quieres copiar los gastos</Text>
                    )}
                  </View>
                )}
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCopy}
                  style={[styles.acceptButton, !canCopy && styles.acceptButtonDisabled]}
                  disabled={!canCopy}
                >
                  <Text style={styles.buttonText}>
                    {isCopying ? 'Copiando...' : `Copiar${selectedCount > 0 ? ` (${selectedCount})` : ''}`}
                  </Text>
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
