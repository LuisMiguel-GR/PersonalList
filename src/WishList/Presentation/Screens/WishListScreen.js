import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import db from '../../../Config/firebase';
import WishForm from '../../Infrastructure/WishForm';
import WishCard from '../../Infrastructure/WishCard';
import WishModal from '../../Infrastructure/WishModal';
import WishAddModal from '../../Infrastructure/WishAddModal';
import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import styles from '../Styles/stylesWishList';
import WishListScreenLogic from '../../Domain/Hooks/WishListScreenLogic';

const WishListScreen = ({ navigation }) => {
  const { user } = useUser();
  const [wishes, setWishes] = useState([]);
  const [selectedWish, setSelectedWish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [totalComprado, setTotalComprado] = useState(0);
  const [totalNoComprado, setTotalNoComprado] = useState(0);

  const { addWish, handleUpdateBill, handleDeleteBill, handleUpdatePaidStatus } = WishListScreenLogic();

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      const wishListRef = collection(db, `users/${userId}/wish-list`);

      const unsubscribeSnapshot = onSnapshot(wishListRef, (snapshot) => {
        const updatedWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWishes(updatedWishes);

        const totalComprado = updatedWishes.reduce((acc, wish) => {
          if (wish.bought) {
            return acc + Number(wish.amount);
          }
          return acc;
        }, 0);
        setTotalComprado(totalComprado);

        const totalNoComprado = updatedWishes.reduce((acc, wish) => {
          if (!wish.bought) {
            return acc + Number(wish.amount);
          }
          return acc;
        }, 0);
        setTotalNoComprado(totalNoComprado);

      });

      return () => unsubscribeSnapshot();
    } else {
      setWishes([]);
      setTotalComprado(0);
      setTotalNoComprado(0);
    }
  }, [user]);

  const handleEdit = (wish) => {
    setSelectedWish(wish);
    setIsModalOpen(true);
  };

  const handleAddWish = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveWish = (newWish) => {
    addWish(newWish);
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
  setSelectedWish(null);
  }

  return (
    <ImageBackground source={require('./../../../../assets/fondos/fondo-claro-acuarelazul.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.section}>
            <View style={styles.sectionTitleCard}>
              <Text style={styles.sectionTitleLeft}>Deseos sin comprar</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.sectionTitleAmount}>Total a gastar: {totalNoComprado.toFixed(2).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}€</Text>
              </View>
            </View>

            {wishes.filter(wish => !wish.bought).length > 0 ? (
              wishes.filter(wish => !wish.bought).map(wish => (
                <WishCard key={wish.id} wish={wish} onEdit={handleEdit} />
              ))
            ) : (
              <View>
                <Text style={styles.noWishesText}>No existen deseos!</Text><Text style={styles.noWishesText}>Ponte a mirar cosas que comprar ya!</Text>
              </View>
              
            )}
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitleCard}>
              <Text style={styles.sectionTitleLeft}>Deseos ya comprados</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.sectionTitleAmount}>Total gastado: {totalComprado.toFixed(2).replace(/\./g, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}€</Text>
              </View>
            </View>
            {wishes.filter(wish => wish.bought).length > 0 ? (
              wishes.filter(wish => wish.bought).map(wish => (
                <WishCard key={wish.id} wish={wish} onEdit={handleEdit} />
              ))
            ) : (
              <Text style={styles.noWishesText}>No existen deseos comprados!</Text>
            )}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.addButton} onPress={handleAddWish}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        {selectedWish && (
          <WishModal
            wish={selectedWish}
            open={isModalOpen}
            onClose={() => handleCloseEditModal()}
          />
        )}
        <WishAddModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddWish={handleSaveWish}
        />
      </View>
    </ImageBackground>
  );
}

export default WishListScreen;
