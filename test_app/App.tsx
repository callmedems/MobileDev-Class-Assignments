import React from 'react';
import { View, StyleSheet } from 'react-native';
import Nombre from './components/Nombre';
import Matricula from './components/Matricula';
import Carrera from './components/Carrera';
import Hobby from './components/Hobby';

// Cada dato se muestra en un componente separado
const App: React.FC = () => (
  <View style={styles.container}>
    <Nombre />
    <Matricula />
    <Carrera />
    <Hobby />
  </View>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f5f9fc',
  },
});
