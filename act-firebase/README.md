# 📱 App de Estudiantes con Firebase

App React Native + Expo para registrar y consultar estudiantes en tiempo real.

## 🚀 Inicio Rápido

### Instalar dependencias
```bash
npm install
```

### Ejecutar la app

**Opción 1: Expo Go**
```bash
npm start
```
- Escanea el QR con la app **Expo Go** en tu teléfono
- O presiona `a` para Android / `i` para iOS (emuladores)

**Opción 2: Dispositivo Android**
```bash
npm run android
```

**Opción 3: Simulador iOS** (solo macOS)
```bash
npm run ios
```

**Opción 4: Navegador web**
```bash
npm run web
```

## 📱 Funcionalidades

- **Registro**: Captura matrícula, nombre y semestre
- **Consulta**: Lista de estudiantes con FlatList
- **Sync en tiempo real**: Los datos aparecen automáticamente en todos los dispositivos
- **Validación**: Formularios con validación
- **Logging**: Sistema de logs local con AsyncStorage

## 🔥 Firebase ya está configurado

El proyecto ya tiene Firebase configurado y listo para usar. Solo necesitas ejecutar la app.

## 📂 Estructura Simple

```
app/(tabs)/
  ├── index.tsx    → Pantalla de Registro
  └── explore.tsx  → Pantalla de Consulta
services/
  ├── studentService.ts → CRUD + Firebase
  └── logger.ts         → Sistema de logs
```
