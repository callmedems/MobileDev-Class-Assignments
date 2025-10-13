import { EquationResult, solveQuadraticEquation } from '../utils/equationSolverLogic';
import React, { useState } from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';

// componente principal para las variables y la lógica de la calculadora
const EquationSolver = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState<EquationResult>({
    message: '',
    x1: null,
    x2: null,
  });

  const handleSolve = () => {  
    Keyboard.dismiss();
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    const solution = solveQuadraticEquation(numA, numB, numC); // llama a la función que resuelve la ecuación, 
    setResult(solution);
  };

  return (
    <View style={styles.container}> {/* contenedor principal */}
      <Text style={styles.title}>Ecuaciones de 2do Grado</Text>
      <Text style={styles.formula}>ax^2 + bx + c = 0</Text>
      <TextInput
        style={styles.input}
        placeholder="Coeficiente A"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={a}
        onChangeText={setA}
      />
      <TextInput
        style={styles.input}
        placeholder="Coeficiente B"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={b}
        onChangeText={setB}
      />
      <TextInput
        style={styles.input}
        placeholder="Coeficiente C"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={c}
        onChangeText={setC}
      />
      <View style={styles.buttonContainer}>
        <Button title="Resolver" onPress={handleSolve} color='magenta' />
      </View>
      
      <View style={styles.resultContainer}>
        {result.message ? <Text style={styles.resultMessage}>{result.message}</Text> : null}
        {result.x1 && (
          <View style={styles.rootBox}>
            <Text style={styles.rootText}>{result.x1}</Text>
          </View>
        )}
        {result.x2 && (
          <View style={styles.rootBox}>
            <Text style={styles.rootText}>{result.x2}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  formula: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: 'gray',
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  rootBox: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 220,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  rootText: {
    fontSize: 16,
    color: 'gray',
    fontWeight: '500',
  },
});

export default EquationSolver;
