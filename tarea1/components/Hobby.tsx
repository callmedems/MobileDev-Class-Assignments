import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Hobby = () => {
  return <Text style={styles.text}>Hobbies: Leer y escribir</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Hobby;
