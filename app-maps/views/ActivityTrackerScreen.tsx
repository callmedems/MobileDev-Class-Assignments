import { ActivityIndicator } from '@/components/activity/ActivityIndicator';
import { ActivityLogList } from '@/components/activity/ActivityLogList';
import { SessionStatsCard } from '@/components/activity/SessionStatsCard';
import { useActivityClassifier } from '@/hooks/useActivityClassifier';
import RouteService from '@/services/RouteService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useKeepAwake } from 'expo-keep-awake';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ActivityTrackerScreen() {
  // Mantener pantalla activa durante seguimiento de movimiento
  useKeepAwake();

  const {
    isActive,
    isPaused,
    hasPermission,
    currentActivity,
    confidence,
    location,
    acceleration,
    activityLogs,
    sessionStats,
    steps,
    totalDistance,
    calories,
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    requestPermissions,
  } = useActivityClassifier();

  const [showLogsModal, setShowLogsModal] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(0);

  // Solicitar permisos al montar
  useEffect(() => {
    requestPermissions();
  }, []);

  // Timer para actualizar duración
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setCurrentDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused]);

  // Calcular velocidad promedio
  useEffect(() => {
    if (activityLogs.length > 0) {
      const speeds = activityLogs
        .map((log: any) => log.location.speed || 0)
        .filter((speed: number) => speed > 0);
      
      if (speeds.length > 0) {
        const avg = speeds.reduce((a: number, b: number) => a + b, 0) / speeds.length;
        setAverageSpeed(avg);
      }
    }
  }, [activityLogs]);

  // Manejar inicio
  const handleStart = async () => {
    try {
      setCurrentDuration(0);
      await startTracking();
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar el seguimiento. Verifica los permisos.');
    }
  };

  // Manejar detención
  const handleStop = async () => {
    Alert.alert(
      'Detener Sesión',
      '¿Deseas guardar esta ruta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'No Guardar',
          onPress: async () => {
            await stopTracking();
            setCurrentDuration(0);
          },
        },
        {
          text: 'Guardar',
          onPress: async () => {
            try {
              const stats = await stopTracking();
              
              if (stats && activityLogs.length > 0) {
                const routeName = `Ruta ${new Date().toLocaleDateString('es-MX')} ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`;
                
                await RouteService.saveRoute(
                  routeName,
                  stats.sessionId,
                  activityLogs,
                  stats,
                  `Sesión de ${(stats.duration / 60).toFixed(0)} minutos`
                );

                Alert.alert(
                  '✅ Ruta Guardada',
                  `Distancia: ${(stats.totalDistance / 1000).toFixed(2)} km\nDuración: ${Math.floor(stats.duration / 60)} min\nCalorías: ${Math.round(stats.caloriesBurned || 0)} kcal`,
                  [{ text: 'OK' }]
                );
              }
              
              setCurrentDuration(0);
            } catch (error) {
              Alert.alert('Error', 'No se pudo guardar la ruta.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Verificar permisos
  if (!hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons name="lock-open-outline" style={styles.permissionIcon} color="darkgray" />
          <Text style={styles.permissionTitle}>Permisos Requeridos</Text>
          <Text style={styles.permissionText}>
            Esta app necesita acceso a tu ubicación y sensores de movimiento para funcionar.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
            <Text style={styles.permissionButtonText}>Solicitar Permisos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Actividad Actual</Text>

        {/* Indicador de actividad */}
        <ActivityIndicator
          activityType={currentActivity}
          confidence={confidence}
          location={location}
          acceleration={acceleration}
        />

        {/* Estadísticas de sesión */}
        {isActive && (
          <SessionStatsCard
            duration={currentDuration}
            distance={totalDistance}
            calories={calories}
            steps={steps}
            averageSpeed={averageSpeed}
          />
        )}

        {/* Última ubicación */}
        {location && (
          <View style={styles.locationCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="map-marker" size={20} color="powderblue" style={{ marginRight: 6 }} />
              <Text style={styles.locationTitle}>Ubicación Actual</Text>
            </View>
            <Text style={styles.locationText}>
              Lat: {location.lat.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Lon: {location.lon.toFixed(6)}
            </Text>
            {location.accuracy && (
              <Text style={styles.locationText}>
                Precisión: {location.accuracy.toFixed(0)} m
              </Text>
            )}
          </View>
        )}

        {/* Botón de logs */}
        {activityLogs.length > 0 && (
          <TouchableOpacity
            style={styles.logsButton}
            onPress={() => setShowLogsModal(true)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="clipboard-text" size={20} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.logsButtonText}>
                Ver Historial ({activityLogs.length} puntos)
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Botones de control */}
      <View style={styles.controlsContainer}>
        {!isActive ? (
          <TouchableOpacity style={[styles.button, styles.startButton]} onPress={handleStart}>
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={isPaused ? resumeTracking : pauseTracking}
            >
              <Text style={styles.buttonText}>{isPaused ? 'Reanudar' : 'Pausar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
              <Text style={styles.buttonText}>Detener</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Modal de logs */}
      <Modal
        visible={showLogsModal}
        animationType="slide"
        onRequestClose={() => setShowLogsModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ActivityLogList logs={activityLogs} />
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setShowLogsModal(false)}
          >
            <Text style={styles.closeModalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'darkgray',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  logsButton: {
    backgroundColor: 'powderblue',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 12,
  },
  logsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  startButton: {
    backgroundColor: 'green',
  },
  pauseButton: {
    backgroundColor: 'orange',
  },
  stopButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'darkgray',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: 'powderblue',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  closeModalButton: {
    backgroundColor: 'red',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
  },
  closeModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
