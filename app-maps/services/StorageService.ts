/**
 * StorageService.ts
 * Servicio para almacenar y recuperar datos usando AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ActivityLog,
    ActivityType,
    SavedRoute,
    SessionStats,
} from '../models/ActivityModel';

const KEYS = {
  ACTIVITY_LOGS: '@activity_logs_',
  SESSION_STATS: '@session_stats_',
  SAVED_ROUTES: '@saved_routes',
  TOTAL_STATS: '@total_stats',
};

interface TotalStats {
  totalDistance: number;
  totalDuration: number;
  totalSessions: number;
  totalCalories: number;
  activityBreakdown: {
    [key in ActivityType]: number;
  };
}

export class StorageService {
  /**
   * Guardar logs de actividad de una sesión
   */
  async saveActivityLogs(sessionId: string, logs: ActivityLog[]): Promise<void> {
    try {
      const key = `${KEYS.ACTIVITY_LOGS}${sessionId}`;
      await AsyncStorage.setItem(key, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving activity logs:', error);
      throw error;
    }
  }

  /**
   * Leer logs de actividad de una sesión
   */
  async getActivityLogs(sessionId: string): Promise<ActivityLog[]> {
    try {
      const key = `${KEYS.ACTIVITY_LOGS}${sessionId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting activity logs:', error);
      return [];
    }
  }

  /**
   * Guardar estadísticas de sesión
   */
  async saveSessionStats(stats: SessionStats): Promise<void> {
    try {
      const key = `${KEYS.SESSION_STATS}${stats.sessionId}`;
      await AsyncStorage.setItem(key, JSON.stringify(stats));
      await this.updateTotalStats(stats);
    } catch (error) {
      console.error('Error saving session stats:', error);
      throw error;
    }
  }

  /**
   * Leer estadísticas de sesión
   */
  async getSessionStats(sessionId: string): Promise<SessionStats | null> {
    try {
      const key = `${KEYS.SESSION_STATS}${sessionId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting session stats:', error);
      return null;
    }
  }

  /**
   * Guardar ruta completa
   */
  async saveRoute(route: SavedRoute): Promise<void> {
    try {
      // Guardar logs y stats
      await this.saveActivityLogs(route.sessionId, route.activities);
      await this.saveSessionStats(route.stats);

      // Agregar a lista de rutas guardadas
      const routes = await this.getSavedRoutes();
      routes.push(route);
      await AsyncStorage.setItem(KEYS.SAVED_ROUTES, JSON.stringify(routes));
    } catch (error) {
      console.error('Error saving route:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las rutas guardadas
   */
  async getSavedRoutes(): Promise<SavedRoute[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SAVED_ROUTES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting saved routes:', error);
      return [];
    }
  }

  /**
   * Obtener una ruta específica
   */
  async getRoute(routeId: string): Promise<SavedRoute | null> {
    try {
      const routes = await this.getSavedRoutes();
      return routes.find((r) => r.id === routeId) || null;
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  /**
   * Eliminar una ruta
   */
  async deleteRoute(routeId: string): Promise<void> {
    try {
      const routes = await this.getSavedRoutes();
      const route = routes.find((r) => r.id === routeId);
      if (!route) return;

      // Eliminar logs y stats
      await AsyncStorage.removeItem(`${KEYS.ACTIVITY_LOGS}${route.sessionId}`);
      await AsyncStorage.removeItem(`${KEYS.SESSION_STATS}${route.sessionId}`);

      // Eliminar de lista de rutas
      const updatedRoutes = routes.filter((r) => r.id !== routeId);
      await AsyncStorage.setItem(KEYS.SAVED_ROUTES, JSON.stringify(updatedRoutes));
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas totales
   */
  async getTotalStats(): Promise<TotalStats> {
    try {
      const data = await AsyncStorage.getItem(KEYS.TOTAL_STATS);
      if (data) {
        return JSON.parse(data);
      }

      // Retornar estadísticas iniciales
      return {
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
      };
    } catch (error) {
      console.error('Error getting total stats:', error);
      return {
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
      };
    }
  }

  /**
   * Actualizar estadísticas totales
   */
  private async updateTotalStats(sessionStats: SessionStats): Promise<void> {
    try {
      const totalStats = await this.getTotalStats();

      totalStats.totalDistance += sessionStats.totalDistance;
      totalStats.totalDuration += sessionStats.duration;
      totalStats.totalSessions += 1;
      totalStats.totalCalories += sessionStats.caloriesBurned || 0;

      // Actualizar breakdown de actividades
      Object.keys(sessionStats.activityBreakdown).forEach((activity) => {
        const activityType = activity as ActivityType;
        totalStats.activityBreakdown[activityType] +=
          sessionStats.activityBreakdown[activityType];
      });

      await AsyncStorage.setItem(KEYS.TOTAL_STATS, JSON.stringify(totalStats));
    } catch (error) {
      console.error('Error updating total stats:', error);
    }
  }

  /**
   * Limpiar todos los datos
   */
  async clearAllData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(
        (key) =>
          key.startsWith('@activity_') ||
          key.startsWith('@session_') ||
          key.startsWith('@saved_') ||
          key.startsWith('@total_')
      );
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

export default new StorageService();
