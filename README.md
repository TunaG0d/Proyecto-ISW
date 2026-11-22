# Atlas Musical Geografico

Plataforma interactiva de geografia musical mundial para el aprendizaje territorial, geomorfologico y cultural a traves de recursos musicales.

---

## Metodologia MoSCoW (Priorizacion de Requisitos)

En base a las definiciones del cliente (Ulises Sepulveda) y los documentos de requisitos:

### 1. Must Have (Obligatorio / Grupo 1 y 2)
* **RS-01: Mapa Interactivo con Canciones Ubicadas**:
  - Implementado con Leaflet y multiples capas tematicas.
  - **Mapa de Relieve Topografico**: Curvas de nivel, altimetria y geomorfologia (OpenTopoMap y perfiles de elevacion).
  - **Mapa de Biomas**: Capa tematica vectorial (GeoJSON) con los grandes biomas de America Latina (Selva Amazonica, Puna y Altiplano, Desierto de Atacama, Llanos del Orinoco, Pampa Humeda, Bosque Valdiviano, Estepa Patagonica, Caribe/Cienagas y Gran Chaco), con analisis acustico, clima e instrumentos tradicionales representativos.
* **RS-02: Formulario de Contribuciones Pedagogicas**:
  - Enlace a YouTube con reproductor embebido.
  - Justificacion territorial y utilidad pedagogica obligatoria.
  - Etiquetas combinadas (fisicas y humanas: relieve, bioma, instrumento, cosmovision).
  - **Delimitacion Espacial Multigeometrica (Grupo 2)**: Soporte completo para ingresar recursos como:
    - **Punto**: Localidad o ciudad especifica.
    - **Linea**: Trazado de rutas migratorias o cuencas fluviales (ej: Rio de los Pajaros Pintados / Rio Uruguay).
    - **Area / Poligono**: Cuencas, valles o zonas territoriales (ej: Pampa salitrera en Atacama o Cienagas del Magdalena).
* **RS-03: Modulo de Moderacion / Validador**:
  - Panel exclusivo para moderadores con filtrado por estado: Pendientes, Aprobadas, Rechazadas y Todas.
  - Acciones de Aprobar y Rechazar con ingreso de observaciones/feedback pedagogico.

### 2. Should Have (Alta / Grupo 3)
* **Interacciones Avanzadas**:
  - Busqueda en tiempo real por titulo, artista, localidad, bioma, relieve o etiquetas.
  - Explorador de cercania geografica (radio de proximidad de canciones a cualquier punto seleccionado).
  - Geocodificacion y reverse geocoding interactivo.

### 3. Could Have (Media / Grupo 4)
* **RS-05: Espacio de Discusion y Comentarios**:
  - Cada recurso musical cuenta con una seccion comunitaria donde docentes y estudiantes pueden dejar comentarios, preguntas y aportes pedagogicos en tiempo real, persistidos en la base de datos.

### 4. Won't Have por ahora (Baja / Grupo 5)
* Traduccion automatica de letras y cliente movil nativo (se evalua para etapas posteriores).

---

## Arquitectura Tecnica

### Backend (Python + SQLite)
- **`server.py`**: Servidor HTTP RESTful nativo en Python 3 (sin dependencias externas pesadas).
- **`database.db`**: Base de datos SQLite con tablas para:
  - `songs`: Canciones con geometrias (`geom_type`, `coordinates_json`, `lat`, `lng`), biomas, relieve, contexto y notas de moderacion.
  - `comments`: Hilos de discusion pedagogica vinculados a cada cancion.
  - `reports`: Sistema de reporte de inconsistencias.
- **`biomes.json`**: Dataset GeoJSON con la geometria de los biomas, perfiles acusticos y organologia musical.

### Frontend
- **`index.html`**: Estructura semantica accesible con panel dual colapsable, controles flotantes y leyendas dinamicas.
- **`styles.css`**: Interfaz moderna con modo oscuro, glassmorphism y diseno responsivo.
- **`app.js`**: Cliente reactivo con integracion REST (`/api/songs`, `/api/biomes`, `/api/songs/:id/comments`, etc.) y respaldo transparente en LocalStorage ante desconexion.

---

## Como Ejecutar la Aplicacion

1. En la raiz del proyecto, ejecuta el servidor backend:
   ```powershell
   python server.py
   ```
2. Abre tu navegador en:
   ```
   http://localhost:8000
   ```
