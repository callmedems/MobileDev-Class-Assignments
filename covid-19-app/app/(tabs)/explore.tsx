// Pantalla de detalles: Muestra información detallada del país con gráfica
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
    } else {
  
      loadCountryDetails('Mexico');
    }
  }, [params.countryName]);

  const loadCountryDetails = async (countryName: string) => {
    try {
      setLoading(true);
      
      // Cargar datos actuales del país
      const countryData = await CovidController.loadCountryDetails(countryName);
      setCountry(countryData);

      // Cargar datos históricos para la gráfica
      const historicalData = await CovidController.loadHistoricalData(countryName, 30);
      setChartData(historicalData);
    } catch (error) {
      console.error('Error loading country details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Covid19</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
});
