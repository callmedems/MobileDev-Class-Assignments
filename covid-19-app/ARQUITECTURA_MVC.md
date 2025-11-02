# Arquitectura MVC - Aplicación COVID-19

## 📐 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO                               │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    VIEW (Vista)                              │
│  ┌───────────────────┐      ┌─────────────────────┐        │
│  │ CountryListView   │      │ CountryDetailView    │        │
│  │ - Lista países    │      │ - Detalles país      │        │
│  │ - Banderas        │      │ - Gráfica            │        │
│  └───────────────────┘      └─────────────────────┘        │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                  CONTROLLER (Controlador)                    │
│                     CovidController                          │
│  - loadCountries()                                           │
│  - loadCountryDetails(country)                               │
│  - loadHistoricalData(country, days)                         │
│  - formatNumber(num)                                         │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                   MODEL (Modelo)                             │
│                     CovidModel                               │
│  - getAllCountries()                                         │
│  - getCountryData(countryName)                               │
│  - getHistoricalData(countryName, days)                      │
│  - transformHistoricalDataForChart(data)                     │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    API EXTERNA                               │
│        https://disease.sh/v3/covid-19                        │
└─────────────────────────────────────────────────────────────┘
```

## 🏛️ Componentes de la Arquitectura

### 1. MODEL (Modelo) 📊

**Archivo**: `models/CovidModel.ts`

**Responsabilidades**:
- Comunicación con las APIs externas
- Estructura de datos (interfaces Country, HistoricalData)
- Transformación de datos
- Lógica de negocio pura

**Métodos principales**:

```typescript
class CovidModel {
  // Obtiene lista completa de países ordenada alfabéticamente
  async getAllCountries(): Promise<Country[]>
  
  // Obtiene datos actuales de un país específico
  async getCountryData(countryName: string): Promise<Country>
  
  // Obtiene datos históricos (por defecto 30 días)
  async getHistoricalData(countryName: string, days: number): Promise<HistoricalData>
  
  // Transforma datos para formato de gráfica
  transformHistoricalDataForChart(historicalData: HistoricalData)
}
```

**Interfaces de datos**:

```typescript
interface Country {
  country: string;
  countryInfo: {
    flag: string;
    // ... más propiedades
  };
  cases: number;
  deaths: number;
  recovered: number;
  // ... más propiedades
}

interface HistoricalData {
  country: string;
  timeline: {
    cases: { [date: string]: number };
    deaths: { [date: string]: number };
    recovered: { [date: string]: number };
  };
}
```

### 2. CONTROLLER (Controlador) 🎮

**Archivo**: `controllers/CovidController.ts`

**Responsabilidades**:
- Intermediario entre Modelo y Vista
- Manejo de errores
- Formateo de datos para presentación
- Lógica de aplicación

**Métodos principales**:

```typescript
class CovidController {
  // Carga países y maneja errores
  async loadCountries(): Promise<Country[]>
  
  // Carga detalles de país con manejo de errores
  async loadCountryDetails(countryName: string): Promise<Country>
  
  // Carga datos históricos preparados para gráfica
  async loadHistoricalData(countryName: string, days: number = 30)
  
  // Formatea números con separadores de miles
  formatNumber(num: number): string
}
```

**Flujo de datos**:
```
Vista solicita datos → Controller valida → Model obtiene → 
Controller procesa → Vista muestra
```

### 3. VIEW (Vista) 🖼️

**Archivos**: 
- `views/CountryListView.tsx`
- `views/CountryDetailView.tsx`

**Responsabilidades**:
- Presentación de datos al usuario
- Manejo de interacciones del usuario
- Estados de carga (loading)
- Estilos y diseño

**Componentes**:

#### CountryListView
```typescript
interface CountryListViewProps {
  countries: Country[];        // Datos a mostrar
  loading: boolean;            // Estado de carga
  onCountryPress: (country: Country) => void;  // Callback
}
```

**Características**:
- FlatList para rendimiento óptimo
- Imagen de bandera (60x40)
- Nombre del país
- Número de casos formateado

#### CountryDetailView
```typescript
interface CountryDetailViewProps {
  country: Country | null;
  chartData: any;
  loading: boolean;
  formatNumber: (num: number) => string;
}
```

**Características**:
- Bandera grande (120x80)
- Cards de estadísticas (casos, recuperados, fallecidos)
- Gráfica de línea con LineChart
- ScrollView para contenido extenso

### 4. SCREENS (Pantallas) 📱

**Archivos**:
- `app/(tabs)/index.tsx` - Pantalla principal
- `app/(tabs)/explore.tsx` - Pantalla de detalles

**Responsabilidades**:
- Gestión de estado (useState, useEffect)
- Navegación entre pantallas
- Composición de vistas
- Coordinación del flujo de la aplicación

**Flujo de la app**:

```
1. Usuario abre app
   ↓
2. index.tsx carga países (CovidController.loadCountries())
   ↓
3. CountryListView muestra lista
   ↓
4. Usuario toca un país
   ↓
5. Navegación a explore.tsx con parámetros
   ↓
6. explore.tsx carga detalles (CovidController.loadCountryDetails())
   ↓
7. explore.tsx carga históricos (CovidController.loadHistoricalData())
   ↓
8. CountryDetailView muestra datos y gráfica
```

## 🔄 Flujo de Datos Completo

### Ejemplo: Cargar lista de países

```typescript
// 1. SCREEN (index.tsx)
const loadCountries = async () => {
  setLoading(true);
  const data = await CovidController.loadCountries();
  setCountries(data);
  setLoading(false);
};

// 2. CONTROLLER (CovidController.ts)
async loadCountries(): Promise<Country[]> {
  try {
    return await CovidModel.getAllCountries();
  } catch (error) {
    throw new Error('No se pudieron cargar los países');
  }
}

// 3. MODEL (CovidModel.ts)
async getAllCountries(): Promise<Country[]> {
  const response = await axios.get(`${this.baseURL}/countries`);
  return response.data.sort((a, b) => a.country.localeCompare(b.country));
}

// 4. VIEW (CountryListView.tsx)
<FlatList
  data={countries}
  renderItem={renderCountryItem}
  keyExtractor={(item) => item.countryInfo._id.toString()}
/>
```

## ✅ Ventajas de esta Arquitectura

1. **Separación de responsabilidades**: Cada capa tiene un propósito claro
2. **Mantenibilidad**: Fácil de modificar y extender
3. **Testabilidad**: Cada componente se puede probar independientemente
4. **Reutilización**: Las vistas y controladores son reutilizables
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades

## 🔧 Ejemplo de Extensión

Para agregar una nueva funcionalidad (ej: buscar país):

```typescript
// 1. MODEL - Agregar método
async searchCountries(query: string): Promise<Country[]> {
  const countries = await this.getAllCountries();
  return countries.filter(c => 
    c.country.toLowerCase().includes(query.toLowerCase())
  );
}

// 2. CONTROLLER - Agregar método
async searchCountries(query: string): Promise<Country[]> {
  try {
    return await CovidModel.searchCountries(query);
  } catch (error) {
    throw new Error('Error en búsqueda');
  }
}

// 3. VIEW - Agregar componente de búsqueda
<TextInput
  placeholder="Buscar país..."
  onChangeText={(text) => handleSearch(text)}
/>

// 4. SCREEN - Usar en pantalla
const handleSearch = async (query: string) => {
  const results = await CovidController.searchCountries(query);
  setCountries(results);
};
```

## 📝 Buenas Prácticas Implementadas

- ✅ TypeScript para tipado fuerte
- ✅ Async/await para operaciones asíncronas
- ✅ Try-catch para manejo de errores
- ✅ Interfaces para estructura de datos
- ✅ Comentarios descriptivos
- ✅ Nombres de variables/funciones descriptivos
- ✅ Singleton pattern para Model y Controller
- ✅ Props interface para componentes React
- ✅ Loading states para mejor UX

## 🎯 Cumplimiento de Arquitectura MVC

| Criterio | Implementación | Estado |
|----------|----------------|--------|
| Modelo separado | CovidModel.ts con toda la lógica de datos | ✅ |
| Controlador separado | CovidController.ts como intermediario | ✅ |
| Vistas separadas | CountryListView.tsx y CountryDetailView.tsx | ✅ |
| Sin lógica de negocio en vistas | Vistas solo presentan datos | ✅ |
| Sin acceso directo Model-View | Comunicación siempre a través del Controller | ✅ |
