import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi App Expo — ¡Hola, clase!</Text>
      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.logo}
      />
      <Text style={styles.text}>Has presionado el botón {count} veces</Text>

      <TouchableOpacity style={styles.button} onPress={() => setCount(c => c + 1)}>
        <Text style={styles.buttonText}>Presióname</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.reset]} onPress={() => setCount(0)}>
        <Text style={styles.buttonText}>Reiniciar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  logo: { width: 80, height: 80, marginBottom: 12 },
  text: { fontSize: 16, marginBottom: 16 },
  button: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6
  },
  reset: { backgroundColor: '#666' },
  buttonText: { color: '#fff', fontWeight: '600' }
});