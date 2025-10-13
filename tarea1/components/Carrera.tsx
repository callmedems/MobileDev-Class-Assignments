import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Carrera = () => {
  return <Text style={styles.text}>Carrera: Ingeniería en Tecnologías Computacionales</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Carrera;
