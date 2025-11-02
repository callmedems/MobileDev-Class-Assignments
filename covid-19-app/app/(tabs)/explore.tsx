import CovidController from '@/controllers/CovidController';
import { Country } from '@/models/CovidModel';
import { CountryDetailView } from '@/views/CountryDetailView';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.countryName) {
      loadCountryDetails(params.countryName as string);
    }
  }, [params.countryName]);

  const loadCountryDetails = async (countryName: string) => {
    try {
      setLoading(true);
      
      //cargar datos actuales del país
      const countryData = await CovidController.loadCountryDetails(countryName);
      setCountry(countryData);

      //cargar datos de muertes por año para la gráfica
      const deathsData = await CovidController.loadDeathsData(countryName);
      setChartData(deathsData);
    } catch (error) {
      console.error('No se pudieron cargar los datos del país:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>COVID 19</Text>
      </View>
      <CountryDetailView
        country={country}
        chartData={chartData}
        loading={loading}
        formatNumber={CovidController.formatNumber}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'purple',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
});
