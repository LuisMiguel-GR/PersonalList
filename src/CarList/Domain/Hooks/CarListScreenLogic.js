import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import db from '../../../Config/firebase';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import Toast from 'react-native-simple-toast';

const BillsListLogic = () => {
  const [carBills, setCarBills] = useState([]);
  const { user } = useUser();
  const [salary, setSalary] = useState(0);

  useEffect(() => {
    if (user) {

      const userId = user.uid;

      const salaryRef = doc(db, 'users', userId, 'car-list', 'salary');
      const fetchSalary = async () => {
        try {
          const salaryDoc = await getDoc(salaryRef);
          if (salaryDoc.exists()) {
            const salaryData = salaryDoc.data();
            setSalary(salaryData.amount);
          } else {
            // console.log('El salario no está definido para este usuario.');
          }
        } catch (error) {
          console.error('Error al obtener el salario:', error);
        }
      };

      fetchSalary();

      const carBillsRef = collection(db, 'users', userId, 'car-list', 'carBillsList', 'bills');
      const q = query(carBillsRef, orderBy('createdAt', 'asc'));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const carBillsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCarBills(carBillsList);
      });
  
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddCarBill = async (newCarBillData) => {
    if (!newCarBillData || !newCarBillData.name) {
      console.error('El nuevo gasto debe tener un nombre.');
      return;
    }
  
    if (user) {
      const userId = user.uid;
      const newCarBill = { 
        name: newCarBillData.name, 
        paid: false, 
        description: newCarBillData.description || '',
        amount: newCarBillData.amount || 0,
        currentKms: newCarBillData.currentKms || 0,
        nextKms: newCarBillData.nextKms || 0,
        createdAt: newCarBillData.createdAt
      };
  
      try {
        await addDoc(collection(db, 'users', userId, 'car-list', 'carBillsList', 'bills'), newCarBill);
      } catch (error) {
        console.error('Error al agregar el gasto:', error);
      }
    } else {
      console.error('Usuario no encontrado al intentar agregar el gasto.');
    }
  };
  
  const handleUpdateCarBill = async (carBillId, newCarBillData) => {
    if (!newCarBillData || !newCarBillData.name.trim()) {
      console.error('El nuevo nombre del gasto no puede estar vacío.');
      return;
    }
  
    if (user) {
      const userId = user.uid;
  
      try {
        const carBillRef = doc(db, 'users', userId, 'car-list', 'carBillsList', 'bills', carBillId);
  
        await updateDoc(carBillRef, {
          name: newCarBillData.name.trim(),
          description: newCarBillData.description || '',
          amount: newCarBillData.amount || 0,
          timestamp: new Date()
        });

        Toast.show(
          `El gasto ${newCarBillData.name.trim()} se ha actualizado correctamente`, Toast.TOP, {
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
    } else {
      Toast.show(
        'Error al actualizar el gasto', Toast.TOP, {
          backgroundColor: 'red',
        }
      );
      console.error('Usuario no encontrado al intentar actualizar el gasto.');
    }
  };

  const handleDeleteCarBill = async (id) => {
    if (!user) {
      console.error('Usuario no autenticado.');
      return;
    }
  
    if (!id) {
      console.error('El ID de la factura no puede estar vacío.');
      return;
    }
  
    try {
      const userDocRef = doc(db, 'users', user.uid, 'car-list', 'carBillsList');
      const carBillsCollectionRef = collection(userDocRef, 'bills');
      const carBillDocRef = doc(carBillsCollectionRef, id);
  
      await deleteDoc(carBillDocRef);
    } catch (error) {
      console.error('Error al eliminar la factura:', error);
    }
  };

  const handleUpdatePaidStatus = async (carBillId, newPaidStatus) => {
    if (!user) {
      console.error('Usuario no autenticado.');
      return;
    }
  
    if (!carBillId) {
      console.error('El ID de la factura no puede estar vacío.');
      return;
    }
  
    try {
      const userDocRef = doc(db, 'users', user.uid, 'car-list', 'carBillsList');
      const carBillsCollectionRef = collection(userDocRef, 'bills');
      const carBillDocRef = doc(carBillsCollectionRef, carBillId);
  
      await updateDoc(carBillDocRef, {
        paid: newPaidStatus
      });
  
    } catch (error) {
      console.error('Error al actualizar el estado de pago de la factura:', error);
    }
  };

  const handleSort = (type, year) => {
    switch (type) {
      case 'noPaid':
        // Ordenar por NO pagados, y luego por createdAt
        const sortedByNoPaid = [...groupedCarBills[year]].sort((a, b) => {
          if (a.paid !== b.paid) {
            return a.paid ? 1 : -1;
          } else {
            return a.createdAt.seconds - b.createdAt.seconds;
          }
        });
        setCardBills(sortedByNoPaid);
        break;
      case 'paid':
        // Ordenar por pagados, y luego por createdAt
        const sortedByPaid = [...groupedCarBills[year]].sort((a, b) => {
          if (a.paid !== b.paid) {
            return a.paid ? -1 : 1;
          } else {
            return a.createdAt.seconds - b.createdAt.seconds;
          }
        });
        setCardBills(sortedByPaid);
        break;
      case 'highestAmount':
        // Ordenar por importe más alto, y luego por createdAt
        const sortedByHighestAmount = [...groupedCarBills[year]].sort((a, b) => {
          if (a.amount !== b.amount) {
            return b.amount - a.amount;
          } else {
            return a.createdAt.seconds - b.createdAt.seconds;
          }
        });
        setCardBills(sortedByHighestAmount);
        break;
      case 'lowestAmount':
        // Ordenar por importe más bajo, y luego por createdAt
        const sortedByLowestAmount = [...groupedCarBills[year]].sort((a, b) => {
          if (a.amount !== b.amount) {
            return a.amount - b.amount;
          } else {
            return a.createdAt.seconds - b.createdAt.seconds;
          }
        });
        setCardBills(sortedByLowestAmount);
        break;
      case 'creation':
        // Ordenar por orden de creación, y luego por otro criterio si es necesario
        const sortedByCreation = [...groupedCarBills[year]].sort((a, b) => {
          return a.createdAt.seconds - b.createdAt.seconds;
        });
        setCardBills(sortedByCreation);
        break;
      case 'alphabeticalAsc':
        // Ordenar alfabéticamente de A a Z, y luego por createdAt
        const sortedAlphabeticalAsc = [...groupedCarBills[year]].sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          } else {
            return 0;
          }
        });
        setCardBills(sortedAlphabeticalAsc);
        break;
      case 'alphabeticalDesc':
        // Ordenar alfabéticamente de Z a A, y luego por createdAt
        const sortedAlphabeticalDesc = [...groupedCarBills[year]].sort((a, b) => {
          if (a.name && b.name) {
            return b.name.localeCompare(a.name);
          } else {
            return 0;
          }
        });
        setCardBills(sortedAlphabeticalDesc);
        break;
      default:
        console.error('Palabra de ordenación no reconocida:', type);
        break;
    }
    
  };
  

  const handleAddSalary = async (salary) => {
    if (!salary) {
      console.error('Debes introducir una cantidad de salario');
      return;
    }
    if (user) {
      const userId = user.uid;
      try {
        const salaryRef = doc(db, 'users', userId, 'car-list', 'salary');
        await setDoc(salaryRef, { amount: salary });
      } catch (error) {
        console.error('Error al agregar el salario:', error);
      }
    } else {
      console.error('Usuario no encontrado al intentar anadir tu salario.');
    }
    
  };

  const getSalaryByUser = async (userId) => {
    if (!userId) {
      console.error('El ID del usuario no puede estar vacío.');
      return;
    }
  
    try {
      const salaryRef = doc(db, 'users', userId, 'car-list', 'salary');
      const salarySnap = await getDoc(salaryRef);
  
      if (salarySnap.exists()) {
        const salaryData = salarySnap.data();
        return salaryData.amount;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error al obtener el salario:', error);
      return null;
    }
  };

  return {
    carBills,
    salary,
    handleAddCarBill,
    handleUpdateCarBill,
    handleUpdatePaidStatus,
    handleSort,
    handleAddSalary,
    handleDeleteCarBill,
    getSalaryByUser,
  };
};

export default BillsListLogic;
