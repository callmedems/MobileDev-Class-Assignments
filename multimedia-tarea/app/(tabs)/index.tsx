import { Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  // Bosque La Primavera
  const parkCenter = {
    latitude: 20.6597,
    longitude: -103.5447,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };



  return (
    <ScrollView style={styles.container}>
      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={parkCenter}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
        >
        </MapView>
      </View>

      {/* Main Content */}
      <ThemedView style={styles.content}>
        <ThemedView style={styles.titleContainer}>
          <Ionicons name="leaf" size={32} color="#4CAF50" />
          <ThemedText type="title">¡Conoce el Parque!</ThemedText>
        </ThemedView>

        <ThemedText style={styles.subtitle}>
          Este es un mapa del Bosque La Primavera.
        </ThemedText>

        {/* Music Section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <Ionicons name="headset" size={24} color="#FF9800" />
            <ThemedText type="subtitle">Música del Parque</ThemedText>
          </ThemedView>
          <ThemedText style={styles.text}>
            Visita la sección "Música" para disfrutar de canciones.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: 700,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapLegend: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingLeft: 8,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  mapPointsList: {
    marginTop: 8,
    gap: 8,
  },
  mapPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingLeft: 4,
  },
  mapPointText: {
    fontSize: 14,
    flex: 1,
    opacity: 0.8,
  },
});
