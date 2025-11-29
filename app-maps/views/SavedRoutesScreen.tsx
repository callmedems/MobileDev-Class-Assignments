import { ActivityType, SavedRoute } from '@/models/ActivityModel';
import RouteService from '@/services/RouteService';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { WebView } from 'react-native-webview';

export default function SavedRoutesScreen() {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapHTML, setMapHTML] = useState('');

  //para cargar las rutas
  const loadRoutes = async () => {
    try {
      const savedRoutes = await RouteService.getAllRoutes();
      setRoutes(savedRoutes.sort((a: SavedRoute, b: SavedRoute) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  //recargar rutas
  useFocusEffect(
    useCallback(() => {
      loadRoutes();
    }, [])
  );

  //fecha
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  //duración
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  //ver mapa
  const handleViewMap = (route: SavedRoute) => {
    const html = RouteService.generateMapHTML(route.activities);
    setMapHTML(html);
    setSelectedRoute(route);
    setShowMapModal(true);
  };

  //para eliminar una ruta
  const handleDelete = (route: SavedRoute) => {
    Alert.alert(
      'Eliminar Ruta',
      `¿Estás seguro de eliminar "${route.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await RouteService.deleteRoute(route.id);
              loadRoutes();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la ruta.');
            }
          },
        },
      ]
    );
  };

  //obtener actividad predominante, para que se vea el icono adecuado
  const getPredominantActivity = (route: SavedRoute): ActivityType => {
    const breakdown = route.stats.activityBreakdown;
    let maxTime = 0;
    let predominant = ActivityType.UNKNOWN;

    Object.keys(breakdown).forEach((activity) => {
      const activityType = activity as ActivityType;
      if (breakdown[activityType] > maxTime) {
        maxTime = breakdown[activityType];
        predominant = activityType;
      }
    });

    return predominant;
  };

  //obtener icono de actividad
  const getActivityIcon = (activity: ActivityType) => {
    const icons = {
      [ActivityType.IDLE]: { name: 'bed', type: 'FontAwesome' as const },
      [ActivityType.WALKING]: { name: 'walk', type: 'MaterialCommunityIcons' as const },
      [ActivityType.RUNNING]: { name: 'run', type: 'MaterialCommunityIcons' as const },
      [ActivityType.VEHICLE]: { name: 'car', type: 'FontAwesome' as const },
      [ActivityType.UNKNOWN]: { name: 'question', type: 'FontAwesome' as const },
    };
    return icons[activity];
  };

  const renderRouteItem = ({ item }: { item: SavedRoute }) => {
    const predominantActivity = getPredominantActivity(item);
    const icon = getActivityIcon(predominantActivity);
    const IconComponent = icon.type === 'FontAwesome' ? FontAwesome : MaterialCommunityIcons;

    return (
      <View style={styles.routeCard}>
        <View style={styles.routeHeader}>
          <IconComponent name={icon.name as any} size={40} color="powderblue" style={{ marginRight: 12 }} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeName}>{item.name}</Text>
            <Text style={styles.routeDate}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {(item.stats.totalDistance / 1000).toFixed(2)} km
            </Text>
            <Text style={styles.statLabel}>Distancia</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatDuration(item.stats.duration)}</Text>
            <Text style={styles.statLabel}>Duración</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {Math.round(item.stats.caloriesBurned || 0)}
            </Text>
            <Text style={styles.statLabel}>Calorías</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.mapButton]}
            onPress={() => handleViewMap(item)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="map" size={16} color="white" style={{ marginRight: 4 }} />
              <Text style={styles.actionButtonText}>Ver Mapa</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <MaterialCommunityIcons name="delete" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {item.description && (
          <Text style={styles.routeDescription}>{item.description}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Rutas</Text>
        <Text style={styles.headerSubtitle}>{routes.length} rutas guardadas</Text>
      </View>

      {routes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="map-marker-off" size={80} color="lightgray" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyText}>No hay rutas guardadas</Text>
          <Text style={styles.emptySubtext}>
            Completa una sesión y guárdala para verla aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={routes}
          renderItem={renderRouteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Modal de mapa */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedRoute?.name || 'Mapa de Ruta'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMapModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {mapHTML && (
            <WebView
              style={styles.webview}
              source={{ html: mapHTML }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          )}

          {selectedRoute && (
            <View style={styles.mapStats}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name="map-marker" size={16} color="powderblue" style={{ marginRight: 4 }} />
                <Text style={styles.mapStatsText}>
                  {(selectedRoute.stats.totalDistance / 1000).toFixed(2)} km
                </Text>
                <Text style={styles.mapStatsText}> • </Text>
                <MaterialCommunityIcons name="timer" size={16} color="powderblue" style={{ marginRight: 4 }} />
                <Text style={styles.mapStatsText}>
                  {formatDuration(selectedRoute.stats.duration)}
                </Text>
                <Text style={styles.mapStatsText}> • </Text>
                <MaterialCommunityIcons name="fire" size={16} color="lightorange" style={{ marginRight: 4 }} />
                <Text style={styles.mapStatsText}>
                  {Math.round(selectedRoute.stats.caloriesBurned || 0)} kcal
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  routeDate: {
    fontSize: 13,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  mapButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    flex: 0,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  routeDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
  mapStats: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  mapStatsText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
