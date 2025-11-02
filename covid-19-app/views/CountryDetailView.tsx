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

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Muertes por Año</Text>
        {chartData && chartData.labels.length > 1 && (
          <Text style={styles.chartSubtitle}>Desliza para ver todos los años</Text>
        )}
        {chartData ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            style={styles.chartScrollView}
          >
            <LineChart
              data={chartData}
              width={Math.max(Dimensions.get('window').width - 20, chartData.labels.length * 100)}
              height={250}
              chartConfig={{
                backgroundColor: 'red',
                backgroundGradientFrom: 'firebrick',
                backgroundGradientTo: 'tomato',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: 'white',
                },
              }}
              bezier
              style={styles.chart}
            />
          </ScrollView>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No hay datos históricos disponibles para este país
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor:'white',
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
    color: 'black',
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
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  casesCard: {
    backgroundColor: 'white',
  },
  recoveredCard: {
    backgroundColor: 'white',
  },
  deathsCard: {
    backgroundColor: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'black',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  chartContainer: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  chartSubtitle: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  chartScrollView: {
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    marginBottom: 20,
  },
  noDataContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});
