/**
 * RouteService.ts
 * Servicio para gestionar rutas y generar mapas
 */

import { ActivityLog, SavedRoute, SessionStats } from '../models/ActivityModel';
import StorageService from './StorageService';

export class RouteService {
  /**
   * Guardar ruta completa con logs y estadísticas
   */
  async saveRoute(
    name: string,
    sessionId: string,
    logs: ActivityLog[],
    stats: SessionStats,
    description?: string
  ): Promise<SavedRoute> {
    try {
      const route: SavedRoute = {
        id: `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        description,
        sessionId,
        createdAt: Date.now(),
        stats,
        activities: logs,
      };

      await StorageService.saveRoute(route);
      return route;
    } catch (error) {
      console.error('Error saving route:', error);
      throw error;
    }
  }

  /**
   * Recuperar ruta por ID
   */
  async getRoute(routeId: string): Promise<SavedRoute | null> {
    try {
      return await StorageService.getRoute(routeId);
    } catch (error) {
      console.error('Error getting route:', error);
      return null;
    }
  }

  /**
   * Recuperar todas las rutas
   */
  async getAllRoutes(): Promise<SavedRoute[]> {
    try {
      return await StorageService.getSavedRoutes();
    } catch (error) {
      console.error('Error getting all routes:', error);
      return [];
    }
  }

  /**
   * Eliminar ruta
   */
  async deleteRoute(routeId: string): Promise<void> {
    try {
      await StorageService.deleteRoute(routeId);
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  /**
   * Generar HTML para visualizar mapa con Leaflet
   */
  generateMapHTML(logs: ActivityLog[], centerLat?: number, centerLon?: number): string {
    if (logs.length === 0) {
      return this.generateEmptyMapHTML();
    }

    // Usar primera ubicación como centro si no se especifica
    const center = {
      lat: centerLat || logs[0].location.lat,
      lon: centerLon || logs[0].location.lon,
    };

    // Crear array de coordenadas para la polilínea
    const coordinates = logs
      .map((log) => `[${log.location.lat}, ${log.location.lon}]`)
      .join(',\n        ');

    // Crear marcadores para inicio y fin
    const startMarker = logs[0];
    const endMarker = logs[logs.length - 1];

    // Colores según tipo de actividad
    const getActivityColor = (activityType: string): string => {
      switch (activityType) {
        case 'idle':
          return '#gray';
        case 'walking':
          return '#4CAF50';
        case 'running':
          return '#FF9800';
        case 'vehicle':
          return '#2196F3';
        default:
          return '#9E9E9E';
      }
    };

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activity Route Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Inicializar mapa
        const map = L.map('map').setView([${center.lat}, ${center.lon}], 15);

        // Agregar capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Coordenadas de la ruta
        const coordinates = [
            ${coordinates}
        ];

        // Dibujar polilínea
        const polyline = L.polyline(coordinates, {
            color: '${getActivityColor(logs[logs.length - 1].activityType)}',
            weight: 4,
            opacity: 0.7
        }).addTo(map);

        // Ajustar vista al recorrido
        map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

        // Marcador de inicio (verde)
        L.marker([${startMarker.location.lat}, ${startMarker.location.lon}], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map).bindPopup('<b>Inicio</b>');

        // Marcador de fin (rojo)
        L.marker([${endMarker.location.lat}, ${endMarker.location.lon}], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(map).bindPopup('<b>Fin</b>');
    </script>
</body>
</html>
    `;

    return html;
  }

  /**
   * Generar HTML de mapa vacío
   */
  private generateEmptyMapHTML(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activity Route Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
    </script>
</body>
</html>
    `;
  }
}

export default new RouteService();
