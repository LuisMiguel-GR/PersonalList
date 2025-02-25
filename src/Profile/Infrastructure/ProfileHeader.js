import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Avatar } from 'react-native-paper';

const ProfileHeader = ({ photoUrl, displayName }) => {
  return (
    <View style={styles.container}>
      <Avatar.Image size={100} source={{ uri: photoUrl }} />
      <Text style={styles.displayName}>{displayName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  displayName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileHeader;