import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AccelerometerData, ActivityType, LocationData } from '../../models/ActivityModel';

interface ActivityIndicatorProps {
  activityType: ActivityType;
  confidence: number;
  location: LocationData | null;
  acceleration: AccelerometerData | null;
}

const ACTIVITY_ICONS: { [key in ActivityType]: { name: string; type: 'FontAwesome' | 'MaterialCommunityIcons' } } = {
  [ActivityType.IDLE]: { name: 'bed', type: 'FontAwesome' },
  [ActivityType.WALKING]: { name: 'walk', type: 'MaterialCommunityIcons' },
  [ActivityType.RUNNING]: { name: 'run', type: 'MaterialCommunityIcons' },
  [ActivityType.VEHICLE]: { name: 'car', type: 'FontAwesome' },
  [ActivityType.UNKNOWN]: { name: 'question', type: 'FontAwesome' },
};

const ACTIVITY_NAMES: { [key in ActivityType]: string } = {
  [ActivityType.IDLE]: 'Quieto',
  [ActivityType.WALKING]: 'Caminando',
  [ActivityType.RUNNING]: 'Corriendo',
  [ActivityType.VEHICLE]: 'En Vehículo',
  [ActivityType.UNKNOWN]: 'Desconocido',
};

const ACTIVITY_COLORS: { [key in ActivityType]: string } = {
  [ActivityType.IDLE]: 'gray',
  [ActivityType.WALKING]: 'green',
  [ActivityType.RUNNING]: 'lightorange',
  [ActivityType.VEHICLE]: 'blue',
  [ActivityType.UNKNOWN]: 'darkgray',
};

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = ({
  activityType,
  confidence,
  location,
  acceleration,
}) => {
  const speed = location?.speed ? (location.speed * 3.6).toFixed(1) : '0.0'; // m/s a km/h
  const accelMag = acceleration?.magnitude.toFixed(2) || '0.00';
  const confidencePercent = (confidence * 100).toFixed(0);
  
  const icon = ACTIVITY_ICONS[activityType];
  const IconComponent = icon.type === 'FontAwesome' ? FontAwesome : MaterialCommunityIcons;

  return (
    <View style={styles.container}>
      <IconComponent 
        name={icon.name as any} 
        size={80} 
        color={ACTIVITY_COLORS[activityType]} 
        style={{ marginBottom: 12 }}
      />

      <Text style={[styles.activityName, { color: ACTIVITY_COLORS[activityType] }]}>
        {ACTIVITY_NAMES[activityType]}
      </Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Velocidad</Text>
          <Text style={styles.metricValue}>{speed} km/h</Text>
        </View>

        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Aceleración</Text>
          <Text style={styles.metricValue}>{accelMag} m/s²</Text>
        </View>
      </View>


      <View style={styles.confidenceContainer}>
        <Text style={styles.confidenceLabel}>Confianza: {confidencePercent}%</Text>
        <View style={styles.confidenceBarBackground}>
          <View
            style={[
              styles.confidenceBarFill,
              {
                width: `${confidence * 100}%`,
                backgroundColor: ACTIVITY_COLORS[activityType],
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 16,
  },
  activityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  metric: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  confidenceContainer: {
    width: '100%',
    marginTop: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  confidenceBarBackground: {
    height: 8,
    backgroundColor: 'lightgray',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
