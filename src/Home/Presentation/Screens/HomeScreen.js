import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { View, ScrollView, ImageBackground, TouchableOpacity, Image  } from 'react-native';
import styles from '../Styles/stylesHome';
import { useUser } from '../../../Login/Presentation/Contexts/UserContext';
import { Menu, Provider, Appbar, IconButton, Card, Button, Title, Paragraph, Icon, Avatar, Divider } from 'react-native-paper';
import HeaderRight from '../../../Config/header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import db from '../../../Config/firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useUser();
  const [menuVisible, setMenuVisible] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const defaultAvatarUrl = require('../../../../assets/avatar-default.png');

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleProfilePress = () => {
    closeMenu();
    navigation.navigate('ProfileScreen');
  };

  const handleSuggestionsPress = () => {
    closeMenu();
    navigation.navigate('SuggestionsScreen');
  };

  const loadAvatarFromFirebase = async () => {
    try {
      const userProfileRef = doc(db, 'users', user.uid, 'profile', 'details');
      const userProfileDoc = await getDoc(userProfileRef);

      if (userProfileDoc.exists()) {
        setAvatarUrl(userProfileDoc.data().avatar);
      }
    } catch (error) {
      console.error('Error fetching avatar from Firebase Storage:', error);
    }
  };

  useEffect(() => {
    loadAvatarFromFirebase();
  }, []);


  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 10 }}>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
            <TouchableOpacity onPress={openMenu}>
              <Image
                style={[styles.avatar, { width: 50, height: 45, borderRadius: 50 }]}
                source={avatarUrl ? { uri: avatarUrl } : defaultAvatarUrl}
                resizeMode="cover"
              />
            </TouchableOpacity>
          }
            style={{ marginTop: 40 }}
          >
            <Menu.Item onPress={handleProfilePress} title="Perfil" />
            <Menu.Item onPress={handleSuggestionsPress} title="Sugerencias" />
          </Menu>
        </View>
      ),
    });
  }, [navigation, menuVisible]);

  return (
    <ImageBackground source={require('./../../../../assets/fondos/fondo-oscuro-ocasonubes.png')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          
          <Card style={styles.card}>
            <ImageBackground source={require('./../../../../assets/fondos/card/gastos-generales.png')} style={styles.cardBackground}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>GASTOS GENERALES</Title>
                <Paragraph style={styles.cardText}>Administra tus gastos fácilmente.</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button mode="contained" onPress={() => navigation.navigate('BillsListScreen')}>
                  VER LISTA
                </Button>
              </Card.Actions>
            </ImageBackground>
          </Card>
          
          <Card style={styles.card}>
            <ImageBackground source={require('./../../../../assets/fondos/card/coche.png')} style={styles.cardBackground}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>GASTOS DEL COCHE</Title>
                <Paragraph style={styles.cardText}>Administra los gastos de tu coche.</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button mode="contained" onPress={() => navigation.navigate('CarListScreen')}>
                  VER LISTA
                </Button>
              </Card.Actions>
            </ImageBackground>
          </Card>

          <Card style={styles.card}>
            <ImageBackground source={require('./../../../../assets/fondos/card/lista-deseos.png')} style={styles.cardBackground}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>DESEOS</Title>
                <Paragraph style={styles.cardText}>Apunta todo lo que quieres comprar en el futuro.</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button mode="contained" onPress={() => navigation.navigate('WishListScreen')}>
                  VER LISTA
                </Button>
              </Card.Actions>
            </ImageBackground>
          </Card>

          <Card style={styles.card}>
            <ImageBackground source={require('./../../../../assets/fondos/card/mercado.png')} style={styles.cardBackground}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>COMPRA SUPERMERCADO</Title>
                <Paragraph style={styles.cardText}>Controla lo que compras en el supermercado.</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button mode="contained">
                  No disponible
                </Button>
              </Card.Actions>
            </ImageBackground>
          </Card>

          <Card style={styles.card}>
            <ImageBackground source={require('./../../../../assets/fondos/card/animales.png')} style={styles.cardBackground}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>ANIMALES</Title>
                <Paragraph style={styles.cardText}>Lleva un control de los gastos de tus animales.</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button mode="contained">
                  No disponible
                </Button>
              </Card.Actions>
            </ImageBackground>
          </Card>

          <Card style={styles.card}>
            <ImageBackground source={require('./../../../../assets/fondos/card/viajes.png')} style={styles.cardBackground}>
              <Card.Content style={styles.cardContent}>
                <Title style={styles.cardTitle}>VIAJES</Title>
                <Paragraph style={styles.cardText}>Anota lo que tienes que llevarte en cada viaje.</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.cardActions}>
                <Button mode="contained">
                  No disponible
                </Button>
              </Card.Actions>
            </ImageBackground>
          </Card>

        </View>
      </ScrollView>
    </ImageBackground>
  );
};



export default HomeScreen;
