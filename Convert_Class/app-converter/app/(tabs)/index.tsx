import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');

  // Función para convertir Celsius a Fahrenheit
  const celsiusToFahrenheit = (temp: number): number => {
    return (temp * 9/5) + 32;
  };

  // Función para convertir Fahrenheit a Celsius
  const fahrenheitToCelsius = (temp: number): number => {
    return (temp - 32) * 5/9;
  };

  // Manejar conversión cuando se cambia Celsius
  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    if (value === '') {
      setFahrenheit('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const converted = celsiusToFahrenheit(numValue);
      setFahrenheit(converted.toFixed(1));
    }
  };

  // Manejar conversión cuando se cambia Fahrenheit
  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    if (value === '') {
      setCelsius('');
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const converted = fahrenheitToCelsius(numValue);
      setCelsius(converted.toFixed(1));
    }
  };

  // Función del botón convertir (conversión automática ya implementada)
  const handleConvert = () => {
    if (celsius === '' && fahrenheit === '') {
      Alert.alert('Error', 'Por favor ingresa una temperatura para convertir');
      return;
    }
    Alert.alert('Conversión', 'La conversión se actualiza automáticamente mientras escribes');
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7B2CBF" />
      
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Convertidor</ThemedText>
      </ThemedView>

      <ThemedView style={styles.content}>
        <ThemedText style={styles.title}>Convertidor de temperaturas</ThemedText>

        {/* Celsius Input */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Grados Celsius:</ThemedText>
          <TextInput
            style={styles.input}
            value={celsius}
            onChangeText={handleCelsiusChange}
            placeholder="Ingresa temperatura en °C"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </ThemedView>

        {/* Fahrenheit Input */}
        <ThemedView style={styles.inputContainer}>
          <ThemedText style={styles.label}>Grados Fahrenheit:</ThemedText>
          <TextInput
            style={styles.input}
            value={fahrenheit}
            onChangeText={handleFahrenheitChange}
            placeholder="Ingresa temperatura en °F"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </ThemedView>

        {/* Convert Button */}
        <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
          <ThemedText style={styles.buttonText}>CONVERTIR</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#7B2CBF',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#7B2CBF',
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 18,
    color: '#333',
    backgroundColor: 'transparent',
  },
  convertButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 40,
    minWidth: 150,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});