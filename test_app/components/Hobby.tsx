import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Hobby: React.FC = () => {
  return <Text style={styles.text}>Hobby: Leer y escribir</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: '#34495e',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Hobby;
