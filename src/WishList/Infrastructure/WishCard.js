import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { doc, updateDoc, deleteDoc, serverTimestamp, getDocs, collection } from 'firebase/firestore';
import db from '../../Config/firebase';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import styles from '../Presentation/Styles/stylesWishCard';
import { Swipeable } from 'react-native-gesture-handler';
import { CheckBox, Button } from 'react-native-elements';

const WishCard = ({ wish, onEdit }) => {
  const { user } = useUser();

  const handleToggleBought = async () => {
    if (user) {
      const wishRef = doc(db, `users/${user.uid}/wish-list`, wish.id);
      await updateDoc(wishRef, {
        bought: !wish.bought,
        updatedAt: serverTimestamp()
      });
    }
  };

  const handleDelete = async () => {
    if (user) {
      const querySnapshot = await getDocs(collection(db, `users/${user.uid}/wish-list`, wish.id, 'urls'));
      querySnapshot.forEach((url) => {
        deleteDoc(doc(db, `users/${user.uid}/wish-list`, wish.id, 'urls', url.id));
      });

      const wishRef = doc(db, `users/${user.uid}/wish-list`, wish.id);
      await deleteDoc(wishRef);
    }
  };

  const renderRightActions = () => (
    <View style={styles.rightActions}>
      <Button
        title="Eliminar"
        onPress={handleDelete}
        buttonStyle={{ backgroundColor: 'red' }}
      />
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <TouchableOpacity onLongPress={() => onEdit(wish)}>
            <View style={styles.card}>
                <View style={styles.row}>
                    <TouchableOpacity onPress={handleToggleBought}>
                    <View style={[styles.checkbox, { borderColor: wish.bought ? 'blue' : '#ccc' }]}>
                        {wish.bought && <View style={styles.checkboxInner} />}
                    </View>
                    </TouchableOpacity>
                    <View style={styles.info}>
                        <Text style={styles.title}>{wish.name}</Text>
                        <Text style={styles.description}>{wish.description}</Text>
                    </View>
                    <Text style={styles.amount}>{wish.amount} €</Text>
                </View>
            </View>
        </TouchableOpacity>
    </Swipeable>
  );
}

export default WishCard;
