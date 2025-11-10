import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Matricula = () => {
  return <Text style={styles.text}>Matrícula: A01709619</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Matricula;
