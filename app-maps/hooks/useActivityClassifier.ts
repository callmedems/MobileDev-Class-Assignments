/**
 * useActivityClassifier.ts
 * Hook principal que une GPS + Acelerómetro + Clasificación + Stats
 */

import { Accelerometer } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    AccelerometerData,
    ActivityLog,
    ActivityType,
    LocationData,
    SessionStats,
} from '../models/ActivityModel';
import ActivityClassifierService from '../services/ActivityClassifierService';
import LocationService from '../services/LocationService';
import StorageService from '../services/StorageService';

export const useActivityClassifier = () => {
  // Estado de permisos
  const [hasPermission, setHasPermission] = useState(false);

  // Estado de tracking
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Datos actuales
  const [currentActivity, setCurrentActivity] = useState<ActivityType>(ActivityType.IDLE);
  const [confidence, setConfidence] = useState(0);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [acceleration, setAcceleration] = useState<AccelerometerData | null>(null);

  // Logs y estadísticas
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);

  // Estadísticas reactivas (para UI)
  const [steps, setSteps] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [calories, setCalories] = useState(0);

  // Referencias
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastLocationRef = useRef<LocationData | null>(null);
  const accelerometerSubscription = useRef<any>(null);
  const currentAccelerationRef = useRef<AccelerometerData | null>(null);

  // Estadísticas acumuladas (refs para cálculos)
  const maxSpeedRef = useRef(0);
  const speedSamplesRef = useRef<number[]>([]);
  const activityTimeRef = useRef<{ [key in ActivityType]: number }>({
    [ActivityType.IDLE]: 0,
    [ActivityType.WALKING]: 0,
    [ActivityType.RUNNING]: 0,
    [ActivityType.VEHICLE]: 0,
    [ActivityType.UNKNOWN]: 0,
  });

  /**
   * Solicitar permisos
   */
  const requestPermissions = useCallback(async () => {
    try {
      const locationGranted = await LocationService.requestPermissions();
      const { status } = await Accelerometer.requestPermissionsAsync();
      const motionGranted = status === 'granted';

      const allGranted = locationGranted && motionGranted;
      setHasPermission(allGranted);
      return allGranted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }, []);

  /**
   * Calcular pasos (estimación basada en aceleración)
   */
  const updateSteps = useCallback((magnitude: number) => {
    // Detectar pico de aceleración (paso)
    if (magnitude > 12 && magnitude < 20) {
      setSteps(prev => prev + 1);
    }
  }, []);

  /**
   * Calcular calorías quemadas
   */
  const calculateCalories = useCallback((activity: ActivityType, durationSeconds: number) => {
    const MET_VALUES = {
      [ActivityType.IDLE]: 1.0,
      [ActivityType.WALKING]: 3.5,
      [ActivityType.RUNNING]: 8.0,
      [ActivityType.VEHICLE]: 1.0,
      [ActivityType.UNKNOWN]: 1.5,
    };

    const weightKg = 70; // peso promedio
    const met = MET_VALUES[activity];
    const hours = durationSeconds / 3600;
    return met * weightKg * hours;
  }, []);

  /**
   * Procesar nueva ubicación GPS
   */
  const handleLocationUpdate = useCallback(
    (newLocation: LocationData) => {
      if (!isActive || isPaused) return;

      setLocation(newLocation);

      // Calcular distancia si hay ubicación previa
      if (lastLocationRef.current) {
        const distance = LocationService.calculateDistance(
          lastLocationRef.current.lat,
          lastLocationRef.current.lon,
          newLocation.lat,
          newLocation.lon
        );
        setTotalDistance(prev => prev + distance);
      }

      // Actualizar velocidad máxima
      const speed = newLocation.speed || 0;
      if (speed > maxSpeedRef.current) {
        maxSpeedRef.current = speed;
      }
      speedSamplesRef.current.push(speed);

      // Clasificar actividad
      const accelData = currentAccelerationRef.current;
      if (accelData) {
        const activity = ActivityClassifierService.getActivity(speed, accelData.magnitude);
        const conf = ActivityClassifierService.getConfidence(activity, speed, accelData.magnitude);

        setCurrentActivity(activity);
        setConfidence(conf);

        // Actualizar tiempo de actividad (aprox 1 segundo por update)
        activityTimeRef.current[activity] += 1;

        // Calcular calorías incrementales
        const incrementalCalories = calculateCalories(activity, 1);
        setCalories(prev => prev + incrementalCalories);

        // Crear ActivityLog
        const log: ActivityLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          sessionId: sessionIdRef.current!,
          activityType: activity,
          location: newLocation,
          accelerometer: accelData,
          confidence: conf,
          timestamp: Date.now(),
        };

        setActivityLogs((prev) => [...prev, log]);
      }

      lastLocationRef.current = newLocation;
    },
    [isActive, isPaused, calculateCalories]
  );

  /**
   * Procesar datos del acelerómetro
   */
  const handleAccelerometerUpdate = useCallback(
    (data: { x: number; y: number; z: number }) => {
      const magnitude = ActivityClassifierService.calculateMagnitude(data.x, data.y, data.z);

      const accelData: AccelerometerData = {
        x: data.x,
        y: data.y,
        z: data.z,
        magnitude,
        timestamp: Date.now(),
      };

      setAcceleration(accelData);
      currentAccelerationRef.current = accelData;

      // Actualizar pasos
      updateSteps(magnitude);
    },
    [updateSteps]
  );

  /**
   * Iniciar tracking
   */
  const startTracking = useCallback(async () => {
    try {
      const granted = await requestPermissions();
      if (!granted) {
        throw new Error('Permissions not granted');
      }

      // Resetear datos
      sessionIdRef.current = `session_${Date.now()}`;
      startTimeRef.current = Date.now();
      lastLocationRef.current = null;
      maxSpeedRef.current = 0;
      speedSamplesRef.current = [];
      activityTimeRef.current = {
        [ActivityType.IDLE]: 0,
        [ActivityType.WALKING]: 0,
        [ActivityType.RUNNING]: 0,
        [ActivityType.VEHICLE]: 0,
        [ActivityType.UNKNOWN]: 0,
      };
      setActivityLogs([]);
      setSteps(0);
      setTotalDistance(0);
      setCalories(0);
      ActivityClassifierService.reset();

      // Iniciar GPS
      await LocationService.startTracking(handleLocationUpdate);

      // Iniciar acelerómetro
      Accelerometer.setUpdateInterval(1000);
      accelerometerSubscription.current = Accelerometer.addListener(handleAccelerometerUpdate);

      setIsActive(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error starting tracking:', error);
      throw error;
    }
  }, [requestPermissions, handleLocationUpdate, handleAccelerometerUpdate]);

  /**
   * Detener tracking
   */
  const stopTracking = useCallback(async () => {
    try {
      // Detener GPS y acelerómetro
      LocationService.stopTracking();
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.remove();
      }

      // Calcular estadísticas finales
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTimeRef.current) / 1000);
      const avgSpeed =
        speedSamplesRef.current.length > 0
          ? speedSamplesRef.current.reduce((a, b) => a + b, 0) / speedSamplesRef.current.length
          : 0;

      const stats: SessionStats = {
        sessionId: sessionIdRef.current!,
        startTime: startTimeRef.current,
        endTime,
        totalDistance,
        averageSpeed: avgSpeed,
        maxSpeed: maxSpeedRef.current,
        duration,
        activityBreakdown: activityTimeRef.current,
        caloriesBurned: calories,
      };

      setSessionStats(stats);

      // Guardar en storage
      await StorageService.saveActivityLogs(sessionIdRef.current!, activityLogs);
      await StorageService.saveSessionStats(stats);

      setIsActive(false);
      setIsPaused(false);

      return stats;
    } catch (error) {
      console.error('Error stopping tracking:', error);
      throw error;
    }
  }, [activityLogs]);

  /**
   * Pausar tracking
   */
  const pauseTracking = useCallback(() => {
    setIsPaused(true);
  }, []);

  /**
   * Reanudar tracking
   */
  const resumeTracking = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      LocationService.stopTracking();
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.remove();
      }
    };
  }, []);

  return {
    // Estado
    isActive,
    isPaused,
    hasPermission,
    
    // Datos actuales
    currentActivity,
    confidence,
    location,
    acceleration,
    
    // Datos de sesión
    activityLogs,
    sessionStats,
    steps,
    totalDistance,
    calories,
    
    // Métodos
    startTracking,
    stopTracking,
    pauseTracking,
    resumeTracking,
    requestPermissions,
  };
};
