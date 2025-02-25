import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import db from '../../Config/firebase';
import { View, TextInput, Button } from 'react-native';
import { useUser } from '../../Login/Presentation/Contexts/UserContext';
import styles from '../Presentation/Styles/stylesWishForm';

const WishForm = ({ }) =>  {
  const { user } = useUser();

  const [wish, setWish] = useState({
    name: '',
    description: '',
    amount: '',
    bought: false,
    urls: []
  });

  const handleChange = (name, value) => {
    setWish(prevWish => ({
      ...prevWish,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (user) {
      await addDoc(collection(db, `users/${user.uid}/wish-list`), {
        ...wish,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setWish({
        name: '',
        description: '',
        amount: '',
        bought: false,
        urls: []
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={wish.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        value={wish.description}
        onChangeText={(text) => handleChange('description', text)}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={wish.amount.toString()}
        onChangeText={(text) => handleChange('amount', text)}
        keyboardType="numeric"
      />
      <Button
        title="Add Wish"
        onPress={handleSubmit}
      />
    </View>
  );
}

export default WishForm;
