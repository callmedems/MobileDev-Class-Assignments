import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Nombre = () => {
  return <Text style={styles.text}>Nombre: Demmí Elizabeth Zepeda Rubio</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Nombre;
