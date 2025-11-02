// View - Detalles del país con gráfica
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Country } from '../models/CovidModel';

interface CountryDetailViewProps {
  country: Country | null;
  chartData: any;
  loading: boolean;
  formatNumber: (num: number) => string;
}

export const CountryDetailView: React.FC<CountryDetailViewProps> = ({
  country,
  chartData,
  loading,
  formatNumber,
}) => {
  if (loading || !country) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: country.countryInfo?.flag || 'https://via.placeholder.com/120x80' }}
          style={styles.flag}
          resizeMode="contain"
        />
        <Text style={styles.countryName}>{country.country}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, styles.casesCard]}>
          <Text style={styles.statLabel}>Casos</Text>
          <Text style={styles.statValue}>{formatNumber(country.cases || 0)}</Text>
        </View>

        <View style={[styles.statCard, styles.recoveredCard]}>
          <Text style={styles.statLabel}>Recuperados</Text>
          <Text style={styles.statValue}>{formatNumber(country.recovered || 0)}</Text>
        </View>

        <View style={[styles.statCard, styles.deathsCard]}>
          <Text style={styles.statLabel}>Fallecidos</Text>
          <Text style={styles.statValue}>{formatNumber(country.deaths || 0)}</Text>
        </View>
      </View>

      {chartData && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Casos Acumulados (últimos 30 días)</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 20}
            height={220}
            chartConfig={{
              backgroundColor: '#6200EE',
              backgroundGradientFrom: '#6200EE',
              backgroundGradientTo: '#9D4EDD',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#fff',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      <View style={styles.additionalStats}>
        <View style={styles.additionalStatRow}>
          <Text style={styles.additionalStatLabel}>Casos activos:</Text>
          <Text style={styles.additionalStatValue}>{formatNumber(country.active || 0)}</Text>
        </View>
        <View style={styles.additionalStatRow}>
          <Text style={styles.additionalStatLabel}>Críticos:</Text>
          <Text style={styles.additionalStatValue}>{formatNumber(country.critical || 0)}</Text>
        </View>
        <View style={styles.additionalStatRow}>
          <Text style={styles.additionalStatLabel}>Tests realizados:</Text>
          <Text style={styles.additionalStatValue}>{formatNumber(country.tests || 0)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  flag: {
    width: 120,
    height: 80,
    marginBottom: 10,
    borderRadius: 10,
  },
  countryName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  casesCard: {
    backgroundColor: '#FFE5E5',
  },
  recoveredCard: {
    backgroundColor: '#E5F7E5',
  },
  deathsCard: {
    backgroundColor: '#F5F5F5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  additionalStats: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  additionalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  additionalStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  additionalStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
