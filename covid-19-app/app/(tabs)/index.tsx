// Pantalla principal: Lista de países con casos de COVID-19
import CovidController from '@/controllers/CovidController';
import { Country } from '@/models/CovidModel';
import { CountryListView } from '@/views/CountryListView';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await CovidController.loadCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryPress = (country: Country) => {
    // Navegar a la segunda pantalla con los detalles del país
    router.push({
      pathname: '/(tabs)/explore',
      params: { 
        countryName: country.country,
        countryData: JSON.stringify(country)
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>COVID-19</Text>
        <Text style={styles.headerSubtitle}>Lista de Países</Text>
      </View>
      <CountryListView
        countries={countries}
        loading={loading}
        onCountryPress={handleCountryPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
});
