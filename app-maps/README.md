# Activity Tracker App

App de detección de actividad física usando GPS + Acelerómetro con arquitectura MVC.

## 🚀 Características

- ✅ Detección de actividad física (Quieto, Caminando, Corriendo, Vehículo)
- ✅ Tracking en tiempo real con GPS + Acelerómetro
- ✅ Cálculo de distancia, velocidad, pasos y calorías
- ✅ Visualización de rutas en mapa con Leaflet
- ✅ Almacenamiento local de rutas
- ✅ Arquitectura MVC completa
- ✅ Interfaz intuitiva con métricas en tiempo real

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar librerías específicas

```bash
npx expo install expo-location expo-sensors @react-native-async-storage/async-storage react-native-webview@13.15.0
```

### 3. Ejecutar la aplicación

```bash
npx expo start
```

Luego escanea el código QR con Expo Go (Android/iOS) o presiona:
- `a` para Android
- `i` para iOS
- `w` para web

## 📁 Estructura del Proyecto (MVC)

```
app-maps/
├── models/
│   └── ActivityModel.ts          # Tipos, interfaces y enums
├── services/
│   ├── LocationService.ts        # Gestión de GPS
│   ├── ActivityClassifierService.ts  # Clasificación de actividad
│   ├── StorageService.ts         # Almacenamiento AsyncStorage
│   └── RouteService.ts           # Gestión de rutas y mapas
├── controllers/
│   └── (lógica de negocio si es necesaria)
├── hooks/
│   └── useActivityClassifier.ts  # Hook principal (GPS + Acelerómetro + Stats)
├── components/
│   └── activity/
│       ├── ActivityIndicator.tsx      # Indicador de actividad actual
│       ├── SessionStatsCard.tsx       # Estadísticas de sesión
│       └── ActivityLogList.tsx        # Lista de logs
├── views/
│   ├── ActivityTrackerScreen.tsx # Pantalla principal de tracking
│   └── SavedRoutesScreen.tsx     # Pantalla de rutas guardadas
└── app/
    └── (tabs)/
        ├── index.tsx             # Tab 1: Tracking
        └── two.tsx               # Tab 2: Rutas
```

## 🎯 Funcionalidades Principales

### 1. Tracking de Actividad
- Inicia el tracking con el botón "Iniciar"
- Visualiza en tiempo real:
  - Tipo de actividad actual (emoji + nombre)
  - Velocidad y aceleración
  - Confianza de la clasificación
  - Estadísticas: duración, distancia, calorías, pasos
- Pausa/reanuda el tracking
- Detén y guarda la ruta

### 2. Clasificación de Actividad
El algoritmo clasifica actividad usando:
- **GPS**: velocidad en m/s
- **Acelerómetro**: magnitud de aceleración
- **Reglas**:
  - Quieto: aceleración < 0.5 m/s², velocidad < 0.5 m/s
  - Caminando: aceleración 0.5-2.0 m/s², velocidad 0.5-2.5 m/s
  - Corriendo: aceleración 2.0-4.0 m/s², velocidad 2.5-8.0 m/s
  - Vehículo: velocidad > 8.0 m/s

### 3. Almacenamiento
- Logs de actividad por sesión
- Estadísticas de sesión
- Rutas completas con mapa
- Estadísticas totales acumuladas

### 4. Visualización de Mapas
- Mapa interactivo con Leaflet
- Polilínea de la ruta
- Marcadores de inicio (verde) y fin (rojo)
- Zoom automático al recorrido

## 📊 Métricas Calculadas

- **Distancia**: Fórmula de Haversine entre coordenadas GPS
- **Velocidad**: Promedio de velocidades GPS
- **Pasos**: Detección de picos en acelerómetro (12-20 m/s²)
- **Calorías**: MET (Metabolic Equivalent) × peso × tiempo
  - Quieto: 1.0 MET
  - Caminando: 3.5 MET
  - Corriendo: 8.0 MET
  - Vehículo: 1.0 MET

## 🔐 Permisos Requeridos

### iOS (app.json)
```json
"infoPlist": {
  "NSLocationWhenInUseUsageDescription": "This app needs access to your location...",
  "NSLocationAlwaysAndWhenInUseUsageDescription": "This app needs access to your location...",
  "NSMotionUsageDescription": "This app uses motion sensors..."
}
```

### Android (app.json)
```json
"permissions": [
  "ACCESS_COARSE_LOCATION",
  "ACCESS_FINE_LOCATION",
  "FOREGROUND_SERVICE",
  "FOREGROUND_SERVICE_LOCATION",
  "ACTIVITY_RECOGNITION"
]
```

## 🛠️ Tecnologías Utilizadas

- **Expo SDK**: Framework para React Native
- **expo-location**: Tracking GPS
- **expo-sensors**: Acelerómetro
- **AsyncStorage**: Almacenamiento local
- **react-native-webview**: Visualización de mapas
- **Leaflet**: Mapas interactivos (HTML/JS)
- **TypeScript**: Tipado estático

## 📱 Uso de la App

1. **Primera vez**: Otorga permisos de ubicación y sensores
2. **Iniciar tracking**: Presiona "▶️ Iniciar"
3. **Ver métricas**: Observa actividad, velocidad, distancia en tiempo real
4. **Ver logs**: Presiona "📋 Ver Historial"
5. **Detener**: Presiona "⏹️ Detener" y guarda la ruta
6. **Ver rutas**: Ve a la pestaña "Rutas"
7. **Ver mapa**: Presiona "🗺️ Ver Mapa" en cualquier ruta

## 🎨 UI/UX

- Diseño limpio y moderno
- Emojis para actividades
- Colores según tipo de actividad
- Barra de confianza visual
- Cards con sombras (Material Design)
- Navegación por tabs
- Modales para detalles

## 🐛 Troubleshooting

### GPS no funciona
- Verifica que los permisos estén otorgados
- Asegúrate de estar en exterior (mejor señal)
- Espera unos segundos para fix GPS

### Acelerómetro no detecta
- Verifica permisos de movimiento
- Prueba en dispositivo físico (no emulador)

### Mapas no se ven
- Requiere conexión a internet para tiles de OpenStreetMap
- WebView debe tener JavaScript habilitado

## 📝 Rúbrica del Proyecto

### GPS (20 pts) ✅
- Configuración correcta del sensor GPS
- Actualizaciones de posición en tiempo real

### Mapa (20 pts) ✅
- Muestra posición del dispositivo
- Visualización de rutas con Leaflet

### Funciones (60 pts) ✅
- Integración completa de funcionalidad
- Arquitectura MVC aplicada
- Componentes optimizados (FlatList)
- Manejo de excepciones
- Persistencia en AsyncStorage
- Logging y métricas

## 👨‍💻 Desarrollo

Desarrollado con arquitectura MVC para cumplir con:
- Separación de responsabilidades
- Código mantenible y escalable
- Best practices de React Native
- TypeScript para type safety

## 📄 Licencia

MIT License
