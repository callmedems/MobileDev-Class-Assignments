# 🚀 Guía de Instalación y Despliegue

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Expo CLI
- Cuenta de Expo (gratuita)
- Dispositivo Android o iOS físico (recomendado)

## 🔧 Instalación Inicial

### 1. Instalar dependencias base
```bash
npm install
```

### 2. Instalar librerías de hardware especializado
```bash
npx expo install expo-location expo-sensors @react-native-async-storage/async-storage react-native-webview@13.15.0 expo-keep-awake
```

## 🎯 Opciones de Ejecución

### **Opción 1: Desarrollo Rápido (Mismo WiFi)** ⚡

Para probar rápidamente **SIN salir de tu red WiFi**:

```bash
npm start
```

Luego escanea el QR con Expo Go.

**⚠️ Limitación:** No podrás salir de casa (necesitas estar en la misma red que tu laptop).

---

### **Opción 2: Tunnel (Menos estable)** 🌐

Para usar fuera de tu red WiFi pero con conexión a tu laptop:

```bash
npm run tunnel
# o
npx expo start --tunnel
```

**⚠️ Limitación:** Puede ser lento e inestable. Requiere que tu laptop esté encendida.

---

### **Opción 3: EAS Build - Development (RECOMENDADA)** 🏆

Esta es la **mejor opción** para salir a caminar con la app funcionando completamente.

#### Paso 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

#### Paso 2: Login en Expo
```bash
eas login
```

Si no tienes cuenta:
```bash
# Crear cuenta desde navegador: https://expo.dev/signup
```

#### Paso 3: Configurar EAS Build (ya está configurado en eas.json)
```bash
eas build:configure
```

#### Paso 4: Build para Android (APK instalable)
```bash
eas build --profile development --platform android
```

**Esto tomará 10-20 minutos** y te dará un link para descargar el APK.

#### Paso 5: Instalar APK en tu teléfono
1. Una vez completado el build, recibirás un link
2. Abre el link en tu teléfono Android
3. Descarga e instala el APK
4. Permite "instalar de fuentes desconocidas" si tu teléfono lo pide

#### Para iOS:
```bash
eas build --profile development --platform ios
```

**Nota:** iOS requiere Apple Developer Account ($99/año) o usar TestFlight.

---

### **Opción 4: Build de Producción** 📦

Para una versión final optimizada:

```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios
```

---

## 📱 Uso de la App

### Primera Vez:
1. **Abre la app**
2. **Acepta permisos** de ubicación y sensores
3. Espera unos segundos para que el GPS se sincronice

### Para Tracking:
1. **▶️ Iniciar** - Comienza el tracking
2. **Sal a caminar/correr** por tu vecindario
3. La app detectará automáticamente:
   - 🧘 Quieto
   - 🚶 Caminando
   - 🏃 Corriendo
   - 🚗 En vehículo
4. **⏹️ Detener** - Guarda la sesión
5. **Guarda la ruta** con nombre

### Ver Rutas:
1. Ve a la pestaña **"Rutas"**
2. Selecciona una ruta
3. **🗺️ Ver Mapa** - Visualiza tu recorrido

---

## 🔑 Permisos Necesarios

La app solicitará automáticamente:

### Android
- ✅ Ubicación precisa (GPS)
- ✅ Reconocimiento de actividad física
- ✅ Mantener pantalla activa

### iOS
- ✅ Ubicación cuando está en uso
- ✅ Sensores de movimiento

---

## 🐛 Solución de Problemas

### GPS no funciona
```
✅ Verifica que tengas ubicación activada
✅ Sal al exterior (mejor señal satelital)
✅ Espera 10-30 segundos para fix GPS inicial
✅ Asegúrate de estar usando dispositivo físico (no emulador)
```

### App se desconecta al salir de casa
```
❌ Estás usando Expo Go con npm start
✅ Usa EAS Build (Opción 3)
```

### Acelerómetro no detecta movimiento
```
✅ Verifica permisos de sensores
✅ Usa dispositivo físico (emuladores no tienen acelerómetro)
✅ Mueve el teléfono más activamente
```

### Mapas no cargan
```
✅ Necesitas conexión a internet para tiles de OpenStreetMap
✅ Verifica que WebView esté habilitado
```

---

## 📊 Métricas que Calcula

- **Distancia**: Fórmula de Haversine entre coordenadas GPS
- **Velocidad**: Promedio de velocidades GPS (km/h)
- **Pasos**: Detección de picos en acelerómetro
- **Calorías**: Cálculo basado en MET (Metabolic Equivalent)
- **Duración**: Tiempo total de la sesión
- **Actividad predominante**: Clasificación inteligente

---

## 🎥 Para Grabar el Video de Demostración

1. **Inicia la app** con build de desarrollo instalado
2. **Graba la pantalla** de tu teléfono
3. Muestra:
   - ✅ Pantalla inicial solicitando permisos
   - ✅ Botón "Iniciar" y comenzar tracking
   - ✅ Indicador de actividad cambiando (camina, corre, detente)
   - ✅ Métricas actualizándose en tiempo real
   - ✅ Ubicación actual
   - ✅ Botón "Detener" y guardar ruta
   - ✅ Pantalla de rutas guardadas
   - ✅ Abrir mapa y mostrar el recorrido con inicio/fin
4. **Edita** y agrega texto explicativo si es necesario

---

## 🚀 Comandos Rápidos

```bash
# Desarrollo local (mismo WiFi)
npm start

# Con tunnel (fuera de WiFi, laptop encendida)
npm run tunnel

# Build de desarrollo (APK independiente) - RECOMENDADO
eas build --profile development --platform android

# Build de producción
eas build --profile production --platform android

# Ver builds anteriores
eas build:list

# Configurar proyecto
eas build:configure
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que todos los permisos estén concedidos
2. Asegúrate de usar dispositivo físico
3. Comprueba que el GPS esté activo
4. Revisa los logs en la consola de Expo

---

## ✅ Checklist de Entrega

- [ ] App instalada en teléfono físico
- [ ] Permisos de GPS y sensores otorgados
- [ ] Probado caminar/correr por el vecindario
- [ ] Ruta guardada exitosamente
- [ ] Mapa visualizado correctamente
- [ ] Video de demostración grabado
- [ ] README.md documentado

---

**¡Tu app está lista para cumplir con todos los requisitos del proyecto!** 🎉
