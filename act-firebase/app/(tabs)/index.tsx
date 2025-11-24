import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { logger } from '@/services/logger';
import { studentService } from '@/services/studentService';
import { StudentInput } from '@/types/student';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

/*
 * Data Entry Screen
 * Captures student information and saves to Firebase
 */
export default function DataEntryScreen() {
  const [matricula, setMatricula] = useState('');
  const [nombre, setNombre] = useState('');
  const [semestre, setSemestre] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /*Handle form submission*/
  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const studentInput: StudentInput = {
        matricula,
        nombre,
        semestre,
      };

      // Create student (validation happens in service)
      const student = await studentService.createStudent(studentInput);

      // Success feedback
      Alert.alert(
        'Éxito',
        `Estudiante ${student.nombre} guardado correctamente`,
        [{ text: 'OK' }]
      );

      // Clear form
      setMatricula('');
      setNombre('');
      setSemestre('');
    } catch (error: any) {
      // Error feedback
      Alert.alert('Error', error.message || 'Error al guardar el estudiante');
      await logger.error('Form submission error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if form is valid for submission
   */
  const isFormValid = () => {
    return matricula.trim().length > 0 && nombre.trim().length > 0 && semestre.trim().length > 0;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Práctica Firebase
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Ingresa los datos del estudiante
            </ThemedText>
          </ThemedView>

          {/* Form */}
          <ThemedView style={styles.form}>
            {/* Matrícula Input */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Matrícula</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Ingresa una matrícula..."
                placeholderTextColor="#999"
                value={matricula}
                onChangeText={setMatricula}
                editable={!isLoading}
                autoCapitalize="characters"
              />
            </ThemedView>

            {/* Nombre Input */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nombre Completo</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Ingresa un nombre..."
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
                editable={!isLoading}
                autoCapitalize="words"
              />
            </ThemedView>

            {/* Semestre Input */}
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.label}>Semestre</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Ingresa un número de semestre..."
                placeholderTextColor="#999"
                value={semestre}
                onChangeText={setSemestre}
                editable={!isLoading}
                keyboardType="numeric"
              />
            </ThemedView>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid() || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>GUARDAR</ThemedText>
              )}
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#5E35B1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
  },
});
