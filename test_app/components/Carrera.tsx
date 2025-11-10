import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Carrera: React.FC = () => {
  return <Text style={styles.text}>Carrera: Ingeniería en Tecnologías Computacionales</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#34495e',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Carrera;
