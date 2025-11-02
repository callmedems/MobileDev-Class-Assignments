# 🚀 Guía Rápida - App COVID-19

## Iniciar el Proyecto

### Paso 1: Instalar dependencias (si no están instaladas)
```bash
npm install
```

### Paso 2: Iniciar el servidor de desarrollo
```bash
npm start
```

### Paso 3: Abrir en tu dispositivo
- **Android**: Presiona `a` en la terminal o ejecuta `npm run android`
- **iOS**: Presiona `i` en la terminal o ejecuta `npm run ios`
- **Web**: Presiona `w` en la terminal o ejecuta `npm run web`

## 📱 Cómo usar la App

### Pantalla 1: Lista de Países
1. Al abrir la app verás una lista de todos los países
2. Cada país muestra:
   - 🏴 Bandera
   - 📍 Nombre del país
   - 🔢 Número total de casos
3. **Toca cualquier país** para ver sus detalles

### Pantalla 2: Detalles del País
1. Verás información detallada:
   - 🏴 Bandera grande del país
   - 📊 Tres tarjetas con estadísticas:
     - Casos totales (rojo)
     - Recuperados (verde)
     - Fallecidos (gris)
   - 📈 Gráfica de casos acumulados (últimos 30 días)
   - ℹ️ Información adicional (activos, críticos, tests)

## 🎯 Lo que verás

```
┌─────────────────────────┐
│    COVID-19             │  ← Header morado
│  Lista de Países        │
├─────────────────────────┤
│  🇦🇫 Afghanistan        │
│     Casos: 38,883       │
├─────────────────────────┤
│  🇦🇱 Albania            │
│     Casos: 12,073       │
├─────────────────────────┤
│  🇩🇿 Algeria            │
│     Casos: 49,413       │
└─────────────────────────┘

        ⬇️ (Al tocar un país)

┌─────────────────────────┐
│      Covid19            │  ← Header morado
├─────────────────────────┤
│      🇮🇹                │
│      Italy              │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │ Casos: 110,574    │  │ ← Tarjetas de stats
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Recuperados       │  │
│  │ 16,847           │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Fallecidos        │  │
│  │ 13,155           │  │
│  └───────────────────┘  │
├─────────────────────────┤
│ Casos Acumulados        │
│  📈 [Gráfica de línea]  │
│                         │
│    /                    │
│   /                     │
│  /____                  │
│                         │
└─────────────────────────┘
```

## ⚙️ Configuración

### Cambiar país predeterminado
Edita `app/(tabs)/explore.tsx`, línea ~22:
```typescript
loadCountryDetails('Italy'); // Cambiar por otro país
```

### Cambiar días de datos históricos
Edita `app/(tabs)/explore.tsx`, línea ~32:
```typescript
const historicalData = await CovidController.loadHistoricalData(countryName, 30);
// Cambiar 30 por 60, 90, etc.
```

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error con las gráficas
```bash
npm install react-native-svg
```

### La app no carga datos
- Verifica tu conexión a internet
- La API podría estar temporalmente no disponible

### Errores de TypeScript
```bash
npx tsc --noEmit
```

## 📚 Estructura de Archivos

```
covid-19-app/
├── models/
│   └── CovidModel.ts          ← Lógica de datos y API
├── controllers/
│   └── CovidController.ts     ← Intermediario
├── views/
│   ├── CountryListView.tsx    ← Vista de lista
│   └── CountryDetailView.tsx  ← Vista de detalles
├── app/(tabs)/
│   ├── index.tsx              ← Pantalla principal
│   └── explore.tsx            ← Pantalla de detalles
└── README_COVID.md            ← Documentación completa
```

## 🎓 Documentación Completa

- **README_COVID.md**: Documentación completa del proyecto
- **ARQUITECTURA_MVC.md**: Explicación detallada de la arquitectura MVC

## ✅ Checklist para Entrega

- [ ] ✅ Lista de países con banderas
- [ ] ✅ Número de casos en cada país
- [ ] ✅ Pantalla de detalles con casos, recuperados y fallecidos
- [ ] ✅ Bandera del país en detalles
- [ ] ✅ Gráfica de casos acumulados
- [ ] ✅ Arquitectura MVC implementada
- [ ] ✅ Código limpio y comentado
- [ ] ✅ Documentación completa

## 🎨 Personalización de Colores

Si quieres cambiar el color principal (morado) de la app:

### Header
Edita `app/(tabs)/index.tsx` y `app/(tabs)/explore.tsx`:
```typescript
header: {
  backgroundColor: '#6200EE', // Cambiar este color
}
```

### Gráfica
Edita `views/CountryDetailView.tsx`:
```typescript
chartConfig={{
  backgroundColor: '#6200EE',           // Cambiar
  backgroundGradientFrom: '#6200EE',   // Cambiar
  backgroundGradientTo: '#9D4EDD',     // Cambiar
}}
```

## 📞 Soporte

Si tienes problemas:
1. Lee la documentación completa en `README_COVID.md`
2. Revisa `ARQUITECTURA_MVC.md` para entender la estructura
3. Verifica que todas las dependencias estén instaladas

---

**¡Listo para ejecutar!** 🚀

Ejecuta `npm start` y disfruta tu app de COVID-19.
