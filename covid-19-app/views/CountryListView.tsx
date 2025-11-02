// View - Lista de países con banderas
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Country } from '../models/CovidModel';

interface CountryListViewProps {
  countries: Country[];
  loading: boolean;
  onCountryPress: (country: Country) => void;
}

export const CountryListView: React.FC<CountryListViewProps> = ({
  countries,
  loading,
  onCountryPress,
}) => {
  const renderCountryItem = ({ item }: { item: Country }) => {
    if (!item || !item.country) return null;
    
    return (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => onCountryPress(item)}
      >
        <Image
          source={{ uri: item.countryInfo?.flag || 'https://via.placeholder.com/60x40' }}
          style={styles.flag}
          resizeMode="contain"
        />
        <View style={styles.countryInfo}>
          <Text style={styles.countryName}>{item.country}</Text>
          <Text style={styles.cases}>
            Casos: {(item.cases || 0).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Cargando países...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={countries}
      renderItem={renderCountryItem}
      keyExtractor={(item, index) => item.countryInfo?._id?.toString() || item.country || index.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
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
  listContainer: {
    padding: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flag: {
    width: 60,
    height: 40,
    marginRight: 15,
    borderRadius: 5,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cases: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
