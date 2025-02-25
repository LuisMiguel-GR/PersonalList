import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import db from '../../../Config/firebase';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';

const HomeScreenLogic = () => {
  const [items, setItems] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const itemsRef = collection(db, 'users', userId, 'billss');
      const q = query(itemsRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const itemsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsList);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddItem = async (newItemData) => {
    if (!newItemData || !newItemData.name) {
      console.error('El nuevo ítem debe tener un nombre.');
      return;
    }
  
    if (user) {
      const userId = user.uid;
      const newItem = { 
        name: newItemData.name, 
        paid: 0, 
        description: newItemData.description || '',
        createdAt: new Date() 
      };
  
      try {
        await addDoc(collection(db, 'users', userId, 'bills'), newItem);
      } catch (error) {
        console.error('Error al agregar el ítem:', error);
      }
    } else {
      console.error('Usuario no encontrado al intentar agregar el ítem.');
    }
  };
  
  const handleUpdateGasto = async (itemId, newItemData) => {
    if (!newItemData || !newItemData.name.trim()) {
      console.error('El nuevo nombre del ítem no puede estar vacío.');
      return;
    }
  
    if (user) {
      const userId = user.uid;
  
      try {
        const itemRef = doc(db, 'users', userId, 'bills', itemId);
  
        await updateDoc(itemRef, {
          name: newItemData.name.trim(),
          description: newItemData.description || '',
          amount: newItemData.amount || 0,
          timestamp: new Date()
        });
  
        console.log('Ítem actualizado correctamente.');
      } catch (error) {
        console.error('Error al actualizar el ítem:', error);
      }
    } else {
      console.error('Usuario no encontrado al intentar actualizar el ítem.');
    }
  };

  const handleSort = (type) => {
    switch (type) {
      case 'noPaid':
        // Ordenar por NO pagados
        const sortedByPaid = [...items].sort((a, b) => (a.paid > b.paid) ? 1 : -1);
        setItems(sortedByPaid);
        break;
      case 'paid':
        // Ordenar por pagados
        const sortedByNoPaid = [...items].sort((a, b) => (a.paid < b.paid) ? 1 : -1);
        setItems(sortedByNoPaid);
        break;
      case 'creation':
        // Ordenar por orden de creación
        const sortedByCreation = [...items].sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
        setItems(sortedByCreation);
        break;
      case 'alphabeticalAsc':
        // Ordenar alfabéticamente de A a Z
        const sortedAlphabeticalAsc = [...items].sort((a, b) => {
          if (a.name && b.name) {
            return a.name.localeCompare(b.name);
          } else {
            return 0;
          }
        });
        setItems(sortedAlphabeticalAsc);
        break;
      case 'alphabeticalDesc':
        // Ordenar alfabéticamente de Z a A
        const sortedAlphabeticalDesc = [...items].sort((a, b) => {
          if (a.name && b.name) {
            return b.name.localeCompare(a.name);
          } else {
            return 0;
          }
        });
        setItems(sortedAlphabeticalDesc);
        break;
      default:
        break;
    }
  };

  return {
    items,
    handleAddItem,
    handleUpdateGasto,
    handleSort,
  };
};

export default HomeScreenLogic;
