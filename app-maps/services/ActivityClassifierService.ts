/**
 * ActivityClassifierService.ts
 * Servicio para clasificar actividad física usando GPS + Acelerómetro
 */

import {
    ActivityType,
    ClassifierConfig,
    DEFAULT_CLASSIFIER_CONFIG
} from '../models/ActivityModel';

export class ActivityClassifierService {
  private config: ClassifierConfig;
  private speedHistory: number[] = [];
  private accelerationHistory: number[] = [];

  constructor(config: ClassifierConfig = DEFAULT_CLASSIFIER_CONFIG) {
    this.config = config;
  }

  /**
   * Calcular magnitud del vector de aceleración
   */
  calculateMagnitude(x: number, y: number, z: number): number {
    return Math.sqrt(x * x + y * y + z * z);
  }

  /**
   * Agregar muestra y calcular promedio móvil de velocidad
   */
  addSpeedSample(speed: number): number {
    this.speedHistory.push(speed);
    if (this.speedHistory.length > this.config.sampleWindowSize) {
      this.speedHistory.shift();
    }
    return this.getAverageSpeed();
  }

  /**
   * Agregar muestra y calcular promedio móvil de aceleración
   */
  addAccelerationSample(magnitude: number): number {
    this.accelerationHistory.push(magnitude);
    if (this.accelerationHistory.length > this.config.sampleWindowSize) {
      this.accelerationHistory.shift();
    }
    return this.getAverageAcceleration();
  }

  /**
   * Obtener velocidad promedio
   */
  private getAverageSpeed(): number {
    if (this.speedHistory.length === 0) return 0;
    const sum = this.speedHistory.reduce((a, b) => a + b, 0);
    return sum / this.speedHistory.length;
  }

  /**
   * Obtener aceleración promedio
   */
  private getAverageAcceleration(): number {
    if (this.accelerationHistory.length === 0) return 0;
    const sum = this.accelerationHistory.reduce((a, b) => a + b, 0);
    return sum / this.accelerationHistory.length;
  }

  /**
   * Clasificar actividad basándose en velocidad y aceleración
   */
  getActivity(speed: number | null, accelerationMagnitude: number): ActivityType {
    const avgSpeed = speed !== null ? this.addSpeedSample(speed) : 0;
    const avgAcceleration = this.addAccelerationSample(accelerationMagnitude);

    // Reglas de clasificación combinando GPS y acelerómetro

    // IDLE: poca aceleración y velocidad baja
    if (
      avgAcceleration < this.config.idleThreshold &&
      avgSpeed < this.config.minWalkingSpeed
    ) {
      return ActivityType.IDLE;
    }

    // VEHICLE: velocidad alta (prioridad máxima)
    if (avgSpeed >= this.config.minVehicleSpeed) {
      return ActivityType.VEHICLE;
    }

    // RUNNING: velocidad alta de running y aceleración alta
    if (
      avgSpeed >= this.config.minRunningSpeed &&
      avgAcceleration >= this.config.walkingThreshold
    ) {
      return ActivityType.RUNNING;
    }

    // WALKING: velocidad moderada y aceleración moderada
    if (
      avgSpeed >= this.config.minWalkingSpeed &&
      avgSpeed < this.config.minRunningSpeed &&
      avgAcceleration >= this.config.idleThreshold
    ) {
      return ActivityType.WALKING;
    }

    // RUNNING basado solo en aceleración (si GPS no es confiable)
    if (avgAcceleration >= this.config.runningThreshold) {
      return ActivityType.RUNNING;
    }

    // WALKING basado solo en aceleración
    if (avgAcceleration >= this.config.walkingThreshold) {
      return ActivityType.WALKING;
    }

    // Default
    return ActivityType.UNKNOWN;
  }

  /**
   * Calcular nivel de confianza de la clasificación (0-1)
   */
  getConfidence(
    activity: ActivityType,
    speed: number | null,
    accelerationMagnitude: number
  ): number {
    const avgSpeed = speed !== null ? speed : 0;
    const avgAcceleration = accelerationMagnitude;

    let confidence = 0.5; // confianza base

    switch (activity) {
      case ActivityType.IDLE:
        if (avgSpeed < this.config.minWalkingSpeed && avgAcceleration < this.config.idleThreshold) {
          confidence = 0.9;
        }
        break;

      case ActivityType.WALKING:
        if (
          avgSpeed >= this.config.minWalkingSpeed &&
          avgSpeed < this.config.minRunningSpeed &&
          avgAcceleration >= this.config.walkingThreshold
        ) {
          confidence = 0.85;
        } else {
          confidence = 0.6;
        }
        break;

      case ActivityType.RUNNING:
        if (
          avgSpeed >= this.config.minRunningSpeed &&
          avgAcceleration >= this.config.runningThreshold
        ) {
          confidence = 0.9;
        } else {
          confidence = 0.7;
        }
        break;

      case ActivityType.VEHICLE:
        if (avgSpeed >= this.config.minVehicleSpeed) {
          confidence = 0.95;
        }
        break;

      case ActivityType.UNKNOWN:
        confidence = 0.3;
        break;
    }

    // Ajustar confianza según cantidad de muestras
    const sampleFactor = Math.min(
      this.speedHistory.length / this.config.sampleWindowSize,
      1
    );
    confidence *= 0.5 + sampleFactor * 0.5;

    return Math.min(Math.max(confidence, 0), 1);
  }

  /**
   * Resetear historial
   */
  reset(): void {
    this.speedHistory = [];
    this.accelerationHistory = [];
  }

  /**
   * Actualizar configuración
   */
  updateConfig(config: Partial<ClassifierConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export default new ActivityClassifierService();
