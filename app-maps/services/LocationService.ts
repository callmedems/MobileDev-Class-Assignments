/**
 * LocationService.ts
 * Servicio para gestionar GPS y ubicación
 */

import * as Location from 'expo-location';
import { LocationData } from '../models/ActivityModel';

export class LocationService {
  private subscription: Location.LocationSubscription | null = null;

  /**
   * Solicitar permisos de ubicación
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  /**
   * Iniciar seguimiento de ubicación
   */
  async startTracking(
    callback: (location: LocationData) => void,
    errorCallback?: (error: Error) => void
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission not granted');
      }

      this.subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // actualizar cada 1 segundo
          distanceInterval: 1, // actualizar cada 1 metro
        },
        (location) => {
          const locationData: LocationData = {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
            speed: location.coords.speed,
            altitude: location.coords.altitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          };
          callback(locationData);
        }
      );

      return true;
    } catch (error) {
      console.error('Error starting location tracking:', error);
      if (errorCallback) {
        errorCallback(error as Error);
      }
      return false;
    }
  }

  /**
   * Detener seguimiento de ubicación
   */
  stopTracking(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
  }

  /**
   * Calcular distancia entre dos puntos usando fórmula de Haversine
   * @returns distancia en metros
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // distancia en metros
  }

  /**
   * Obtener ubicación actual una sola vez
   */
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        speed: location.coords.speed,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }
}

export default new LocationService();
