import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Nombre: React.FC = () => {
  return <Text style={styles.text}>Nombre: Demmí Elizabeth Zepeda Rubio</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#34495e',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Nombre;
