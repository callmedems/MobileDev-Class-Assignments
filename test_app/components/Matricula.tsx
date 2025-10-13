import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Matricula: React.FC = () => {
  return <Text style={styles.text}>Matrícula: A01709619</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#34495e',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Matricula;
