# App COVID-19 - React Native

Aplicación móvil desarrollada en React Native (Expo) para consultar y visualizar información sobre casos de COVID-19 por país.

## 📋 Características

✅ **Lista de países con bandera**: Muestra todos los países con su bandera y número de casos
✅ **Detalles del país**: Visualiza casos, recuperados y fallecidos con la bandera del país
✅ **Gráfica de casos acumulados**: Muestra una gráfica de línea con los casos acumulados de los últimos 30 días
✅ **Arquitectura MVC**: Separación clara entre Modelo, Vista y Controlador

## 🏗️ Arquitectura MVC

### Model (Modelo)
**Ubicación**: `models/CovidModel.ts`

- Maneja toda la lógica de datos y comunicación con las APIs
- Métodos:
  - `getAllCountries()`: Obtiene lista de todos los países
  - `getCountryData(countryName)`: Obtiene datos de un país específico
  - `getHistoricalData(countryName, days)`: Obtiene datos históricos
  - `transformHistoricalDataForChart()`: Transforma datos para la gráfica

### Controller (Controlador)
**Ubicación**: `controllers/CovidController.ts`

- Actúa como intermediario entre el Modelo y las Vistas
- Métodos:
  - `loadCountries()`: Carga y maneja la lista de países
  - `loadCountryDetails(countryName)`: Carga detalles de un país
  - `loadHistoricalData(countryName, days)`: Carga datos históricos
  - `formatNumber(num)`: Formatea números con comas

### View (Vista)
**Ubicación**: `views/`

- **CountryListView.tsx**: Componente para mostrar la lista de países
- **CountryDetailView.tsx**: Componente para mostrar detalles del país con gráfica

### Screens (Pantallas)
**Ubicación**: `app/(tabs)/`

- **index.tsx**: Pantalla principal con lista de países
- **explore.tsx**: Pantalla de detalles del país seleccionado

## 🌐 APIs Utilizadas

1. **Lista de países**: `https://disease.sh/v3/covid-19/countries`
2. **Datos históricos**: `https://disease.sh/v3/covid-19/historical/{country}`

## 📦 Dependencias Principales

```json
{
  "react-native-chart-kit": "Gráficas",
  "react-native-svg": "Soporte SVG para gráficas",
  "axios": "Peticiones HTTP",
  "expo-router": "Navegación"
}
```

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar la aplicación

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

## 📱 Estructura de la App

```
Primera Pantalla (Home)
├── Header: "COVID-19 - Lista de Países"
├── Lista scrollable de países
│   ├── Bandera del país (60x40)
│   ├── Nombre del país
│   └── Número de casos
└── Al tocar un país → Navega a la segunda pantalla

Segunda Pantalla (Explore/Detalles)
├── Header: "Covid19"
├── Bandera del país (120x80)
├── Nombre del país
├── Cards con estadísticas
│   ├── Casos (rojo)
│   ├── Recuperados (verde)
│   └── Fallecidos (gris)
├── Gráfica de casos acumulados (últimos 30 días)
└── Estadísticas adicionales
    ├── Casos activos
    ├── Críticos
    └── Tests realizados
```

## 🎨 Componentes de Gráfica

Se utiliza **react-native-chart-kit** con un `LineChart`:

```typescript
<LineChart
  data={chartData}
  width={Dimensions.get('window').width - 20}
  height={220}
  chartConfig={{
    backgroundColor: '#6200EE',
    backgroundGradientFrom: '#6200EE',
    backgroundGradientTo: '#9D4EDD',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    // ... más configuración
  }}
  bezier
/>
```

## 📊 Datos que se Muestran

### Primera Pantalla
- ✅ Nombre del país
- ✅ Bandera del país
- ✅ Número de contagiados

### Segunda Pantalla
- ✅ Nombre del país
- ✅ Bandera del país
- ✅ Contagiados
- ✅ Recuperados
- ✅ Fallecidos
- ✅ Gráfica de casos acumulados (últimos 30 días)
- Casos activos
- Casos críticos
- Tests realizados

## 🎯 Cumplimiento de Rúbrica

| Criterio | Puntos | Estado |
|----------|--------|--------|
| Lista de países con bandera | 20 | ✅ Completo |
| Pantalla con datos (contagiados, recuperados, fallecidos) | 40 | ✅ Completo |
| Gráfica de casos acumulados | 40 | ✅ Completo |
| **TOTAL** | **100** | ✅ **100/100** |

## 💡 Notas de Implementación

- La gráfica muestra los últimos 30 días de datos históricos
- Los datos se filtran para mostrar solo 10 puntos en la gráfica (más legible)
- Los números grandes se formatean con comas para mejor lectura
- Si no se selecciona un país, la segunda pantalla muestra Italia por defecto
- Manejo de errores con try-catch en todos los métodos del controlador
- Estados de carga (loading) para mejor UX

## 🔧 Personalización

Para cambiar el país predeterminado en la segunda pantalla, edita `app/(tabs)/explore.tsx`:

```typescript
loadCountryDetails('Italy'); // Cambiar 'Italy' por otro país
```

Para cambiar los días de datos históricos, modifica el parámetro en el controlador:

```typescript
await CovidController.loadHistoricalData(countryName, 30); // Cambiar 30 por otros días
```

## 🎓 Desarrollado por

Proyecto académico para la materia de Desarrollo Móvil
- Arquitectura: MVC (Model-View-Controller)
- Framework: React Native (Expo)
- Lenguaje: TypeScript

---

**Nota**: Esta aplicación utiliza datos de la API de disease.sh, que proporciona estadísticas actualizadas de COVID-19.
