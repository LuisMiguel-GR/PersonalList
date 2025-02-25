import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc, collection, addDoc, query, getDocs } from 'firebase/firestore';
import db from '../../../Config/firebase';
import Toast from 'react-native-simple-toast';

const initializeUserData = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);

    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    const currentMonth = monthNames[new Date().getMonth()];
    const currentYear = new Date().getFullYear();
    
    const generalListRef = doc(userDocRef, 'general-list', 'years', 'years-list', currentYear.toString(), 'months', currentMonth, 'bills', 'example');
    const salaryDoc1 = await getDoc(generalListRef);

    if (!salaryDoc1.exists()) {
      try {
       /* await setDoc(generalListRef, {
          name: 'Gasto 1',
          amount: 100,
          description: 'Descripcion',
          paid: false,
          createdAt: new Date()
        });
        */
        console.log('Documento de salario creado para el usuario.');
      } catch (error) {
        console.error('Error al crear el documento:', error);
      }
    } else {
      console.log('El documento ya existe.');
    }

    const nameYearRef = doc(userDocRef, 'general-list', 'years', 'years-list', currentYear.toString());
    const nameYearDoc = await getDoc(nameYearRef);
    if (!nameYearDoc.exists()) {
      await setDoc(nameYearRef, { name: currentYear }, { merger: true });
      console.log('Campo con el nombre del mes creado.');
    }

    const nameMonthRef = doc(userDocRef, 'general-list', 'years', 'years-list', currentYear.toString(), 'months', currentMonth);
    const nameMonthDoc = await getDoc(nameMonthRef);
    if (!nameMonthDoc.exists()) {
      await setDoc(nameMonthRef, { name: currentMonth }, { merger: true });
      console.log('Campo con el nombre del mes creado.');
    }

    const salaryRef = doc(userDocRef, 'general-list', 'salary');
    const salaryDoc = await getDoc(salaryRef);
    if (!salaryDoc.exists()) {
      await setDoc(salaryRef, { amount: 0 });
      console.log('Documento de salario creado para el usuario.');
    }

    const totalAmountRef = doc(userDocRef, 'general-list', 'totalAmount');
    const totalAmountDoc = await getDoc(totalAmountRef);
    if (!totalAmountDoc.exists()) {
      await setDoc(totalAmountRef, { amount: 0 });
      console.log('Documento de totalAmount creado para el usuario.');
    }

    
    const outstandingBalanceRef = doc(userDocRef, 'general-list', 'outstandingBalance');
    const outstandingBalanceDoc = await getDoc(outstandingBalanceRef);
    if (!outstandingBalanceDoc.exists()) {
      await setDoc(outstandingBalanceRef, { amount: 0 });
      console.log('Documento de outstandingBalance creado para el usuario.');
    }

    const amountPaidRef = doc(userDocRef, 'general-list', 'amountPaid');
    const amountPaidDoc = await getDoc(amountPaidRef);
    if (!amountPaidDoc.exists()) {
      await setDoc(amountPaidRef, { amount: 0 });
      console.log('Documento de amountPaid creado para el usuario.');
    }

  } catch (error) {
    console.error('Error al inicializar los datos del usuario:', error);
    Toast.show('Error al inicializar los datos del usuario', Toast.TOP, { backgroundColor: 'red' });
  }
};

const useInitializeUser = (userId) => {
  useEffect(() => {
    if (userId) {
      initializeUserData(userId);
    }
  }, [userId]);
};

export default useInitializeUser;
