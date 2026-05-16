# TC-SW-Proyecto-Final

**Dashboard + Simulador de bancada booster** — Proyecto final del Training Center de Software de Hyperloop UPV.

## ¿Qué es esto?

Una aplicación web que combina un **dashboard en tiempo real** con un **simulador visual** del vehículo Hyperloop sobre su bancada booster. Los datos de simulación se reciben desde el backend a 4 Hz, a una velocidad de simulación de x0.2 respecto a la real.

## Vistas disponibles

### 📊 Vista de gráficas
Representación en tiempo real de los datos del vehículo usando **Chart.js**.

### 🚀 Vista 3D
Modelo tridimensional del vehículo y la bancada booster (diseñado por el TC de Mechanics), animado con los datos de simulación. Implementado con:
- [`model-viewer`](https://modelviewer.dev/) de Google
- [Three.js](https://threejs.org/)

## Iniciar la aplicación

El frontend ya viene compilado dentro de la carpeta del backend, así que solo es necesario:

```bash
cd backend
cargo run
```

Para más detalles sobre el backend, consulta [su README](./backend/README.md).