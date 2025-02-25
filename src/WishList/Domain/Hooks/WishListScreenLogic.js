import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import db from '../../../Config/firebase';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import Toast from 'react-native-simple-toast';

const WishListScreenLogic = () => {
  const [items, setItems] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const itemsRef = collection(db, 'users', userId, 'wish-list');
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

  const addWish = async (newItemData) => {
    if (!newItemData || !newItemData.name) {
      console.error('El nuevo ítem debe tener un nombre.');
      Toast.show(
        `El nuevo deseo debe contener un nombre`, Toast.TOP, {
          backgroundColor: 'red',
        }
      );
      return;
    }

    const cleanedAmount = newItemData.amount ? newItemData.amount.replace(/\s/g, '') : '0';
    const amount = parseFloat(cleanedAmount);
  
    if (isNaN(amount)) {
      console.error('El importe debe ser un número válido.');
      Toast.show(
        `El importe debe ser un número válido`, Toast.TOP, {
          backgroundColor: 'red',
        }
      );
      return;
    }
  
    if (user) {
      const userId = user.uid;
      const wishCollectionRef = collection(db, `users/${userId}/wish-list`);
  
      const newWish = {
        name: newItemData.name,
        description: newItemData.description || '',
        bought: false,
        amount: amount,
        createdAt: serverTimestamp(),
      };
  
      try {
        const newWishRef = await addDoc(wishCollectionRef, newWish);
        console.log('¡Deseo agregado correctamente!');
  
        if (newItemData.urls && newItemData.urls.length > 0) {
          const urlsCollectionRef = collection(db, `users/${userId}/wish-list/${newWishRef.id}/urls`);
          newItemData.urls.forEach(async (urlData) => {
            if (urlData.url.trim() !== '') {
              const cleanedUrlAmount = urlData.amount ? urlData.amount.replace(/\s/g, '') : '0';
              const urlAmount = parseFloat(cleanedUrlAmount);
  
              if (!isNaN(urlAmount)) {
                await addDoc(urlsCollectionRef, { url: urlData.url, amount: urlAmount });
              } else {
                console.error(`El importe para la URL ${urlData.url} no es un número válido.`);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al agregar el deseo:', error);
      }
    } else {
      console.error('Usuario no encontrado al intentar agregar el deseo.');
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
    addWish,
    handleUpdateGasto,
    handleSort,
  };
};

export default WishListScreenLogic;
