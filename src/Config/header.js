import React, { useState } from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Avatar, Menu, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HeaderRight = ({ title }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <Avatar.Image size={40} source={require('../../assets/avatar-default.png')} style={styles.avatar} />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action 
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
              style={styles.menuIcon}
            />
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item 
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('ProfileScreen');
            }} 
            title="Mi perfil" 
            icon="account" 
          />
        </Menu>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  avatar: {
    marginRight: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
  menuContent: {
    marginTop: 40,
  },
});

export default HeaderRight;
