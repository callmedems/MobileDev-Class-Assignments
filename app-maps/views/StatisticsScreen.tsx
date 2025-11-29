import { ActivityType, SavedRoute } from '@/models/ActivityModel';
import RouteService from '@/services/RouteService';
import StorageService from '@/services/StorageService';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function StatisticsScreen() {
  const [totalStats, setTotalStats] = useState({
    totalDistance: 0,
    totalDuration: 0,
    totalSessions: 0,
    totalCalories: 0,
    activityBreakdown: {
      [ActivityType.IDLE]: 0,
      [ActivityType.WALKING]: 0,
      [ActivityType.RUNNING]: 0,
      [ActivityType.VEHICLE]: 0,
      [ActivityType.UNKNOWN]: 0,
    },
  });
  
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SavedRoute | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const stats = await StorageService.getTotalStats();
      setTotalStats(stats);
      
      const savedRoutes = await RouteService.getAllRoutes();
      setRoutes(savedRoutes.sort((a, b) => b.createdAt - a.createdAt));
      
      if (savedRoutes.length > 0) {
        setSelectedRoute(savedRoutes[0]);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  const getActivityTime = (type: ActivityType): string => {
    const seconds = totalStats.activityBreakdown[type];
    return formatDuration(seconds);
  };

  const getActivityIcon = (type: ActivityType) => {
    const icons = {
      [ActivityType.IDLE]: { name: 'bed', type: 'FontAwesome' as const },
      [ActivityType.WALKING]: { name: 'walk', type: 'MaterialCommunityIcons' as const },
      [ActivityType.RUNNING]: { name: 'run', type: 'MaterialCommunityIcons' as const },
      [ActivityType.VEHICLE]: { name: 'car', type: 'FontAwesome' as const },
      [ActivityType.UNKNOWN]: { name: 'question', type: 'FontAwesome' as const },
    };
    return icons[type];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <FontAwesome name="bar-chart" size={32} color="powderblue" style={{ marginBottom: 8 }} />
          <Text style={styles.headerTitle}>Estadísticas y Rutas</Text>
        </View>

        {/* Estadísticas Totales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas Totales</Text>
          
          <View style={styles.statsGrid}>
            {/* Distancia Total */}
            <View style={styles.statCard}>
              <FontAwesome name="map-marker" size={36} color="red" style={styles.iconMargin} />
              <Text style={styles.statValue}>
                {formatDistance(totalStats.totalDistance)}
              </Text>
              <Text style={styles.statLabel}>Distancia Total</Text>
            </View>

            {/* Calorías */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="fire" size={36} color="orange" style={styles.iconMargin} />
              <Text style={styles.statValue}>
                {Math.round(totalStats.totalCalories)}
              </Text>
              <Text style={styles.statLabel}>Calorías</Text>
            </View>

            {/* Duración */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="timer" size={36} color="powderblue" style={styles.iconMargin} />
              <Text style={styles.statValue}>
                {formatDuration(totalStats.totalDuration)}
              </Text>
              <Text style={styles.statLabel}>Tiempo Total</Text>
            </View>

            {/* Sesiones */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="target" size={36} color="green" style={styles.iconMargin} />
              <Text style={styles.statValue}>{totalStats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sesiones</Text>
            </View>

            {/* Pasos estimados */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="shoe-print" size={36} color="purple" style={styles.iconMargin} />
              <Text style={styles.statValue}>
                {Math.round(totalStats.totalDistance * 1.3)}
              </Text>
              <Text style={styles.statLabel}>Pasos</Text>
            </View>

            {/* Velocidad promedio */}
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="speedometer" size={36} color="lightorange" style={styles.iconMargin} />
              <Text style={styles.statValue}>
                {totalStats.totalDuration > 0
                  ? ((totalStats.totalDistance / totalStats.totalDuration) * 3.6).toFixed(1)
                  : '0'}
              </Text>
              <Text style={styles.statLabel}>km/h Promedio</Text>
            </View>
          </View>
        </View>

        {/* desglose por ruta */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <MaterialCommunityIcons name="run" size={24} color="powderblue" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Desglose por Ruta</Text>
          </View>
          
          <View style={styles.activityList}>
            {Object.keys(totalStats.activityBreakdown).map((activity) => {
              const activityType = activity as ActivityType;
              const time = totalStats.activityBreakdown[activityType];
              
              if (time === 0) return null;
              
              const icon = getActivityIcon(activityType);
              const IconComponent = icon.type === 'FontAwesome' ? FontAwesome : MaterialCommunityIcons;
              
              return (
                <View key={activity} style={styles.activityItem}>
                  <IconComponent name={icon.name as any} size={28} color="powderblue" style={styles.activityIconMargin} />
                  <Text style={styles.activityName}>
                    {activityType.charAt(0).toUpperCase() + activityType.slice(1)}
                  </Text>
                  <Text style={styles.activityTime}>
                    {getActivityTime(activityType)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* rutas guardadas */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <MaterialCommunityIcons name="map" size={24} color="powderblue" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Rutas guardadas ({routes.length})</Text>
          </View>
          
          {routes.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="map-marker-off" size={64} color="lightgray" style={styles.iconMargin} />
              <Text style={styles.emptyText}>No hay rutas guardadas</Text>
              <Text style={styles.emptySubtext}>
                Completa una sesión de tracking para ver tus rutas aquí
              </Text>
            </View>
          ) : (
            <>
              {/* seleccionar ruta */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {routes.map((route) => (
                  <TouchableOpacity
                    key={route.id}
                    style={[
                      styles.routeChip,
                      selectedRoute?.id === route.id && styles.routeChipSelected,
                    ]}
                    onPress={() => setSelectedRoute(route)}
                  >
                    <Text style={styles.routeChipText}>{route.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* sats de ruta seleccionada */}
              {selectedRoute && (
                <View style={styles.routeStatsContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <MaterialCommunityIcons name="chart-bar" size={20} color="powderblue" style={{ marginRight: 6 }} />
                    <Text style={styles.routeStatsTitle}>
                      {selectedRoute.name}
                    </Text>
                  </View>
                  
                  <View style={styles.routeStatsGrid}>
                    <View style={styles.routeStat}>
                      <FontAwesome name="map-marker" size={24} color="red" style={styles.smallIconMargin} />
                      <Text style={styles.routeStatValue}>
                        {formatDistance(selectedRoute.stats.totalDistance)}
                      </Text>
                      <Text style={styles.routeStatLabel}>Distancia</Text>
                    </View>

                    <View style={styles.routeStat}>
                      <MaterialCommunityIcons name="timer" size={24} color="powderblue" style={styles.smallIconMargin} />
                      <Text style={styles.routeStatValue}>
                        {formatDuration(selectedRoute.stats.duration)}
                      </Text>
                      <Text style={styles.routeStatLabel}>Tiempo</Text>
                    </View>

                    <View style={styles.routeStat}>
                      <MaterialCommunityIcons name="fire" size={24} color="lightorange" style={styles.smallIconMargin} />
                      <Text style={styles.routeStatValue}>
                        {Math.round(selectedRoute.stats.caloriesBurned || 0)}
                      </Text>
                      <Text style={styles.routeStatLabel}>Calorías</Text>
                    </View>

                    <View style={styles.routeStat}>
                      <MaterialCommunityIcons name="speedometer" size={24} color="lightorange" style={styles.smallIconMargin} />
                      <Text style={styles.routeStatValue}>
                        {(selectedRoute.stats.averageSpeed * 3.6).toFixed(1)}
                      </Text>
                      <Text style={styles.routeStatLabel}>km/h Prom.</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                    <MaterialCommunityIcons name="calendar" size={14} color="darkgray" style={{ marginRight: 6 }} />
                    <Text style={styles.routeDate}>
                      {new Date(selectedRoute.createdAt).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'whitesmoke',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  iconMargin: {
    marginBottom: 8,
  },
  smallIconMargin: {
    marginBottom: 4,
  },
  activityIconMargin: {
    marginRight: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'lightblack',
    textAlign: 'center',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },

  activityName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  activityTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'darkgray',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'lightgray',
    textAlign: 'center',
  },
  routeChip: {
    backgroundColor: 'whitesmoke',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 16,
  },
  routeChipSelected: {
    backgroundColor: 'powderblue',
  },
  routeChipText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },
  routeStatsContainer: {
    marginTop: 8,
  },
  routeStatsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 0,
  },
  routeStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  routeStat: {
    width: '48%',
    backgroundColor: 'whitesmoke',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },

  routeStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
  },
  routeStatLabel: {
    fontSize: 11,
    color: 'black',
  },
  routeDate: {
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
