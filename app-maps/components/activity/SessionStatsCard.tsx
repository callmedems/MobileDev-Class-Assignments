/**
 * SessionStatsCard.tsx
 * Componente para mostrar estadísticas de la sesión actual
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SessionStatsCardProps {
  duration: number; // segundos
  distance: number; // metros
  calories: number;
  steps: number;
  averageSpeed: number; // m/s
}

export const SessionStatsCard: React.FC<SessionStatsCardProps> = ({
  duration,
  distance,
  calories,
  steps,
  averageSpeed,
}) => {
  // Formatear duración (HH:MM:SS)
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatear distancia (km o m)
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters.toFixed(0)} m`;
  };

  // Formatear velocidad (km/h)
  const formatSpeed = (metersPerSecond: number): string => {
    const kmh = metersPerSecond * 3.6;
    return `${kmh.toFixed(1)} km/h`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estadísticas de Sesión</Text>

      <View style={styles.statsGrid}>
        {/* Duración */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="timer" size={32} color="#2196F3" style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}>{formatDuration(duration)}</Text>
          <Text style={styles.statLabel}>Duración</Text>
        </View>

        {/* Distancia */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="map-marker" size={32} color="#FF5252" style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}>{formatDistance(distance)}</Text>
          <Text style={styles.statLabel}>Distancia</Text>
        </View>

        {/* Calorías */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="fire" size={32} color="#FF6F00" style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}>{Math.round(calories)}</Text>
          <Text style={styles.statLabel}>Calorías</Text>
        </View>

        {/* Pasos */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="shoe-print" size={32} color="#9C27B0" style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}>{steps}</Text>
          <Text style={styles.statLabel}>Pasos</Text>
        </View>

        {/* Velocidad promedio */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="speedometer" size={32} color="#FF9800" style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}>{formatSpeed(averageSpeed)}</Text>
          <Text style={styles.statLabel}>Vel. Promedio</Text>
        </View>

        {/* Espacio vacío para mantener el grid */}
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="chart-box" size={32} color="#4CAF50" style={{ marginBottom: 8 }} />
          <Text style={styles.statValue}></Text>
          <Text style={styles.statLabel}></Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginVertical: 12,
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
    textAlign: 'center',
  },
});
