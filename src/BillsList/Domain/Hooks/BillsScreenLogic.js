import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, setDoc, getDoc, deleteDoc, getDocs } from 'firebase/firestore';
import db from '../../../Config/firebase';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import Toast from 'react-native-simple-toast';

const BillsListLogic = () => {
  const [bills, setBills] = useState([]);
  const { user } = useUser();
  const [salary, setSalary] = useState(0);

  useEffect(() => {
    if (user) {

      const userId = user.uid;

      const billsRef = collection(db, 'users', userId, 'general-list', 'years', '2024', 'months', 'months-list', 'june', 'bills');
      const q = query(billsRef, orderBy('createdAt', 'asc'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const billsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBills(billsList);
      });
  
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddBill = async (newBillData) => {
    if (!newBillData || !newBillData.name) {
        console.error('El nuevo gasto debe tener un nombre.');
        return;
    }

    let newAmount = parseFloat(newBillData.amount.replace(',', '.'));
    newAmount = Math.round(newAmount * 100) / 100;

    if (user) {
        const userId = user.uid;

        let newCreatedAt;
        if (newBillData.createdAt === undefined || newBillData.createdAt === null || newBillData.createdAt === '') {
            newCreatedAt = new Date();
        } else if (typeof newBillData.createdAt === 'string') {
          newCreatedAt = new Date(newBillData.createdAt);
        } else if (newBillData.createdAt instanceof Date) {
          newCreatedAt = newBillData.createdAt;
        } else {
            throw new Error('El valor de createdAt no es válido.');
        }

        const newBill = { 
            name: newBillData.name, 
            paid: false, 
            description: newBillData.description || '',
            amount: newAmount || 0,
            periodicity: newBillData.periodicity,
            createdAt: newCreatedAt,  
            timestamp: new Date()
        };

        const monthNames = [
            "january", "february", "march", "april", "may", "june",
            "july", "august", "september", "october", "november", "december"
        ];
        const newMonthCreatedAt = monthNames[new Date(newCreatedAt).getMonth()];
        const yearCreatedAt  = new Date(newCreatedAt).getFullYear();

        try {
            await addDoc(collection(db, 'users', userId, 'general-list', 'years', 'years-list', yearCreatedAt.toString(), 'months', newMonthCreatedAt, 'bills'), newBill);

            const nameYearRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearCreatedAt.toString());
            const nameYearDoc = await getDoc(nameYearRef);
            if (!nameYearDoc.exists()) {
              await setDoc(nameYearRef, { name: yearCreatedAt }, { merger: true });
              console.log('Campo con el nombre del ano creado.');
            }

            const nameMonthRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearCreatedAt.toString(), 'months', newMonthCreatedAt);
            const nameMonthDoc = await getDoc(nameMonthRef);
            if (!nameMonthDoc.exists()) {
              await setDoc(nameMonthRef, { name: newMonthCreatedAt }, { merger: true });
              console.log('Campo con el nombre del mes creado.');
            }

            const totalAmountRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearCreatedAt.toString(), 'months', newMonthCreatedAt, 'amounts', 'totalAmount');
            const totalAmountDoc = await getDoc(totalAmountRef);

            let currentTotalAmount = totalAmountDoc.exists() ? totalAmountDoc.data().amount : 0;
            currentTotalAmount = parseFloat(currentTotalAmount);
            currentTotalAmount = Math.round(currentTotalAmount * 100) / 100;

            const newTotalAmount = currentTotalAmount + newAmount;
            await setDoc(totalAmountRef, { amount: newTotalAmount });

            const outstandingBalanceRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearCreatedAt.toString(), 'months', newMonthCreatedAt, 'amounts', 'outstandingBalance');
            const outstandingBalanceDoc = await getDoc(outstandingBalanceRef);

            let currentOutstandingBalance = outstandingBalanceDoc.exists() ? outstandingBalanceDoc.data().amount : 0;
            currentOutstandingBalance = parseFloat(currentOutstandingBalance);
            currentOutstandingBalance = Math.round(currentOutstandingBalance * 100) / 100;

            const newOutstandingBalance = currentOutstandingBalance + newAmount;
            await setDoc(outstandingBalanceRef, { amount: newOutstandingBalance });

            console.log('Gasto agregado correctamente.');
        } catch (error) {
            console.error('Error al agregar el gasto:', error);
        }
    } else {
        console.error('Usuario no encontrado al intentar agregar el gasto.');
    }
};
  
const handleUpdateBill = async (bill, newBillData) => {
  if (!newBillData || !newBillData.name.trim()) {
    console.error('El nuevo nombre del gasto no puede estar vacío.');
    return;
  }

  if (!user) {
    console.error('Usuario no autenticado.');
    return;
  }

  try {
    const milliseconds = (bill.data.createdAt.seconds * 1000) + (bill.data.createdAt.nanoseconds / 1000000);
    const date = new Date(milliseconds);
    const yearBillCreatedAt = date.getFullYear();

    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    const monthBillCreatedAt = monthNames[date.getMonth()];

    const userId = user.uid;
    const billRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'bills', bill.id);
    const billDoc = await getDoc(billRef);

    if (!billDoc.exists()) {
      console.error('No se encontró el gasto a actualizar.');
      return;
    }

    const oldAmount = parseFloat(billDoc.data().amount) || 0;
    const newAmount = parseFloat(newBillData.amount) || 0;

    const roundedOldAmount = Math.round(oldAmount * 100) / 100;
    const roundedNewAmount = Math.round(newAmount * 100) / 100;

    await updateDoc(billRef, {
      name: newBillData.name.trim(),
      description: newBillData.description || '',
      amount: roundedNewAmount,
      periodicity: newBillData.periodicity,
      timestamp: new Date()
    });

    const amountDifference = roundedNewAmount - roundedOldAmount;

    const billsQuerySnapshot = await getDocs(collection(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'bills'));

    let totalAmount = 0;
    let amountPaid = 0;
    let outstandingBalance = 0;

    billsQuerySnapshot.forEach((docSnapshot) => {
      const billData = docSnapshot.data();
      const billAmount = parseFloat(billData.amount) || 0;

      totalAmount += billAmount;

      if (billData.paid) {
        amountPaid += billAmount;
      }

      if (!billData.paid) {
        outstandingBalance += billAmount;
      }
    });

    totalAmount = Math.round(totalAmount * 100) / 100;
    amountPaid = Math.round(amountPaid * 100) / 100;
    outstandingBalance = Math.round(outstandingBalance * 100) / 100;

    const totalAmountRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'amounts', 'totalAmount');
    await setDoc(totalAmountRef, { amount: totalAmount });

    const amountPaidRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'amounts', 'amountPaid');
    await setDoc(amountPaidRef, { amount: amountPaid });

    const outstandingBalanceRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'amounts', 'outstandingBalance');
    await setDoc(outstandingBalanceRef, { amount: outstandingBalance });

    Toast.show(
      `El gasto ${newBillData.name.trim()} se ha actualizado correctamente`, Toast.TOP, {
        backgroundColor: 'green',
      }
    );

  } catch (error) {
    Toast.show(
      'Error al actualizar el gasto', Toast.TOP, {
        backgroundColor: 'red',
      }
    );
    console.error('Error al actualizar el gasto:', error);
  }
};

  const handleDeleteBill = async (bill) => {
    if (!user) {
      console.error('Usuario no autenticado.');
      return;
    }

    if (!bill.id) {
      console.error('El ID de la factura no puede estar vacío.');
      return;
    }
  
    try {
      const userId = user.uid;

      const milliseconds = (bill.data.createdAt.seconds * 1000) + (bill.data.createdAt.nanoseconds / 1000000);
      
      const date = new Date(milliseconds);
      const yearBillCreatedAt = date.getFullYear();

      const monthNames = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
      ];
      const monthBillCreatedAt = monthNames[date.getMonth()];

      const billRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'bills', bill.id);
      const billDoc = await getDoc(billRef);
  
      if (!billDoc.exists()) {
        console.error('No se encontró la factura a eliminar.');
        return;
      }
  
      const amountToDelete = parseFloat(billDoc.data().amount) || 0;
      
      await deleteDoc(billRef);
  
      const totalAmountRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'amounts', 'totalAmount');
      const totalAmountDoc = await getDoc(totalAmountRef);
  
      if (totalAmountDoc.exists()) {
        const currentTotalAmount = parseFloat(totalAmountDoc.data().amount) || 0;
        const newTotalAmount = Math.round((currentTotalAmount - amountToDelete) * 100) / 100;
  
        await setDoc(totalAmountRef, { amount: newTotalAmount });
      } else {
        console.error('No se encontró el totalAmount.');
      }
  
      const outstandingBalanceRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', yearBillCreatedAt.toString(), 'months', monthBillCreatedAt, 'amounts', 'outstandingBalance');
      const outstandingBalanceDoc = await getDoc(outstandingBalanceRef);
  
      if (outstandingBalanceDoc.exists()) {
        const currentOutstandingBalance = parseFloat(outstandingBalanceDoc.data().amount) || 0;
        const newOutstandingBalance = Math.round((currentOutstandingBalance - amountToDelete) * 100) / 100;
  
        await setDoc(outstandingBalanceRef, { amount: newOutstandingBalance });
      } else {
        console.error('No se encontró el outstandingBalance.');
      }
  
      Toast.show('Eliminado correctamente', Toast.TOP, {
        backgroundColor: 'green',
      });
      console.log('Factura eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
    }
  };
  
  const handleUpdatePaidStatus = async (billId, newPaidStatus, year, month) => {
    if (!user) {
      console.error('Usuario no autenticado.');
      return;
    }
  
    if (!billId) {
      console.error('El ID de la factura no puede estar vacío.');
      return;
    }
  
    try {
      const userId = user.uid;
      const userDocRef = doc(db, 'users', userId);
      const billsCollectionRef = collection(
        userDocRef,
        'general-list',
        'years',
        'years-list',
        year,
        'months',
        month,
        'bills'
      );
      const billDocRef = doc(billsCollectionRef, billId);
  
      const billDoc = await getDoc(billDocRef);
      if (!billDoc.exists()) {
        console.error('Factura no encontrada.');
        return;
      }
      const billData = billDoc.data();
      const billAmount = parseFloat(billData.amount) || 0;
  
      await updateDoc(billDocRef, { paid: newPaidStatus });
  
      const amountPaidRef = doc(userDocRef, 'general-list', 'years', 'years-list', year, 'months', month, 'amounts', 'amountPaid');
      const amountPaidDoc = await getDoc(amountPaidRef);
      
      const amountPaidData = amountPaidDoc.data();
      let amountPaid = parseFloat(amountPaidData.amount) || 0;

      const outstandingBalanceRef = doc(userDocRef,'general-list','years','years-list',year,'months',month,'amounts','outstandingBalance');
      const outstandingBalanceDoc = await getDoc(outstandingBalanceRef);
      
      
      const outstandingBalanceData = outstandingBalanceDoc.data();
      let outstandingBalanceAmount = parseFloat(outstandingBalanceData.amount) || 0;

      const difference = newPaidStatus ? billAmount : -billAmount;
  
      amountPaid = Math.round((amountPaid + difference) * 100) / 100;
      outstandingBalanceAmount = Math.round((outstandingBalanceAmount - difference) * 100) / 100;
  
      

      await updateDoc(amountPaidRef, { amount: amountPaid });
      await updateDoc(outstandingBalanceRef, { amount: outstandingBalanceAmount });

      if (!outstandingBalanceDoc.exists()) {
        await setDoc(outstandingBalanceRef, { amount: outstandingBalanceAmount });
      }

      if (!amountPaidDoc.exists()) {
        await setDoc(amountPaidRef, { amount: amountPaid });
      }
  
      console.log(`El estado de pago de la factura con ID ${billId} ha sido actualizado a ${newPaidStatus}.`);
      console.log(`amountPaid ha sido actualizado a ${amountPaid}.`);
      console.log(`outstandingBalance ha sido actualizado a ${outstandingBalanceAmount}.`);
      
    } catch (error) {
      console.error('Error al actualizar el estado de pago de la factura:', error);
    }
  };

  const handleSort = async (type, monthId) => {
    try {
      const monthIndex = monthsData.findIndex(month => month.id === monthId);
      if (monthIndex === -1) {
        throw new Error(`No se encontró el mes con id ${monthId}`);
      }
  
      const bills = monthsData[monthIndex].bills;
  
      switch (type) {
        case 'noPaid':
          // Ordenar por NO pagados
          const sortedByPaid = [...bills].sort((a, b) => (a.data.paid > b.data.paid) ? 1 : -1);
          updateMonthsData(monthIndex, sortedByPaid);
          break;
        case 'paid':
          // Ordenar por pagados
          const sortedByNoPaid = [...bills].sort((a, b) => (a.data.paid < b.data.paid) ? 1 : -1);
          updateMonthsData(monthIndex, sortedByNoPaid);
          break;
        case 'highestAmount':
          // Ordenar por importe más alto
          const sortedByHighestAmount = [...bills].sort((a, b) => b.data.amount - a.data.amount);
          updateMonthsData(monthIndex, sortedByHighestAmount);
          break;
        case 'lowestAmount':
          // Ordenar por importe más bajo
          const sortedByLowestAmount = [...bills].sort((a, b) => a.data.amount - b.data.amount);
          updateMonthsData(monthIndex, sortedByLowestAmount);
          break;
        case 'creation':
          // Ordenar por orden de creación
          const sortedByCreation = [...bills].sort((a, b) => (a.data.createdAt > b.data.createdAt) ? 1 : -1);
          updateMonthsData(monthIndex, sortedByCreation);
          break;
        case 'alphabeticalAsc':
          // Ordenar alfabéticamente de A a Z
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
          // Ordenar alfabéticamente de Z a A
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
          console.error('Tipo de ordenación no reconocido');
          break;
      }
    } catch (error) {
      console.error('Error al ordenar los gastos: ', error);
    }
  };
  
  const updateMonthsData = (monthIndex, sortedBills) => {
    const updatedMonthsData = [...monthsData];
    updatedMonthsData[monthIndex].bills = sortedBills;
    setMonthsData(updatedMonthsData);
  };

  const handleAddSalary = async (salary) => {
    if (!salary) {
      console.error('Debes introducir una cantidad de salario');
      return;
    }
    if (user) {
      const userId = user.uid;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthNames = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
      ];
      const currentMonthName = monthNames[currentMonth];
  
      try {
        const userDocRef = doc(db, 'users', userId);
        const salaryRef = doc(userDocRef, 'general-list', 'salary');
  
        let salaryAmount = parseFloat(salary.replace(',', '.'));
        salaryAmount = Math.round(salaryAmount * 100) / 100;
        await setDoc(salaryRef, { amount: salaryAmount });
  
        const monthDocRef = doc(db, `users/${userId}/general-list/years/years-list/${currentYear}/months/${currentMonthName}`);
        const monthDocSnapshot = await getDoc(monthDocRef);
  
        if (monthDocSnapshot.exists()) {
          await setDoc(monthDocRef, { salary: salaryAmount }, { merge: true });
          console.log(`Salario actualizado para el mes de ${currentMonthName} del año ${currentYear}`);
        } else {
          console.log(`El documento para el mes de ${currentMonthName} del año ${currentYear} no existe`);
        }
      } catch (error) {
        console.error('Error al agregar el salario:', error);
      }
    } else {
      console.error('Usuario no encontrado al intentar añadir tu salario.');
    }
  };
  
  const getSalaryByUser = async (userId) => {
    if (!userId) {
      console.error('El ID del usuario no puede estar vacío.');
      return;
    }
  
    try {
      const salaryRef = doc(db, 'users', userId, 'general-list', 'salary');
      const salarySnap = await getDoc(salaryRef);
  
      if (salarySnap.exists()) {
        const salaryData = salarySnap.data();
        return parseFloat(salaryData.amount).toFixed(2);
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error al obtener el salario:', error);
      return null;
    }
  };

  const getTotalAmountByUser = async (userId) => {
    if (!userId) {
      console.error('El ID del usuario no puede estar vacío.');
      return;
    }

    try {
      const totalAmountRef = doc(db, 'users', userId, 'general-list', 'totalAmount');
      const totalAmountSnap = await getDoc(totalAmountRef);

      if (totalAmountSnap.exists()) {
        const totalAmountData = totalAmountSnap.data();
        
        return parseFloat(totalAmountData.amount).toFixed(2);
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error al obtener el importe total:', error);
      return null;
    }
  };

  const getRemainingAmountByUser = async (userId) => {
    if (!userId) {
      console.error('El ID del usuario no puede estar vacío.');
      return;
    }

    try {
      const remainingAmountRef = doc(db, 'users', userId, 'general-list', 'remainingAmount');
      const remainingAmountSnap = await getDoc(remainingAmountRef);

      if (remainingAmountSnap.exists()) {
        const remainingAmountData = remainingAmountSnap.data();
        
        return parseFloat(remainingAmountData.amount).toFixed(2);
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error al obtener el importe restante:', error);
      return null;
    }
  };
  
  const handleAddExtraIncome = async (extraIncome, year, month) => {
    const userId = user.uid;

    try {
      const newExtraIncome = {
        amount: extraIncome.amount,
        description: extraIncome.description,
        timestamp: new Date()
      };
      await addDoc(collection(db, 'users', userId, 'general-list', 'years', 'years-list', year, 'months', month, 'extra-income'), newExtraIncome);
      console.log('Gasto extra agregado correctamente.');
    } catch (error) {
      console.error('Error al agregar el extra:', error);
    }
  };

  const handleDeleteExtraIncome = async (extraIncome, year, month) => {
    const userId = user.uid;

    const extraIncomeRef = doc(db, 'users', userId, 'general-list', 'years', 'years-list', year, 'months', month, 'extra-income', extraIncome);
    
    try {
      const extraIncomeDoc = await getDoc(extraIncomeRef);
  
      if (!extraIncomeDoc.exists()) {
        console.error('No se encontró el ingreso extra a eliminar.');
        return;
      }
  
      await deleteDoc(extraIncomeRef);
  
    } catch (error) {
      console.error('Error al eliminar el ingreso extra:', error);
    }
  };

  return {
    bills,
    salary,
    handleAddBill,
    handleUpdateBill,
    handleUpdatePaidStatus,
    handleSort,
    handleAddSalary,
    handleDeleteBill,
    getSalaryByUser,
    getTotalAmountByUser,
    getRemainingAmountByUser,
    handleAddExtraIncome,
    handleDeleteExtraIncome,
  };
};

export default BillsListLogic;
