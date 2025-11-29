
/*Tipos de actividad física detectables*/
export enum ActivityType {
  IDLE = 'idle',
  WALKING = 'walking',
  RUNNING = 'running',
  VEHICLE = 'vehicle',
  UNKNOWN = 'unknown'
}

/*Datos de ubicación GPS*/
export interface LocationData {
  lat: number;
  lon: number;
  speed: number | null; // m/s
  altitude?: number | null;
  accuracy?: number | null;
  timestamp: number;
}

/*Datos del acelerómetro*/
export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  magnitude: number; // √(x² + y² + z²)
  timestamp: number;
}

/*Registro de actividad en un momento específico*/
export interface ActivityLog {
  id: string;
  sessionId: string;
  activityType: ActivityType;
  location: LocationData;
  accelerometer: AccelerometerData;
  confidence: number; // 0-1
  timestamp: number;
}

/*Estadísticas de una sesión de actividad*/
export interface SessionStats {
  sessionId: string;
  startTime: number;
  endTime: number | null;
  totalDistance: number; // metros
  averageSpeed: number; // m/s
  maxSpeed: number; // m/s
  duration: number; // segundos
  activityBreakdown: {
    [key in ActivityType]: number; // tiempo en segundos por actividad
  };
  caloriesBurned?: number;
}

/*Ruta guardada con todos sus datos*/
export interface SavedRoute {
  id: string;
  name: string;
  description?: string;
  sessionId: string;
  createdAt: number;
  stats: SessionStats;
  activities: ActivityLog[];
  thumbnail?: string; // Base64 o URL del mapa
}

/*Configuración del clasificador de actividades*/
export interface ClassifierConfig {
  // Umbrales de acelerómetro (magnitud en m/s²)
  idleThreshold: number;
  walkingThreshold: number;
  runningThreshold: number;
  vehicleThreshold: number;
  
  // Umbrales de velocidad GPS (m/s)
  minWalkingSpeed: number;
  minRunningSpeed: number;
  minVehicleSpeed: number;
  
  // Ventana de tiempo para análisis
  sampleWindowSize: number; // número de muestras
  updateInterval: number; // ms entre actualizaciones
  
  // Precisión mínima GPS
  minGPSAccuracy: number; // metros
}

/*Configuración por defecto del clasificador*/
export const DEFAULT_CLASSIFIER_CONFIG: ClassifierConfig = {
  // Umbrales de acelerómetro (magnitud)
  idleThreshold: 0.5,        // < 0.5 m/s2 → quieto
  walkingThreshold: 2.0,     // 0.5-2.0 m/s2 → caminando
  runningThreshold: 4.0,     // 2.0-4.0 m/s2 → corriendo
  vehicleThreshold: 6.0,     // > 4.0 m/s2 → vehículo
  
  // Umbrales de velocidad GPS
  minWalkingSpeed: 0.5,      // 0.5 m/s = 1.8 km/h
  minRunningSpeed: 2.5,      // 2.5 m/s = 9 km/h
  minVehicleSpeed: 8.0,      // 8 m/s = 28.8 km/h
  
  // Ventana de análisis
  sampleWindowSize: 10,      // últimas 10 muestras
  updateInterval: 1000,      // actualizar cada 1 segundo
  
  // Precisión GPS
  minGPSAccuracy: 50,        // 50 metros
};

/*Estado de una sesión de seguimiento*/
export interface SessionState {
  isActive: boolean;
  isPaused: boolean;
  currentActivity: ActivityType;
  sessionId: string | null;
}

/*Permisos necesarios para la app*/
export interface AppPermissions {
  location: boolean;
  motion: boolean;
}
