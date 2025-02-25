import React from 'react';
import { FlatList, View } from 'react-native';
import ListItem from './ListItem';
import db from '../../Config/firebase';
import { doc, updateDoc, deleteDoc, setDoc, collection, addDoc, query, orderBy, onSnapshot, getFirestore } from 'firebase/firestore';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';



const ItemList = ({ items }) => {
const { user } = useUser();

const handlePaidChange = async (id, newPaidStatus) => {
  const userDocRef = doc(db, 'users', user.uid);
  const itemsCollectionRef = collection(userDocRef, 'items');
  const itemDocRef = doc(itemsCollectionRef, id);
  await updateDoc(itemDocRef, { paid: newPaidStatus });
};

const handleDeleteItem = async (id) => {
  const userDocRef = doc(db, 'users', user.uid);
  const itemsCollectionRef = collection(userDocRef, 'items');
  const itemDocRef = doc(itemsCollectionRef, id);
  await deleteDoc(itemDocRef);
};

return (
  <FlatList
    data={items}
    renderItem={({ item }) => (
      <ListItem item={item} 
        onPaidChange={handlePaidChange} 
        onDeleteItem={handleDeleteItem} 
        />
    )}
    keyExtractor={item => item.id.toString()}
  />
);
};

export default ItemList;
