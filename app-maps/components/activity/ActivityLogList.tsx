/**
 * ActivityLogList.tsx
 * Componente para mostrar lista de logs de actividad
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ActivityLog, ActivityType } from '../../models/ActivityModel';

interface ActivityLogListProps {
  logs: ActivityLog[];
}

const ACTIVITY_NAMES: { [key in ActivityType]: string } = {
  [ActivityType.IDLE]: 'Quieto',
  [ActivityType.WALKING]: 'Caminando',
  [ActivityType.RUNNING]: 'Corriendo',
  [ActivityType.VEHICLE]: 'En Vehículo',
  [ActivityType.UNKNOWN]: 'Desconocido',
};

const ACTIVITY_COLORS: { [key in ActivityType]: string } = {
  [ActivityType.IDLE]: '#9E9E9E',
  [ActivityType.WALKING]: '#4CAF50',
  [ActivityType.RUNNING]: '#FF9800',
  [ActivityType.VEHICLE]: '#2196F3',
  [ActivityType.UNKNOWN]: '#757575',
};

export const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs }) => {
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatCoordinates = (lat: number, lon: number): string => {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  };

  const renderLogItem = ({ item, index }: { item: ActivityLog; index: number }) => (
    <View style={styles.logItem}>
      <View style={styles.logHeader}>
        <View style={styles.logNumber}>
          <Text style={styles.logNumberText}>{logs.length - index}</Text>
        </View>
        <View style={styles.logHeaderInfo}>
          <Text style={[styles.activityName, { color: ACTIVITY_COLORS[item.activityType] }]}>
            {ACTIVITY_NAMES[item.activityType]}
          </Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{(item.confidence * 100).toFixed(0)}%</Text>
        </View>
      </View>

      <View style={styles.logDetails}>
        <View style={styles.detailRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name="map-marker" size={14} color="#666" style={{ marginRight: 4 }} />
            <Text style={styles.detailLabel}>Ubicación:</Text>
          </View>
          <Text style={styles.detailValue}>
            {formatCoordinates(item.location.lat, item.location.lon)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name="speedometer" size={14} color="#666" style={{ marginRight: 4 }} />
            <Text style={styles.detailLabel}>Velocidad:</Text>
          </View>
          <Text style={styles.detailValue}>
            {item.location.speed
              ? `${(item.location.speed * 3.6).toFixed(1)} km/h`
              : 'N/A'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <MaterialCommunityIcons name="chart-line" size={14} color="#666" style={{ marginRight: 4 }} />
            <Text style={styles.detailLabel}>Aceleración:</Text>
          </View>
          <Text style={styles.detailValue}>
            {item.accelerometer.magnitude.toFixed(2)} m/s²
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Actividad ({logs.length} puntos)</Text>
      <FlatList
        data={[...logs].reverse()} // Mostrar más reciente primero
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  listContent: {
    padding: 16,
  },
  logItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logHeaderInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  confidenceBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  logDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});
