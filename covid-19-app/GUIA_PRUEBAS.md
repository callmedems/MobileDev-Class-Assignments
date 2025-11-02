# 🧪 Guía de Pruebas - App COVID-19

## 🎯 Objetivo
Verificar que la aplicación cumple con los 3 criterios de la rúbrica:
1. Lista de países con bandera (20 pts)
2. Pantalla con datos completos (40 pts)
3. Gráfica de casos acumulados (40 pts)

---

## 🚀 Paso 1: Iniciar la Aplicación

### En la terminal de VS Code:

```powershell
# Asegúrate de estar en el directorio del proyecto
cd d:\MobDev\covid-19-app

# Instalar dependencias (si aún no lo hiciste)
npm install

# Iniciar el servidor Expo
npm start
```

### Opciones de ejecución:
- Presiona `a` para Android (emulador o dispositivo físico)
- Presiona `i` para iOS (solo en Mac)
- Presiona `w` para abrir en navegador web
- Escanea el QR con Expo Go en tu teléfono

---

## ✅ Prueba 1: Lista de Países con Bandera (20 puntos)

### Lo que debes ver:

**Header (Parte superior)**
```
┌─────────────────────────┐
│    COVID-19             │ ← Fondo morado (#6200EE)
│  Lista de Países        │ ← Texto blanco
└─────────────────────────┘
```

**Lista de países (Scrollable)**
```
┌─────────────────────────┐
│  🇦🇫 Afghanistan        │ ← Bandera 60x40
│     Casos: 38,883       │ ← Número formateado
├─────────────────────────┤
│  🇦🇱 Albania            │
│     Casos: 12,073       │
├─────────────────────────┤
│  🇩🇿 Algeria            │
│     Casos: 49,413       │
├─────────────────────────┤
│  ...más países...       │
└─────────────────────────┘
```

### ✅ Checklist:
- [ ] Aparece header "COVID-19 - Lista de Países" con fondo morado
- [ ] Se muestra una lista scrollable de países
- [ ] Cada país tiene una bandera visible (60x40 píxeles)
- [ ] Cada país muestra su nombre en negrita
- [ ] Cada país muestra "Casos: X,XXX,XXX" con números formateados
- [ ] Los países están ordenados alfabéticamente
- [ ] Hay sombras en cada tarjeta de país
- [ ] Al hacer scroll, la lista es fluida

### 🔍 Verificación técnica:
```
Archivo: app/(tabs)/index.tsx
Componente: CountryListView
API: https://disease.sh/v3/covid-19/countries
```

**Si algo falla**:
- Verifica conexión a internet
- Revisa la consola en busca de errores
- Asegúrate de que las dependencias estén instaladas

---

## ✅ Prueba 2: Pantalla con Datos Completos (40 puntos)

### Cómo llegar:
1. En la lista de países, **toca cualquier país** (recomiendo "Italy" para ver datos como en la imagen de referencia)

### Lo que debes ver:

**Header**
```
┌─────────────────────────┐
│      Covid19            │ ← Fondo morado (#6200EE)
└─────────────────────────┘
```

**Sección de país**
```
┌─────────────────────────┐
│       🇮🇹               │ ← Bandera grande 120x80
│       Italy             │ ← Nombre del país
└─────────────────────────┘
```

**Tarjetas de estadísticas (3 columnas)**
```
┌──────┐ ┌──────┐ ┌──────┐
│Casos │ │Recup.│ │Fallec│
│110574│ │16847 │ │13155 │
└──────┘ └──────┘ └──────┘
 (rojo)   (verde)  (gris)
```

### ✅ Checklist:
- [ ] Header muestra "Covid19" con fondo morado
- [ ] Bandera del país es grande (120x80) y centrada
- [ ] Nombre del país aparece debajo de la bandera (tamaño 28, negrita)
- [ ] Tres tarjetas horizontales con estadísticas:
  - [ ] Tarjeta CASOS con fondo rojo claro (#FFE5E5)
  - [ ] Tarjeta RECUPERADOS con fondo verde claro (#E5F7E5)
  - [ ] Tarjeta FALLECIDOS con fondo gris (#F5F5F5)
- [ ] Cada tarjeta muestra:
  - [ ] Label (Casos/Recuperados/Fallecidos)
  - [ ] Número grande formateado con comas
- [ ] Scroll funciona para ver más contenido

### 🔍 Verificación técnica:
```
Archivo: app/(tabs)/explore.tsx
Componente: CountryDetailView
API: https://disease.sh/v3/covid-19/countries/{country}
```

**Si no muestra datos**:
- Verifica que hayas tocado un país en la lista
- Revisa la consola para errores de API
- Intenta con otro país

---

## ✅ Prueba 3: Gráfica de Casos Acumulados (40 puntos)

### Cómo llegar:
1. Estar en la pantalla de detalles de un país (Prueba 2)
2. **Hacer scroll hacia abajo**

### Lo que debes ver:

**Título de gráfica**
```
Casos Acumulados (últimos 30 días)
```

**Gráfica de línea**
```
┌─────────────────────────────┐
│  100000                     │
│      •                    • │ ← Puntos blancos
│     /                    /  │
│    /                    /   │
│   •                    •    │
│  /                    /     │
│ •___________________•       │
│ 0                           │
│ 5/1  5/5  5/10  ...  5/30  │ ← Fechas
└─────────────────────────────┘
```

### Características de la gráfica:
```
🎨 Fondo: Gradiente morado (#6200EE → #9D4EDD)
📈 Línea: Blanca, suavizada (bezier)
📍 Puntos: Blancos con borde
📅 Etiquetas: Fechas en formato M/D
📊 Datos: Casos acumulados (tendencia ascendente)
```

### ✅ Checklist:
- [ ] Título "Casos Acumulados (últimos 30 días)" visible
- [ ] Gráfica aparece con fondo morado degradado
- [ ] Línea blanca conecta los puntos
- [ ] Línea es suavizada (curva bezier)
- [ ] Puntos blancos visibles en cada dato
- [ ] Etiquetas de fecha en eje X (formato M/D)
- [ ] Números de casos en eje Y
- [ ] Gráfica muestra tendencia ascendente (de menor a mayor)
- [ ] Gráfica es responsive (ajustada al ancho de pantalla)
- [ ] Al menos 10 puntos de datos visibles

### 🔍 Verificación técnica:
```
Archivo: views/CountryDetailView.tsx
Componente: LineChart de react-native-chart-kit
API: https://disease.sh/v3/covid-19/historical/{country}?lastdays=30
Datos: timeline.cases (acumulados, no diarios)
```

**Datos que muestra la gráfica**:
```typescript
// Ejemplo de datos (Italy):
{
  "1/1/2025": 100000,
  "1/2/2025": 101500,
  "1/3/2025": 103200,
  // ... hasta 30 días
}
```

**Si la gráfica no aparece**:
- Verifica que `react-native-svg` esté instalado
- Asegúrate de hacer scroll hacia abajo
- Espera unos segundos para que cargue
- Revisa la consola en busca de errores

---

## 🎯 Prueba Completa: Flujo de Usuario

### Escenario: Usuario quiere ver datos de Italia

1. **Abrir app**
   - ✅ Ve lista de países cargando
   - ✅ Aparece loading spinner

2. **Ver lista**
   - ✅ Lista se carga con todos los países
   - ✅ Busca "Italy" haciendo scroll
   - ✅ Ve bandera de Italia 🇮🇹
   - ✅ Ve "Casos: XXX,XXX"

3. **Tocar Italia**
   - ✅ Navega a pantalla de detalles
   - ✅ Ve loading mientras carga

4. **Ver detalles**
   - ✅ Bandera grande de Italia
   - ✅ Nombre "Italy"
   - ✅ Tres tarjetas:
     - Casos (rojo)
     - Recuperados (verde)
     - Fallecidos (gris)

5. **Scroll hacia abajo**
   - ✅ Ve título "Casos Acumulados"
   - ✅ Ve gráfica morada
   - ✅ Línea muestra tendencia ascendente
   - ✅ Ve estadísticas adicionales

---

## 📊 Verificación de Arquitectura MVC

### ✅ Checklist de Arquitectura:

**Model (models/CovidModel.ts)**
- [ ] Existe archivo CovidModel.ts
- [ ] Tiene método getAllCountries()
- [ ] Tiene método getCountryData()
- [ ] Tiene método getHistoricalData()
- [ ] Tiene método transformHistoricalDataForChart()
- [ ] Define interfaces Country y HistoricalData
- [ ] Usa axios para peticiones HTTP

**Controller (controllers/CovidController.ts)**
- [ ] Existe archivo CovidController.ts
- [ ] Tiene método loadCountries()
- [ ] Tiene método loadCountryDetails()
- [ ] Tiene método loadHistoricalData()
- [ ] Tiene método formatNumber()
- [ ] Usa try-catch para manejo de errores
- [ ] Llama al modelo, no hace peticiones directas

**View (views/)**
- [ ] Existe CountryListView.tsx
- [ ] Existe CountryDetailView.tsx
- [ ] Vistas NO tienen lógica de negocio
- [ ] Vistas solo presentan datos recibidos por props
- [ ] Usan componentes de React Native (View, Text, Image)
- [ ] Tienen estilos definidos con StyleSheet

**Separación de responsabilidades**
- [ ] Model maneja SOLO datos y API
- [ ] Controller maneja SOLO lógica de aplicación
- [ ] View maneja SOLO presentación
- [ ] NO hay acceso directo Model → View
- [ ] Flujo: View → Controller → Model → Controller → View

---

## 🔧 Comandos Útiles para Pruebas

### Ver logs en tiempo real:
```powershell
# Android
npm run android

# Ver logs detallados
adb logcat *:S ReactNative:V ReactNativeJS:V
```

### Limpiar caché si hay problemas:
```powershell
npm start -- --clear
```

### Verificar TypeScript:
```powershell
npx tsc --noEmit
```

### Ver errores de ESLint:
```powershell
npm run lint
```

---

## 🐛 Solución de Problemas Comunes

### Problema 1: No aparecen las banderas
**Causa**: Problema de conexión o URL inválida
**Solución**: 
- Verifica internet
- Revisa consola para errores de imagen
- Las banderas vienen de la API (campo `countryInfo.flag`)

### Problema 2: Gráfica no se muestra
**Causa**: react-native-svg no instalado
**Solución**:
```powershell
npm install react-native-svg
npm start -- --clear
```

### Problema 3: Números sin formato
**Causa**: Método formatNumber no aplicado
**Solución**: Verificar que se use `CovidController.formatNumber()`

### Problema 4: Datos no cargan
**Causa**: API no responde o error de red
**Solución**:
- Verifica conexión
- Prueba la API en navegador: https://disease.sh/v3/covid-19/countries
- Revisa consola para errores

### Problema 5: App crashea al tocar país
**Causa**: Parámetros de navegación incorrectos
**Solución**: Verificar que `router.push()` tenga parámetros correctos

---

## 📸 Evidencias para Entregar

### Screenshots recomendados:

1. **Pantalla 1: Lista completa**
   - Captura mostrando header + lista de países
   - Asegúrate de que se vean banderas

2. **Pantalla 1: Detalle de un país en lista**
   - Zoom a un país mostrando bandera + nombre + casos

3. **Pantalla 2: Header y datos del país**
   - Captura mostrando bandera grande + nombre + 3 tarjetas

4. **Pantalla 2: Gráfica**
   - Captura centrada en la gráfica de casos acumulados

5. **Código: Estructura MVC**
   - Screenshot del explorador de archivos mostrando:
     - models/
     - controllers/
     - views/

---

## ✅ Checklist Final de Entrega

### Funcionalidad
- [ ] Lista de países carga correctamente
- [ ] Todas las banderas se muestran
- [ ] Números están formateados
- [ ] Navegación funciona al tocar país
- [ ] Detalles muestran casos, recuperados, fallecidos
- [ ] Gráfica aparece y muestra datos correctos
- [ ] No hay crashes

### Arquitectura
- [ ] Carpeta models/ existe con CovidModel.ts
- [ ] Carpeta controllers/ existe con CovidController.ts
- [ ] Carpeta views/ existe con vistas
- [ ] Separación clara de responsabilidades
- [ ] No hay lógica de negocio en vistas

### Código
- [ ] Sin errores de TypeScript
- [ ] Sin errores de ESLint
- [ ] Código comentado
- [ ] Nombres descriptivos

### Documentación
- [ ] README.md actualizado
- [ ] README_COVID.md presente
- [ ] ARQUITECTURA_MVC.md presente
- [ ] CUMPLIMIENTO_RUBRICA.md presente

---

## 🎉 Resultado Esperado

Al completar todas las pruebas:

✅ **20/20 puntos** - Lista de países con bandera funciona perfectamente  
✅ **40/40 puntos** - Pantalla de detalles muestra toda la información  
✅ **40/40 puntos** - Gráfica muestra casos acumulados correctamente  

**TOTAL: 100/100 PUNTOS** 🎊

---

## 📞 Contacto

Si encuentras algún problema durante las pruebas:
1. Lee CUMPLIMIENTO_RUBRICA.md
2. Revisa ARQUITECTURA_MVC.md
3. Consulta README_COVID.md
4. Verifica la consola de errores

---

**¡Buena suerte con tu presentación!** 🚀
