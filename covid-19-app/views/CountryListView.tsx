// View - Lista de países con banderas
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Country } from '../models/CovidModel';

interface CountryListViewProps {
  countries: Country[];
  loading: boolean;
  onCountryPress: (country: Country) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CountryListView: React.FC<CountryListViewProps> = ({
  countries,
  loading,
  onCountryPress,
  searchQuery,
  onSearchChange,
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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar país (en inglés)"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <FlatList
        data={countries}
        renderItem={renderCountryItem}
        keyExtractor={(item, index) => item.countryInfo?._id?.toString() || item.country || index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  listContainer: {
    padding: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: 'black',
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
    color: 'black',
  },
  cases: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});
