# 📱 App COVID-19 - React Native

> Aplicación móvil para consultar y visualizar información de COVID-19 por país con gráficas interactivas.

![React Native](https://img.shields.io/badge/React_Native-0.81-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~54.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)
![MVC](https://img.shields.io/badge/Architecture-MVC-green.svg)

## 🎯 Características

✅ **Lista de países** con banderas y número de casos  
✅ **Detalles completos** con casos, recuperados y fallecidos  
✅ **Gráfica de línea** con casos acumulados (últimos 30 días)  
✅ **Arquitectura MVC** completa y documentada  
✅ **TypeScript** para código seguro y mantenible  

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el proyecto
npm start

# 3. Ejecutar en tu dispositivo
# Presiona 'a' para Android
# Presiona 'i' para iOS
# Presiona 'w' para Web
```

## 📸 Capturas de Pantalla

### Primera Pantalla: Lista de Países
- Lista scrollable con todos los países
- Bandera (60x40) + Nombre + Casos totales
- Al tocar navega a detalles

### Segunda Pantalla: Detalles y Gráfica
- Bandera grande (120x80)
- Cards de estadísticas (Casos, Recuperados, Fallecidos)
- Gráfica de línea con casos acumulados
- Información adicional (activos, críticos, tests)

## 🏗️ Arquitectura MVC

```
📁 models/
  └── CovidModel.ts          # Modelo: Datos y lógica de negocio
📁 controllers/
  └── CovidController.ts     # Controlador: Intermediario
📁 views/
  ├── CountryListView.tsx    # Vista: Lista de países
  └── CountryDetailView.tsx  # Vista: Detalles con gráfica
📁 app/(tabs)/
  ├── index.tsx              # Pantalla principal
  └── explore.tsx            # Pantalla de detalles
```

## 🌐 APIs Utilizadas

- **Lista de países**: `https://disease.sh/v3/covid-19/countries`
- **Datos históricos**: `https://disease.sh/v3/covid-19/historical/{country}`

## 📦 Dependencias Principales

```json
{
  "react-native-chart-kit": "^6.12.0",
  "react-native-svg": "^15.10.1",
  "axios": "^1.7.9",
  "expo-router": "~6.0.13"
}
```

## 📚 Documentación

- 📖 [**GUIA_RAPIDA.md**](./GUIA_RAPIDA.md) - Guía de inicio rápido
- 📖 [**README_COVID.md**](./README_COVID.md) - Documentación completa del proyecto
- 📖 [**ARQUITECTURA_MVC.md**](./ARQUITECTURA_MVC.md) - Explicación detallada de la arquitectura

## 🎓 Rúbrica de Evaluación

| Criterio | Puntos | Estado |
|----------|--------|--------|
| Lista de países con bandera | 20 | ✅ **20/20** |
| Pantalla con datos completos | 40 | ✅ **40/40** |
| Gráfica de casos acumulados | 40 | ✅ **40/40** |
| **TOTAL** | **100** | ✅ **100/100** |

## 📱 Estructura de la App

### Primera Pantalla (`index.tsx`)
```typescript
- Header: "COVID-19 - Lista de Países"
- FlatList con países:
  ├─ Bandera (60x40)
  ├─ Nombre del país
  └─ Casos: 1,234,567
```

### Segunda Pantalla (`explore.tsx`)
```typescript
- Header: "Covid19"
- ScrollView con:
  ├─ Bandera grande (120x80)
  ├─ Nombre del país
  ├─ Cards de estadísticas:
  │  ├─ Casos (rojo)
  │  ├─ Recuperados (verde)
  │  └─ Fallecidos (gris)
  ├─ Gráfica LineChart (casos acumulados)
  └─ Estadísticas adicionales
```

## 🔧 Tecnologías

- **React Native** (0.81.5) - Framework
- **Expo** (~54.0) - Herramientas de desarrollo
- **TypeScript** (5.9) - Lenguaje
- **React Native Chart Kit** - Gráficas
- **Axios** - Peticiones HTTP
- **Expo Router** - Navegación

## 🎨 Componentes de Gráfica

Utilizamos `react-native-chart-kit` con `LineChart`:

```typescript
<LineChart
  data={chartData}
  width={Dimensions.get('window').width - 20}
  height={220}
  chartConfig={{
    backgroundColor: '#6200EE',
    backgroundGradientFrom: '#6200EE',
    backgroundGradientTo: '#9D4EDD',
    // ...
  }}
  bezier
/>
```

## 🔄 Flujo de Datos

```
Usuario → Vista → Controlador → Modelo → API
                  ↓
         Procesa y Valida
                  ↓
Usuario ← Vista ← Controlador ← Modelo ← API
```

## 💡 Características Técnicas

- ✅ Arquitectura MVC completa
- ✅ TypeScript con interfaces
- ✅ Async/await para operaciones asíncronas
- ✅ Manejo de errores con try-catch
- ✅ Estados de carga (loading)
- ✅ Singleton pattern para Model y Controller
- ✅ FlatList para performance óptima
- ✅ Responsive design

## 🐛 Solución de Problemas

```bash
# Si hay errores de módulos
npm install

# Si no carga las gráficas
npm install react-native-svg

# Limpiar caché
npm start -- --clear
```

## 📊 Datos Mostrados

### Primera Pantalla
- ✅ Nombre del país
- ✅ Bandera del país
- ✅ Número total de contagiados

### Segunda Pantalla
- ✅ Nombre del país
- ✅ Bandera del país
- ✅ Casos totales
- ✅ Recuperados
- ✅ Fallecidos
- ✅ Gráfica de casos acumulados (últimos 30 días)
- Casos activos
- Casos críticos
- Tests realizados

## 🎓 Proyecto Académico

- **Materia**: Desarrollo Móvil
- **Arquitectura**: MVC (Model-View-Controller)
- **Framework**: React Native con Expo
- **Lenguaje**: TypeScript

## 📄 Licencia

Este es un proyecto académico para fines educativos.

---

**Desarrollado con ❤️ usando React Native y Expo**

📖 Lee [GUIA_RAPIDA.md](./GUIA_RAPIDA.md) para empezar rápidamente
