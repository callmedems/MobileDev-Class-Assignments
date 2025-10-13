import { Image } from 'expo-image';
import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ColorSliderScreen() {
//constantes
  const [red, setRed] = useState(128);
  const [green, setGreen] = useState(128);
  const [blue, setBlue] = useState(128);

  // carga los colroes
  useEffect(() => {
    const loadColors = async () => {
      try {
        const savedRed = await AsyncStorage.getItem('red');
        const savedGreen = await AsyncStorage.getItem('green');
        const savedBlue = await AsyncStorage.getItem('blue');

        // Si encontramos valores, los usamos para actualizar el estado
        if (savedRed !== null) setRed(JSON.parse(savedRed));
        if (savedGreen !== null) setGreen(JSON.parse(savedGreen));
        if (savedBlue !== null) setBlue(JSON.parse(savedBlue));
      } catch (e) {
        console.error("Error al cargar los colores.", e);
      }
    };

    loadColors();
  }, []); // significa que esto se ejecuta solo una vez al inicio

  // para guardar los colores cada vez que cambian
  useEffect(() => {
    const saveColors = async () => {
      try {
        await AsyncStorage.setItem('red', JSON.stringify(red));
        await AsyncStorage.setItem('green', JSON.stringify(green));
        await AsyncStorage.setItem('blue', JSON.stringify(blue));
      } catch (e) {
        console.error("Error al guardar los colores.", e);
      }
    };

    saveColors();
  }, [red, green, blue]); // se ejecuta cada vez que 'red', 'green' o 'blue' cambian

  // 4. Creamos el string de color para el fondo
  const backgroundColor = `rgb(${red}, ${green}, ${blue})`;

  // 5. Renderizamos los componentes
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.sliderGroup}>
        {/* Slider para el Rojo */}
        <View style={styles.sliderRow}>
          <Text style={[styles.label, { backgroundColor: 'red' }]}>Red</Text>
          <Text style={styles.value}>{red}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={red}
          onValueChange={setRed}
          minimumTrackTintColor="#FF0000"
          thumbTintColor="white"
        />
      </View>

      <View style={styles.sliderGroup}>
        {/* Slider para el Verde */}
        <View style={styles.sliderRow}>
          <Text style={[styles.label, { backgroundColor: 'green' }]}>Green</Text>
          <Text style={styles.value}>{green}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={green}
          onValueChange={setGreen}
          minimumTrackTintColor="#00FF00"
          thumbTintColor="white"
        />
      </View>

      <View style={styles.sliderGroup}>
        {/* Slider para el Azul */}
        <View style={styles.sliderRow}>
          <Text style={[styles.label, { backgroundColor: 'blue' }]}>Blue</Text>
          <Text style={styles.value}>{blue}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={255}
          step={1}
          value={blue}
          onValueChange={setBlue}
          minimumTrackTintColor="#0000FF"
          thumbTintColor="white"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
