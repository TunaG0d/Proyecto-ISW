/**
 * Atlas Musical Geográfico - Front & Backend Integration
 * Metodología MoSCoW:
 *   - Must Have: Mapa interactivo (RS-01), Relieve, Biomas, Formulario pedagógico (RS-02), Delimitación (Punto, Línea, Área), Módulo Validador (RS-03)
 *   - Should Have: Interacciones avanzadas, geocodificación, radio de cercanía
 *   - Could Have: Espacio de discusión y comentarios de usuarios (RS-05)
 *   - Won't Have: Traducciones y apps móviles nativas por ahora
 */

const API_BASE = '/api';

const initialSongs = [
    {
        id: 1,
        title: "Sube a Nacer Conmigo Hermano",
        artist: "Los Jaivas",
        locality: "Machu Picchu / Cusco, Perú",
        geomType: "point",
        lat: -13.1631,
        lng: -72.5450,
        coordinates: null,
        terrain: "Altiplano / Cordillera",
        biome: "Puna y Altiplano Andino",
        tags: ["Cordillera", "Puna", "Andino", "Pablo Neruda", "Charango", "Alturas"],
        context: "Obra fundamental que conecta la geografía andina con las alturas de Machu Picchu y la poesía de Pablo Neruda. Refleja la identidad territorial y la inmensidad de la cordillera de los Andes.",
        pedagogicalUse: "Enseñanza de pisos ecológicos andinos, geomorfología de alta montaña y el diálogo entre literatura y geografía musical.",
        ytLink: "https://www.youtube.com/watch?v=F3qE1Wb4gM0",
        status: "approved",
        moderationNote: "Validado con excelente contenido pedagógico."
    },
    {
        id: 2,
        title: "Río de los Pájaros Pintados (Ruta del Río Uruguay)",
        artist: "Aníbal Sampayo",
        locality: "Cuenca del Río Uruguay / Litoral Argentino-Uruguayo",
        geomType: "line",
        lat: -31.3900,
        lng: -58.0100,
        coordinates: [[-28.18, -54.95], [-29.72, -57.08], [-31.39, -58.01], [-32.48, -58.23], [-34.20, -58.35]],
        terrain: "Cuenca Fluvial / Ribera",
        biome: "Selva Paranaense y Espinal",
        tags: ["Río", "Cuenca Fluvial", "Litoral", "Pesca Artesanal", "Chamamé", "Biodiversidad"],
        context: "Retrata el trayecto del Río Uruguay ('río de los pájaros' en guaraní), la vida cotidiana de los pescadores artesanales y la flora ribereña que bordea la cuenca.",
        pedagogicalUse: "Estudio de hidrografía fluvial sudamericana, cuencas compartidas y la influencia de los cursos de agua en los ritmos litoraleños.",
        ytLink: "https://www.youtube.com/watch?v=kR2e_4o0Wqg",
        status: "approved",
        moderationNote: "Excelente representación de delimitación lineal (río/trayecto)."
    },
    {
        id: 3,
        title: "La Jardinera / Arriba Quemando el Sol",
        artist: "Violeta Parra",
        locality: "Pampa del Salitre / Desierto de Atacama, Chile",
        geomType: "polygon",
        lat: -21.8000,
        lng: -69.5000,
        coordinates: [[-20.10, -69.80], [-20.10, -69.20], [-23.50, -69.00], [-23.50, -70.10]],
        terrain: "Desierto Hiperárido / Pampa",
        biome: "Desierto de Atacama y Costa Árida",
        tags: ["Desierto", "Aridez", "Salitre", "Pampa", "Clima Extremo", "Resistencia"],
        context: "Crónica descarnada del sol abrasador y la sequedad extrema del Desierto de Atacama, contrastada con la historia social de las oficinas salitreras chilenas.",
        pedagogicalUse: "Comprensión de los climas áridos mundiales, la adaptación del ser humano en desiertos hiperáridos y la geografía económica del salitre.",
        ytLink: "https://www.youtube.com/watch?v=Bq3W2Z7t3-c",
        status: "approved",
        moderationNote: "Aprobado: ejemplo sobresaliente de delimitación por área territorial."
    },
    {
        id: 4,
        title: "Zamba de mi Esperanza",
        artist: "Jorge Cafrune",
        locality: "Valles Calchaquíes / Salta, Argentina",
        geomType: "point",
        lat: -24.7821,
        lng: -65.4232,
        coordinates: null,
        terrain: "Valles Calchaquíes",
        biome: "Gran Chaco y Espinal Seco",
        tags: ["Quebrada", "Valles", "Gaucho", "Zamba", "Secano", "Acústica de Valle"],
        context: "Expresión viva del paisaje montañoso y quebradas del noroeste argentino, retratando la relación íntima entre el gaucho, la soledad y la aridez del relieve andino-pampeano.",
        pedagogicalUse: "Geografía física del relieve de quebradas, valles transversales y su reflejo en la acústica de la zamba.",
        ytLink: "https://www.youtube.com/watch?v=0hK22Qn5oYk",
        status: "approved",
        moderationNote: "Validado."
    },
    {
        id: 5,
        title: "La Flor de la Canela",
        artist: "Chabuca Granda",
        locality: "Lima / Valle del Rímac, Perú",
        geomType: "point",
        lat: -12.0464,
        lng: -77.0428,
        coordinates: null,
        terrain: "Valle Costero",
        biome: "Desierto de Atacama y Costa Árida",
        tags: ["Costa", "Valle", "Río Rímac", "Vals Criollo", "Oasis Costero"],
        context: "Evoca la cuenca del río Rímac y los tradicionales puentes y alamedas de Lima. Describe la brisa costeña y la arquitectura tradicional del oasis fluvial en el desierto costero peruano.",
        pedagogicalUse: "Análisis de asentamientos humanos en cuencas áridas y desarrollo urbano junto a cursos de agua.",
        ytLink: "https://www.youtube.com/watch?v=nO_3Vq27m1g",
        status: "approved",
        moderationNote: "Validado."
    },
    {
        id: 6,
        title: "El Pescador",
        artist: "Totó la Momposina",
        locality: "Depresión Momposina / Río Magdalena, Colombia",
        geomType: "polygon",
        lat: 9.2400,
        lng: -74.4200,
        coordinates: [[9.15, -74.60], [9.35, -74.30], [9.10, -74.15], [8.90, -74.45]],
        terrain: "Humedal Fluvial / Ciénaga",
        biome: "Caribe, Depresión Momposina y Manglares",
        tags: ["Ciénaga", "Humedal", "Río Magdalena", "Cumbia", "Tambora", "Anfibio"],
        context: "Homenaje poético al pescador que navega las ciénagas y brazos del río Magdalena. Refleja la simbiosis entre el ecosistema anfibio, la luna y la cadencia de la cumbia tradicional.",
        pedagogicalUse: "Estudio de ecosistemas cenagosos, dinámica de inundaciones fluviales y culturas anfibias de Colombia.",
        ytLink: "https://www.youtube.com/watch?v=eZ2vVUXZg3I",
        status: "approved",
        moderationNote: "Área de ciénagas validada."
    },
    {
        id: 7,
        title: "Canción de cuna para despertar a un negrito",
        artist: "Inti-Illimani",
        locality: "Camagüey / Antillas, Cuba",
        geomType: "point",
        lat: 21.5218,
        lng: -77.7812,
        coordinates: null,
        terrain: "Costa / Antillas",
        biome: "Caribe, Depresión Momposina y Manglares",
        tags: ["Caribe", "Archipiélago", "Afrocaribeño", "Sincretismo", "Manglares"],
        context: "Muestra la influencia cultural afrocubana y su arraigo territorial en las antillas. Útil para enseñar sobre migraciones forzadas, paisajes caribeños y sincretismo.",
        pedagogicalUse: "Geografía insular del Caribe, historia de la diáspora africana y mestizaje sonoro.",
        ytLink: "https://www.youtube.com/watch?v=k4o9sFDBPzM",
        status: "pending",
        moderationNote: null
    },
    {
        id: 8,
        title: "Volver a los 17",
        artist: "Violeta Parra",
        locality: "San Carlos / Valle Central, Chile",
        geomType: "point",
        lat: -36.6067,
        lng: -72.1034,
        coordinates: null,
        terrain: "Valle Central / Secano",
        biome: "Valle Central y Secano",
        tags: ["Secano", "Valle Central", "Campesinado", "Clima Mediterráneo", "Guitarra Traspuesta"],
        context: "Composición nacida en el secano interior de la región de Ñuble, conectada con la flora campesina, las lomas de trigo y el sentir popular chileno.",
        pedagogicalUse: "Ecosistemas de clima mediterráneo y paisajes agrícolas del valle central chileno.",
        ytLink: "https://www.youtube.com/watch?v=s5e_U_6t5_Y",
        status: "approved",
        moderationNote: "Validado con relación geográfica confirmada."
    }
];

function formatCoordinate(val, maxDecimals = 4) {
    if (val === null || val === undefined || val === "" || isNaN(Number(val))) return '—';
    return Number(val).toFixed(maxDecimals);
}

function getStoredSongs() {
    const data = localStorage.getItem('atlas_musical_songs_v3');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Error al leer canciones de localStorage:", e);
        }
    }
    localStorage.setItem('atlas_musical_songs_v3', JSON.stringify(initialSongs));
    return initialSongs;
}

function saveSongs(songs) {
    localStorage.setItem('atlas_musical_songs_v3', JSON.stringify(songs));
}

let songsDatabase = getStoredSongs();
let selectedSongId = null;
let currentActiveTab = 'search';
let currentMapMode = localStorage.getItem('atlas_map_mode') || 'dark';
let currentAdminFilter = 'pending';
let topoBadgeTimeout = null;

// Leaflet y Capas
let map = null;
let currentBaseLayer = null;
const tileLayers = {};
const markersMap = new Map();
const geometriesMap = new Map();
let pointedLocationMarker = null;

// Capa de Biomas GeoJSON
let biomesGeoJsonLayer = null;
let biomesFeaturesData = [];
let isBiomesLayerActive = false;

// Coordenadas interactivas temporales para formularios
let tempShapeCoordinates = [];
let tempDraftLayer = null;

const TILE_PROVIDERS = {
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        options: {
            subdomains: 'abcd',
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        }
    },
    terrain: {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        options: {
            maxZoom: 17,
            attribution: 'Topografía: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (&copy; <a href="https://openstreetmap.org/copyright">OSM</a>)'
        }
    },
    hybrid: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
            maxZoom: 19,
            attribution: 'Satélite &copy; Esri'
        }
    },
    roadmap: {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        options: {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    }
};

/* ==========================================================================
   Comunicaciones con el Backend REST (con soporte offline transparente)
   ========================================================================== */

async function apiRequest(endpoint, options = {}) {
    try {
        const res = await fetch(endpoint, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`Backend offline o endpoint ${endpoint} inalcanzable:`, err.message);
        return null;
    }
}

async function syncWithBackend() {
    const data = await apiRequest(`${API_BASE}/songs?status=all`);
    if (data && data.success && Array.isArray(data.songs) && data.songs.length > 0) {
        songsDatabase = data.songs;
        saveSongs(songsDatabase);
        renderMapMarkers();
        renderAdminList();
        updatePendingBadge();
    }
}

/* ==========================================================================
   Inicialización de Leaflet y Capas Temáticas
   ========================================================================== */

function initLeafletMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer || typeof L === 'undefined') return;

    if (map) {
        map.remove();
        map = null;
    }

    mapContainer.innerHTML = '';

    map = L.map(mapContainer, {
        center: [-18, -65],
        zoom: 4,
        zoomControl: false,
        attributionControl: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayers.dark = L.tileLayer(TILE_PROVIDERS.dark.url, TILE_PROVIDERS.dark.options);
    tileLayers.terrain = L.tileLayer(TILE_PROVIDERS.terrain.url, TILE_PROVIDERS.terrain.options);
    tileLayers.hybrid = L.tileLayer(TILE_PROVIDERS.hybrid.url, TILE_PROVIDERS.hybrid.options);
    tileLayers.roadmap = L.tileLayer(TILE_PROVIDERS.roadmap.url, TILE_PROVIDERS.roadmap.options);

    setMapVisualMode(currentMapMode, false);

    // Cargar capa de Biomas mundiales / latinoamericanos
    loadBiomesLayer();

    map.on('click', (e) => {
        const lat = parseFloat(e.latlng.lat.toFixed(4));
        const lng = parseFloat(e.latlng.lng.toFixed(4));

        if (currentActiveTab === 'map') {
            reverseGeocodePoint(lat, lng, (placeName) => {
                pointLocationOnMap(lat, lng, placeName);
            });
        } else if (currentActiveTab === 'submit') {
            handleMapClickInSubmission(lat, lng);
        }
    });

    renderMapMarkers();
    pointLocationOnMap(-13.1631, -72.5450, "Cusco / Machu Picchu, Perú");

    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 250);
}

function handleMapClickInSubmission(lat, lng) {
    const geomTypeInput = document.getElementById('song-geom-type');
    const geomType = geomTypeInput ? geomTypeInput.value : 'point';

    const latInput = document.getElementById('song-lat');
    const lngInput = document.getElementById('song-lng');
    const coordsMulti = document.getElementById('song-coords-multi');

    if (geomType === 'point') {
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
        tempShapeCoordinates = [];
        if (tempDraftLayer) {
            tempDraftLayer.remove();
            tempDraftLayer = null;
        }
    } else {
        // Línea o Polígono: capturar secuencia de vértices
        tempShapeCoordinates.push([lat, lng]);
        if (coordsMulti) {
            coordsMulti.value = JSON.stringify(tempShapeCoordinates);
        }
        if (latInput && !latInput.value) latInput.value = lat;
        if (lngInput && !lngInput.value) lngInput.value = lng;

        // Visualizar borrador en el mapa
        if (tempDraftLayer) tempDraftLayer.remove();

        if (geomType === 'line') {
            tempDraftLayer = L.polyline(tempShapeCoordinates, {
                color: '#A29BFE',
                weight: 4,
                dashArray: '4, 6'
            }).addTo(map);
        } else if (geomType === 'polygon') {
            tempDraftLayer = L.polygon(tempShapeCoordinates, {
                color: '#6C5CE7',
                fillColor: '#6C5CE7',
                fillOpacity: 0.35,
                weight: 2
            }).addTo(map);
        }
    }
}

/* ==========================================================================
   Capa de Biomas y Ecorregiones (Grupo 1 MoSCoW)
   ========================================================================== */

async function loadBiomesLayer() {
    let geojsonData = null;
    const response = await apiRequest(`${API_BASE}/biomes`);
    if (response && response.features) {
        geojsonData = response;
    } else {
        try {
            const fallbackRes = await fetch('biomes.json');
            if (fallbackRes.ok) geojsonData = await fallbackRes.json();
        } catch (e) {
            console.warn("No se pudo cargar biomes.json localmente:", e);
        }
    }

    if (!geojsonData || !geojsonData.features) return;
    biomesFeaturesData = geojsonData.features;

    biomesGeoJsonLayer = L.geoJSON(geojsonData, {
        style: (feature) => {
            const color = (feature.properties && feature.properties.color) || '#6C5CE7';
            return {
                color: color,
                weight: 2,
                fillColor: color,
                fillOpacity: 0.22,
                dashArray: '2, 4'
            };
        },
        onEachFeature: (feature, layer) => {
            const p = feature.properties || {};
            layer.bindTooltip(`
                <div style="font-family:'Outfit',sans-serif; font-size:0.8rem; line-height:1.35;">
                    <strong style="color:${p.color || '#fff'};">${p.name || 'Bioma'}</strong><br>
                    <span>${p.climate || ''}</span>
                </div>
            `, { sticky: true, opacity: 0.95 });

            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.45, weight: 3 });
                },
                mouseout: (e) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.22, weight: 2 });
                },
                click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    if (map) map.fitBounds(layer.getBounds(), { padding: [40, 40] });
                    updateTerrainInsightCard(
                        p.name,
                        `Altitud: ${p.altitude || 'Diversa'} | Clima: ${p.climate || 'Variable'}`,
                        `${p.acoustic} Tradiciones: ${p.musical_tradition || 'Música regional'}.`,
                        p.name,
                        p.instruments || 'Instrumentos típicos'
                    );
                    showMapTopoBadge(`Bioma explorado: ${p.name}`);
                }
            });
        }
    });

    populateBiomesLegend(biomesFeaturesData);
}

function toggleBiomesLayer(forceState = null) {
    if (!map || !biomesGeoJsonLayer) return;

    if (forceState !== null) {
        isBiomesLayerActive = forceState;
    } else {
        isBiomesLayerActive = !isBiomesLayerActive;
    }

    const floatingBtn = document.getElementById('floating-btn-biomes');
    const legendEl = document.getElementById('biomes-legend');

    if (isBiomesLayerActive) {
        if (!map.hasLayer(biomesGeoJsonLayer)) {
            biomesGeoJsonLayer.addTo(map);
        }
        if (floatingBtn) floatingBtn.classList.add('active');
        if (legendEl) legendEl.classList.remove('hidden');
        showMapTopoBadge("Capa de Biomas y Ecorregiones Activada");
    } else {
        if (map.hasLayer(biomesGeoJsonLayer)) {
            map.removeLayer(biomesGeoJsonLayer);
        }
        if (floatingBtn) floatingBtn.classList.remove('active');
        if (legendEl) legendEl.classList.add('hidden');
    }
}

function populateBiomesLegend(features) {
    const listEl = document.getElementById('biomes-legend-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    features.forEach(feat => {
        const p = feat.properties;
        const chip = document.createElement('div');
        chip.className = 'biome-legend-chip';
        chip.innerHTML = `
            <span class="biome-color-dot" style="background:${p.color};"></span>
            <span class="biome-legend-name" title="${p.name}">${p.name}</span>
        `;
        chip.addEventListener('click', () => {
            const layer = biomesGeoJsonLayer.getLayers().find(l => l.feature === feat);
            if (layer && map) {
                map.fitBounds(layer.getBounds(), { padding: [30, 30] });
                updateTerrainInsightCard(p.name, p.climate, p.acoustic, p.name, p.instruments);
                showMapTopoBadge(p.name);
            }
        });
        listEl.appendChild(chip);
    });

    const closeBtn = document.getElementById('btn-close-biomes-legend');
    if (closeBtn) {
        closeBtn.onclick = () => {
            const legendEl = document.getElementById('biomes-legend');
            if (legendEl) legendEl.classList.add('hidden');
        };
    }
}

/* ==========================================================================
   Iconos y Delimitaciones Geográficas (Puntos, Líneas y Áreas - MoSCoW)
   ========================================================================== */

function extractVideoID(url) {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
}

function createMusicPinIcon(isActive = false, geomType = 'point') {
    let iconSvg = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
        </svg>
    `;

    return L.divIcon({
        className: 'custom-music-pin',
        html: `
            <div class="music-pin-wrapper ${isActive ? 'active' : ''} ${geomType !== 'point' ? 'geom-' + geomType : ''}">
                <div class="music-pin-shadow"></div>
                <div class="music-pin-body">
                    ${iconSvg}
                </div>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
}

function renderMapMarkers() {
    if (!map) return;

    markersMap.forEach(marker => marker.remove());
    markersMap.clear();

    geometriesMap.forEach(layer => layer.remove());
    geometriesMap.clear();

    const approvedSongs = songsDatabase.filter(s => s.status === 'approved');

    approvedSongs.forEach(song => {
        const isSelected = (song.id === selectedSongId);
        const geomType = song.geomType || 'point';

        // 1. Si es Línea o Polígono, dibujar la geometría delimitada en el mapa
        if (song.coordinates && Array.isArray(song.coordinates) && song.coordinates.length > 1) {
            let shapeLayer = null;
            if (geomType === 'line') {
                shapeLayer = L.polyline(song.coordinates, {
                    color: isSelected ? '#A29BFE' : '#6C5CE7',
                    weight: isSelected ? 5 : 3.5,
                    opacity: 0.85,
                    dashArray: '6, 6'
                }).addTo(map);
            } else if (geomType === 'polygon' || geomType === 'area') {
                shapeLayer = L.polygon(song.coordinates, {
                    color: isSelected ? '#A29BFE' : '#6C5CE7',
                    weight: isSelected ? 3 : 2,
                    fillColor: '#6C5CE7',
                    fillOpacity: isSelected ? 0.35 : 0.2
                }).addTo(map);
            }

            if (shapeLayer) {
                shapeLayer.on('click', () => {
                    selectSong(song, false);
                    switchTab('search');
                });
                geometriesMap.set(song.id, shapeLayer);
            }
        }

        // 2. Marcador central de música
        const marker = L.marker([song.lat, song.lng], {
            icon: createMusicPinIcon(isSelected, geomType),
            title: `${song.title} - ${song.artist}`
        }).addTo(map);

        const videoId = extractVideoID(song.ytLink);
        const embedHtml = videoId
            ? `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
            : `<p style="color:var(--danger); font-size:0.8rem;">Enlace no disponible</p>`;

        const geomBadge = geomType === 'line'
            ? `<span class="admin-badge-geom" style="margin-bottom:0.3rem;"><i data-lucide="git-commit"></i> Línea / Río</span>`
            : (geomType === 'polygon' ? `<span class="admin-badge-geom" style="margin-bottom:0.3rem;"><i data-lucide="hexagon"></i> Territorio Delimitado</span>` : '');

        const terrainHtml = song.terrain ? `<p style="font-size:0.8rem; color:#A29BFE; margin-bottom:0.2rem;"><strong>Relieve:</strong> ${song.terrain}</p>` : '';
        const biomeHtml = song.biome ? `<p style="font-size:0.8rem; color:#10B981; margin-bottom:0.3rem;"><strong>Bioma:</strong> ${song.biome}</p>` : '';

        const popupContent = `
            <div class="popup-content">
                ${embedHtml}
                ${geomBadge}
                <h3>${song.title}</h3>
                <p><strong>Artista:</strong> ${song.artist}</p>
                ${terrainHtml}
                ${biomeHtml}
                <p>${song.context}</p>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 320,
            className: 'custom-leaflet-popup'
        });

        marker.on('click', () => {
            selectSong(song, false);
            switchTab('search');
        });

        markersMap.set(song.id, marker);
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        lucide.createIcons();
    }
}

/* ==========================================================================
   Buscador de Localidades Geográficas y Cálculo de Cercanías
   ========================================================================== */

const mapLocationInput = document.getElementById('map-location-input');
const mapLocationSearchBtn = document.getElementById('map-location-search-btn');

function initMapLocationSearch() {
    if (!mapLocationSearchBtn || !mapLocationInput) return;

    const executeLocationSearch = () => {
        const query = mapLocationInput.value.trim();
        if (!query) return;

        geocodeLocation(query, (lat, lng, formattedAddress) => {
            if (lat !== null && lng !== null) {
                if (map) {
                    map.flyTo([lat, lng], 8, { duration: 1.5 });
                }
                pointLocationOnMap(lat, lng, formattedAddress);
            } else {
                alert(`No se pudo encontrar la localidad "${query}". Intenta apuntar directamente sobre el mapa.`);
            }
        });
    };

    mapLocationSearchBtn.addEventListener('click', executeLocationSearch);
    mapLocationInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeLocationSearch();
        }
    });
}

function geocodeLocation(query, callback) {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                callback(parseFloat(data[0].lat), parseFloat(data[0].lon), data[0].display_name.split(',').slice(0, 3).join(', '));
            } else {
                callback(null, null, null);
            }
        })
        .catch(() => callback(null, null, null));
}

function reverseGeocodePoint(lat, lng, callback) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`)
        .then(res => res.json())
        .then(data => {
            if (data && data.address) {
                const addr = data.address;
                const city = addr.city || addr.town || addr.village || addr.county || addr.state || '';
                const country = addr.country || '';
                const name = (city && country) ? `${city}, ${country}` : (data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
                callback(name);
            } else {
                callback(`Punto: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
            }
        })
        .catch(() => callback(`Punto: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`));
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

function pointLocationOnMap(lat, lng, placeName) {
    const localityNameEl = document.getElementById('locality-name');
    const localityLatEl = document.getElementById('map-locality-lat');
    const localityLngEl = document.getElementById('map-locality-lng');
    const localityLatFill = document.getElementById('map-locality-lat-fill');
    const localityLngFill = document.getElementById('map-locality-lng-fill');

    if (localityNameEl) localityNameEl.textContent = placeName || "Punto seleccionado";
    if (localityLatEl) localityLatEl.textContent = `${formatCoordinate(lat)}°`;
    if (localityLngEl) localityLngEl.textContent = `${formatCoordinate(lng)}°`;

    const latPct = Math.min(100, Math.max(10, ((lat + 60) / 90) * 100));
    const lngPct = Math.min(100, Math.max(10, ((lng + 120) / 90) * 100));
    if (localityLatFill) localityLatFill.style.width = `${latPct}%`;
    if (localityLngFill) localityLngFill.style.width = `${lngPct}%`;

    if (map) {
        if (pointedLocationMarker) {
            pointedLocationMarker.remove();
        }
        const radarIcon = L.divIcon({
            className: 'pointed-location-radar',
            html: `
                <div class="radar-pulse-ring"></div>
                <div class="radar-center-dot"></div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });
        pointedLocationMarker = L.marker([lat, lng], { icon: radarIcon }).addTo(map);
    }

    renderLocalityAssociatedSongs(lat, lng);
}

function renderLocalityAssociatedSongs(targetLat, targetLng) {
    const localitySongsList = document.getElementById('locality-songs-list');
    const localitySongsCount = document.getElementById('locality-songs-count');
    if (!localitySongsList) return;

    localitySongsList.innerHTML = '';
    const approved = songsDatabase.filter(s => s.status === 'approved');

    const withDistance = approved.map(song => ({
        ...song,
        distanceKm: calculateDistanceKm(targetLat, targetLng, song.lat, song.lng)
    })).sort((a, b) => a.distanceKm - b.distanceKm);

    const associated = withDistance.filter(s => s.distanceKm <= 850);

    if (localitySongsCount) {
        localitySongsCount.textContent = `${associated.length} encontradas`;
    }

    if (associated.length === 0) {
        localitySongsList.innerHTML = `
            <div class="locality-empty-state">
                <i data-lucide="compass"></i>
                <p>No hay canciones registradas en un radio cercano de esta posición.</p>
                <button class="btn-primary" style="margin-top:0.8rem; font-size:0.8rem;" onclick="prefillContributionCoordinates(${targetLat}, ${targetLng})">
                    <i data-lucide="plus"></i> Aportar canción aquí
                </button>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    associated.forEach(song => {
        const card = document.createElement('div');
        card.className = 'locality-song-card';
        const distLabel = song.distanceKm < 30 ? 'En esta localidad' : `Aprox. a ${song.distanceKm} km`;

        card.innerHTML = `
            <div class="locality-song-info">
                <h4>${song.title}</h4>
                <p class="locality-song-artist">${song.artist}</p>
                <span class="locality-song-distance">${distLabel} &bull; ${song.terrain || song.biome || 'Relieve'}</span>
            </div>
            <button class="btn-locality-fly" title="Ver detalle de canción">
                <i data-lucide="arrow-right"></i>
            </button>
        `;

        card.addEventListener('click', () => {
            selectSong(song, true);
            switchTab('search');
        });

        localitySongsList.appendChild(card);
    });

    lucide.createIcons();
}

window.prefillContributionCoordinates = (lat, lng) => {
    switchTab('submit');
    const latInput = document.getElementById('song-lat');
    const lngInput = document.getElementById('song-lng');
    const titleInput = document.getElementById('song-title');
    if (latInput) latInput.value = lat;
    if (lngInput) lngInput.value = lng;
    if (titleInput) titleInput.focus();
};

/* ==========================================================================
   Búsqueda, Filtros Rápidos y Carrusel de Etiquetas (MoSCoW)
   ========================================================================== */

const searchInput = document.getElementById('song-search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
const suggestionsDropdown = document.getElementById('search-suggestions');
const songDetailContainer = document.getElementById('song-detail-container');
const quickFilters = document.querySelectorAll('.filter-pill');
const quickFiltersContainer = document.getElementById('quick-terrain-filters');
const btnScrollLeft = document.getElementById('filters-scroll-left');
const btnScrollRight = document.getElementById('filters-scroll-right');

function initFilterCarousel() {
    if (!quickFiltersContainer) return;

    if (btnScrollLeft) {
        btnScrollLeft.addEventListener('click', () => {
            quickFiltersContainer.scrollBy({ left: -140, behavior: 'smooth' });
        });
    }

    if (btnScrollRight) {
        btnScrollRight.addEventListener('click', () => {
            quickFiltersContainer.scrollBy({ left: 140, behavior: 'smooth' });
        });
    }

    quickFilters.forEach(pill => {
        pill.addEventListener('click', () => {
            quickFilters.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');
            applyFilterToSearch(filter);
        });
    });
}

function applyFilterToSearch(filter) {
    if (!searchInput) return;

    if (filter === 'all') {
        searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.add('hidden');
        renderSuggestions('');
        hideSuggestions();
    } else {
        searchInput.value = filter;
        if (searchClearBtn) searchClearBtn.classList.remove('hidden');
        renderSuggestions(filter);
    }
}

function initSearchFeature() {
    initFilterCarousel();

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (searchClearBtn) {
            searchClearBtn.classList.toggle('hidden', query === '');
        }
        renderSuggestions(query);
    });

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchClearBtn.classList.add('hidden');
            hideSuggestions();
            searchInput.focus();
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            hideSuggestions();
        }
    });
}

function renderSuggestions(query) {
    if (!suggestionsDropdown) return;

    if (!query) {
        hideSuggestions();
        return;
    }

    const q = query.toLowerCase();
    const approved = songsDatabase.filter(s => s.status === 'approved');

    const matches = approved.filter(s => {
        const titleMatch = s.title.toLowerCase().includes(q);
        const artistMatch = s.artist.toLowerCase().includes(q);
        const localityMatch = (s.locality || '').toLowerCase().includes(q);
        const terrainMatch = (s.terrain || '').toLowerCase().includes(q);
        const biomeMatch = (s.biome || '').toLowerCase().includes(q);
        const tagsMatch = Array.isArray(s.tags) ? s.tags.some(t => t.toLowerCase().includes(q)) : (s.tags || '').toLowerCase().includes(q);

        return titleMatch || artistMatch || localityMatch || terrainMatch || biomeMatch || tagsMatch;
    });

    if (matches.length === 0) {
        suggestionsDropdown.innerHTML = `<div class="suggestion-item empty">No se encontraron canciones para "${query}"</div>`;
        suggestionsDropdown.classList.remove('hidden');
        return;
    }

    suggestionsDropdown.innerHTML = '';
    matches.forEach(song => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';

        const geomLabel = song.geomType === 'line' ? 'Línea' : (song.geomType === 'polygon' ? 'Área' : 'Punto');

        item.innerHTML = `
            <div class="suggestion-info">
                <h4>${song.title}</h4>
                <p>${song.artist} &bull; ${song.locality || song.terrain || 'América Latina'}</p>
            </div>
            <span class="badge approved" style="font-size:0.68rem;">${geomLabel}</span>
        `;

        item.addEventListener('click', () => {
            selectSong(song, true);
            hideSuggestions();
        });

        suggestionsDropdown.appendChild(item);
    });

    suggestionsDropdown.classList.remove('hidden');
}

function hideSuggestions() {
    if (suggestionsDropdown) suggestionsDropdown.classList.add('hidden');
}

/* ==========================================================================
   Detalle de Canción, Video y Espacio de Discusión (RS-05 MoSCoW Grupo 4)
   ========================================================================== */

function selectSong(song, shouldFlyTo = true) {
    selectedSongId = song.id;

    if (shouldFlyTo && map) {
        focusSongOnMap(song.id);
    }

    const videoId = extractVideoID(song.ytLink);
    const embedHtml = videoId
        ? `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
        : `<p style="color:var(--danger); font-size:0.85rem; padding:0.5rem 0;">Enlace de YouTube no válido</p>`;

    const latPercent = Math.min(100, Math.max(10, ((song.lat + 60) / 90) * 100));
    const lngPercent = Math.min(100, Math.max(10, ((song.lng + 120) / 90) * 100));

    // Badges de Geometría
    let geomBadgeHtml = '';
    if (song.geomType === 'line') {
        geomBadgeHtml = `<span class="admin-badge-geom"><i data-lucide="git-commit"></i> Delimitación Lineal (Ruta/Río)</span>`;
    } else if (song.geomType === 'polygon' || song.geomType === 'area') {
        geomBadgeHtml = `<span class="admin-badge-geom"><i data-lucide="hexagon"></i> Área Territorial Delimitada</span>`;
    } else {
        geomBadgeHtml = `<span class="admin-badge-geom"><i data-lucide="map-pin"></i> Ubicación Puntual</span>`;
    }

    // Bioma Badge
    const biomeHtml = song.biome
        ? `<span class="badge-biome"><i data-lucide="trees"></i> ${song.biome}</span>`
        : '';

    // Tags Chips
    let tagsList = Array.isArray(song.tags) ? song.tags : (song.tags ? song.tags.split(',') : []);
    const tagsHtml = tagsList.length > 0
        ? `<div class="tags-container">
            ${tagsList.map(t => `<span class="tag-pill" onclick="applyFilterToSearch('${t.trim()}')">#${t.trim()}</span>`).join('')}
           </div>`
        : '';

    // Utilidad pedagógica
    const pedagogicalHtml = song.pedagogicalUse
        ? `<div class="admin-pedagogical-box">
             <strong>Utilidad Pedagógica (RS-02):</strong> ${song.pedagogicalUse}
           </div>`
        : '';

    songDetailContainer.innerHTML = `
        <div class="selected-song-card">
            <div class="song-card-header">
                <div>
                    <h3 class="song-card-title">${song.title}</h3>
                    <span class="song-card-artist">${song.artist}</span>
                </div>
                ${geomBadgeHtml}
            </div>

            ${embedHtml}

            <div style="display:flex; align-items:center; gap:0.5rem; margin:0.6rem 0; flex-wrap:wrap;">
                ${biomeHtml}
                ${song.terrain ? `<span class="badge" style="background:rgba(162,155,254,0.15); color:var(--primary-light);"><i data-lucide="mountain"></i> ${song.terrain}</span>` : ''}
            </div>

            ${tagsHtml}

            <div class="mini-bars-container">
                <div class="mini-bar mini-bar-lat">
                    <span class="mini-bar-label"><i data-lucide="navigation"></i> Latitud</span>
                    <span class="mini-bar-value">${formatCoordinate(song.lat)}°</span>
                    <div class="mini-bar-track">
                        <div class="mini-bar-fill" style="width: ${latPercent}%;"></div>
                    </div>
                </div>

                <div class="mini-bar mini-bar-lng">
                    <span class="mini-bar-label"><i data-lucide="globe"></i> Longitud</span>
                    <span class="mini-bar-value">${formatCoordinate(song.lng)}°</span>
                    <div class="mini-bar-track">
                        <div class="mini-bar-fill" style="width: ${lngPercent}%;"></div>
                    </div>
                </div>
            </div>

            <div class="context-box">
                <div class="context-box-header">
                    <i data-lucide="book-open"></i>
                    <span>Contexto Territorial y Cultural (RS-02)</span>
                </div>
                <p class="context-box-text">${song.context}</p>
            </div>

            ${pedagogicalHtml}

            <div class="song-card-actions">
                <button class="btn-focus-song" onclick="focusSongOnMap(${song.id})">
                    <i data-lucide="crosshair"></i> Centrar en el Mapa
                </button>
                <button class="btn-focus-song" onclick="focusSongTerrainTopography(${song.id})" style="background: rgba(108, 92, 231, 0.2); border-color: rgba(108, 92, 231, 0.45); color: var(--primary-light);">
                    <i data-lucide="mountain-snow"></i> Relieve
                </button>
            </div>

            <!-- Espacio de Discusión y Comentarios de Usuarios (RS-05 / Grupo 4 MoSCoW) -->
            <div class="song-discussion-section">
                <div class="discussion-header">
                    <span class="discussion-title">
                        <i data-lucide="message-square"></i> Espacio de Discusión
                    </span>
                    <span class="badge approved" id="comments-count-${song.id}">Cargando...</span>
                </div>

                <div class="discussion-comments-list" id="comments-list-${song.id}">
                    <p style="font-size:0.75rem; color:var(--text-muted); padding:0.5rem 0;">Cargando aportes comunitarios...</p>
                </div>

                <form class="comment-new-form" id="comment-form-${song.id}">
                    <div class="comment-inputs-row">
                        <input type="text" class="comment-input-author" placeholder="Tu nombre..." required>
                        <select class="comment-input-role">
                            <option value="Docente">Docente</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="Investigador">Investigador</option>
                            <option value="Comunidad">Comunidad</option>
                        </select>
                    </div>
                    <textarea class="comment-textarea" rows="2" placeholder="Aporta una observación pedagógica, detalle geográfico o cultural..." required></textarea>
                    <button type="submit" class="btn-send-comment">
                        <i data-lucide="send"></i> Publicar Comentario
                    </button>
                </form>
            </div>
        </div>
    `;

    lucide.createIcons();
    loadSongComments(song.id);
    setupCommentForm(song.id);
}

async function loadSongComments(songId) {
    const listEl = document.getElementById(`comments-list-${songId}`);
    const countEl = document.getElementById(`comments-count-${songId}`);
    if (!listEl) return;

    let comments = [];
    const data = await apiRequest(`${API_BASE}/songs/${songId}/comments`);
    if (data && data.success && Array.isArray(data.comments)) {
        comments = data.comments;
    } else {
        // Fallback local
        const local = JSON.parse(localStorage.getItem(`atlas_comments_${songId}`) || '[]');
        comments = local;
    }

    if (countEl) countEl.textContent = `${comments.length} aportes`;

    if (comments.length === 0) {
        listEl.innerHTML = `<p style="font-size:0.76rem; color:var(--text-muted); padding:0.6rem 0;">Sé el primero en iniciar la discusión pedagógica sobre esta canción.</p>`;
        return;
    }

    listEl.innerHTML = comments.map(c => `
        <div class="discussion-comment-item">
            <div class="comment-meta">
                <div>
                    <span class="comment-author">${c.author}</span>
                    <span class="comment-role">${c.role || 'Usuario'}</span>
                </div>
                <span class="comment-date">${c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Reciente'}</span>
            </div>
            <p class="comment-body">${c.content}</p>
        </div>
    `).join('');
}

function setupCommentForm(songId) {
    const form = document.getElementById(`comment-form-${songId}`);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const author = form.querySelector('.comment-input-author').value.trim();
        const role = form.querySelector('.comment-input-role').value;
        const content = form.querySelector('.comment-textarea').value.trim();

        if (!content) return;

        // Intentar publicar en el Backend REST
        const res = await apiRequest(`${API_BASE}/songs/${songId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, role, content })
        });

        // Guardar también en fallback localStorage
        const localKey = `atlas_comments_${songId}`;
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
        existing.push({ author, role, content, createdAt: new Date().toISOString() });
        localStorage.setItem(localKey, JSON.stringify(existing));

        form.reset();
        loadSongComments(songId);
    });
}

window.focusSongOnMap = (id) => {
    const song = songsDatabase.find(s => s.id === id);
    if (!song || !map) return;

    // Si tiene geometría de línea o polígono, encuadrar la delimitación
    const shape = geometriesMap.get(id);
    if (shape) {
        map.fitBounds(shape.getBounds(), { padding: [60, 60], maxZoom: 12 });
    } else {
        map.flyTo([song.lat, song.lng], 8, { duration: 1.5 });
    }

    markersMap.forEach((marker, sId) => {
        marker.setIcon(createMusicPinIcon(sId === song.id, song.geomType));
    });

    const marker = markersMap.get(song.id);
    if (marker) {
        setTimeout(() => marker.openPopup(), 600);
    }
};

/* ==========================================================================
   Modos Visuales del Mapa (Relieve, Biomas, Satelital, Nocturno, Estándar)
   ========================================================================== */

function setMapVisualMode(mode, showFeedback = true) {
    currentMapMode = mode;
    localStorage.setItem('atlas_map_mode', mode);

    if (mode === 'biomes') {
        // En modo biomas, activar la base satelital y la capa temática de biomas
        if (tileLayers.hybrid && map) {
            if (currentBaseLayer && map.hasLayer(currentBaseLayer)) map.removeLayer(currentBaseLayer);
            currentBaseLayer = tileLayers.hybrid;
            map.addLayer(currentBaseLayer);
        }
        toggleBiomesLayer(true);
    } else {
        if (map && tileLayers[mode]) {
            if (currentBaseLayer && map.hasLayer(currentBaseLayer)) {
                map.removeLayer(currentBaseLayer);
            }
            currentBaseLayer = tileLayers[mode];
            map.addLayer(currentBaseLayer);
        }
    }

    document.querySelectorAll('.map-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-map-mode') === mode);
    });

    const floatingBtnTopo = document.getElementById('floating-btn-topo');
    const floatingTopoText = document.getElementById('floating-topo-text');

    if (mode === 'terrain') {
        if (floatingBtnTopo) floatingBtnTopo.classList.add('active');
        if (floatingTopoText) floatingTopoText.textContent = "Relieve Topográfico (Activo)";
        if (showFeedback) showMapTopoBadge("Modo Topográfico: Curvas de nivel y relieve activas");
    } else {
        if (floatingBtnTopo) floatingBtnTopo.classList.remove('active');
        if (floatingTopoText) floatingTopoText.textContent = "Vista Topográfica";
        if (showFeedback) {
            if (mode === 'dark') showMapTopoBadge("Modo Nocturno Cartográfico Activo");
            else if (mode === 'hybrid') showMapTopoBadge("Modo Satelital Activo");
            else if (mode === 'roadmap') showMapTopoBadge("Modo Estándar OpenStreetMap");
        }
    }

    lucide.createIcons();
}

function showMapTopoBadge(text, duration = 3500) {
    const badge = document.getElementById('map-topo-badge');
    const badgeText = document.getElementById('map-topo-badge-text');
    if (!badge || !badgeText) return;

    badgeText.textContent = text;
    badge.classList.remove('hidden');
    lucide.createIcons();

    clearTimeout(topoBadgeTimeout);
    topoBadgeTimeout = setTimeout(() => {
        badge.classList.add('hidden');
    }, duration);
}

function updateTerrainInsightCard(name, elevation, description, terrainType, acousticImpact) {
    const nameEl = document.getElementById('terrain-active-name');
    const elevEl = document.getElementById('terrain-active-elevation');
    const descEl = document.getElementById('terrain-active-desc');
    const typeEl = document.getElementById('terrain-metric-type');
    const acousticEl = document.getElementById('terrain-metric-acoustic');

    if (nameEl) nameEl.textContent = name;
    if (elevEl) elevEl.textContent = elevation;
    if (descEl) descEl.textContent = description;
    if (typeEl) typeEl.textContent = terrainType;
    if (acousticEl) acousticEl.textContent = acousticImpact;
}

window.focusSongTerrainTopography = (songId) => {
    const song = songsDatabase.find(s => s.id === songId);
    if (!song) return;

    setMapVisualMode('terrain', false);

    if (map) {
        map.flyTo([song.lat, song.lng], 10, { duration: 1.5 });
        const marker = markersMap.get(song.id);
        if (marker) setTimeout(() => marker.openPopup(), 700);
    }

    showMapTopoBadge(`Relieve: ${song.terrain || 'Topografía'} — ${song.title}`);
    updateTerrainInsightCard(
        `${song.terrain || 'Terreno Geográfico'} — ${song.locality}`,
        `Coordenadas: ${formatCoordinate(song.lat)}°, ${formatCoordinate(song.lng)}°`,
        song.context,
        song.terrain || 'Relieve Local',
        `${song.title} (${song.artist})`
    );
};

function initTerrainFeature() {
    document.querySelectorAll('.map-type-btn[data-map-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            setMapVisualMode(btn.getAttribute('data-map-mode'));
        });
    });

    const floatingBtnTopo = document.getElementById('floating-btn-topo');
    if (floatingBtnTopo) {
        floatingBtnTopo.addEventListener('click', () => {
            setMapVisualMode(currentMapMode === 'terrain' ? 'dark' : 'terrain');
        });
    }

    const floatingBtnBiomes = document.getElementById('floating-btn-biomes');
    if (floatingBtnBiomes) {
        floatingBtnBiomes.addEventListener('click', () => {
            toggleBiomesLayer();
        });
    }
}

const latinAmericaTerrainPresets = [
    {
        id: "altiplano",
        name: "Altiplano y Cordillera de los Andes",
        elevation: "3.200 - 4.800 m.s.n.m.",
        region: "Cusco, Machu Picchu, Titicaca (Perú / Bolivia)",
        terrainType: "Altiplano / Cordillera",
        acousticImpact: "Ecos de montaña, sikus y zampoñas de viento",
        center: { lat: -13.1631, lng: -72.5450 },
        zoom: 9,
        description: "Meseta de altura y serranías andinas. El relieve agreste y la baja densidad sonora inspiraron melodías pentatónicas de viento (quenas, zampoñas) y cantos ceremoniales de devoción a la Pachamama y los Apus.",
        songTitle: "Sube a Nacer Conmigo Hermano"
    },
    {
        id: "valles-calchaquies",
        name: "Valles Calchaquíes y Quebradas",
        elevation: "1.200 - 2.800 m.s.n.m.",
        region: "Salta, Cafayate, Cachi, Tucumán (Argentina)",
        terrainType: "Valles Calchaquíes",
        acousticImpact: "Coplas de garganta profunda y caja chayera",
        center: { lat: -24.7821, lng: -65.4232 },
        zoom: 9,
        description: "Profundas quebradas de areniscas rojizas y valles serranos áridos. El eco resonante entre paredones rocosos acompaña la zamba y la copla bagualera, expresando la soledad del gaucho y la inmensidad del paisaje.",
        songTitle: "Zamba de mi Esperanza"
    },
    {
        id: "atacama",
        name: "Desierto de Atacama y Pampa Salitrera",
        elevation: "0 - 2.400 m.s.n.m.",
        region: "Tarapacá y Antofagasta (Chile)",
        terrainType: "Desierto Hiperárido",
        acousticImpact: "Silencio absoluto, bronces de La Tirana y bandas de cofradía",
        center: { lat: -21.8000, lng: -69.5000 },
        zoom: 8,
        description: "El desierto más árido del planeta. La aridez extrema y la historia de las salitreras forjaron la música de protesta social y las grandes comparsas de bronces devocionales.",
        songTitle: "La Jardinera / Arriba Quemando el Sol"
    },
    {
        id: "rio-uruguay",
        name: "Cuenca Fluvial del Río Uruguay",
        elevation: "0 - 150 m.s.n.m.",
        region: "Litoral Fluvial (Argentina / Uruguay / Brasil)",
        terrainType: "Cuenca Fluvial / Ribera",
        acousticImpact: "Sonido del agua, chamamé y guarania en guitarra y acordeón",
        center: { lat: -31.3900, lng: -58.0100 },
        zoom: 8,
        description: "Rutas fluviales vitales que conectan pueblos ribereños. La canoa, la pesca y la corriente moldean ritmos ondulantes en compás de 6/8.",
        songTitle: "Río de los Pájaros Pintados"
    },
    {
        id: "cienegas-magdalena",
        name: "Ciénagas y Depresión Momposina",
        elevation: "10 - 80 m.s.n.m.",
        region: "Bolívar, Magdalena (Colombia)",
        terrainType: "Humedal / Ciénaga",
        acousticImpact: "Polirritmia de tamboras, llamador y gaitas de cardón",
        center: { lat: 9.2400, lng: -74.4200 },
        zoom: 9,
        description: "Ecosistema anfibio de llanuras aluviales inundables. La cadencia del agua y la noche sobre la ciénaga inspiraron el nacimiento de la cumbia original.",
        songTitle: "El Pescador"
    },
    {
        id: "valle-costero",
        name: "Valle Costero y Desierto del Rímac",
        elevation: "0 - 450 m.s.n.m.",
        region: "Lima, Cuenca del Río Rímac (Perú)",
        terrainType: "Valle Costero",
        acousticImpact: "Guitarras criollas, cajón de madera y marinera",
        center: { lat: -12.0464, lng: -77.0428 },
        zoom: 10,
        description: "Planicie aluvial y oasis costero regado por el río Rímac que baja veloz de la cordillera. Inspiró el florecimiento del vals criollo, la lírica de alamedas y puentes virreinales.",
        songTitle: "La Flor de la Canela"
    }
];

function renderTerrainPresets() {
    const container = document.getElementById('terrain-presets-list');
    if (!container) return;

    container.innerHTML = '';

    latinAmericaTerrainPresets.forEach(preset => {
        const card = document.createElement('div');
        card.className = 'terrain-preset-card';
        card.id = `preset-${preset.id}`;

        card.innerHTML = `
            <div class="terrain-preset-top">
                <span class="terrain-preset-name">
                    <i data-lucide="mountain"></i> ${preset.name}
                </span>
                <span class="terrain-preset-elev">${preset.elevation}</span>
            </div>
            <span class="terrain-preset-region">${preset.region}</span>
            <div class="terrain-preset-songs">
                <span>Canción: <strong>${preset.songTitle}</strong></span>
                <span>Explorar relieve &rarr;</span>
            </div>
        `;

        card.addEventListener('click', () => {
            document.querySelectorAll('.terrain-preset-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            setMapVisualMode('terrain', false);
            if (map) {
                map.flyTo([preset.center.lat, preset.center.lng], preset.zoom, { duration: 1.5 });
            }

            updateTerrainInsightCard(
                preset.name,
                `Elevación: ${preset.elevation}`,
                preset.description,
                preset.terrainType,
                preset.acousticImpact
            );

            showMapTopoBadge(`Explorando relieve: ${preset.name}`);
        });

        container.appendChild(card);
    });

    lucide.createIcons();
}

/* ==========================================================================
   Navegación, Barra Lateral y Vistas (Tabs)
   ========================================================================== */

const railBtns = document.querySelectorAll('.rail-btn[data-tab]');
const panelSections = document.querySelectorAll('.panel-section');
const sidebarDual = document.getElementById('sidebar-dual');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const btnToggleDock = document.getElementById('btn-toggle-dock');
const btnToggleExpand = document.getElementById('btn-toggle-expand');
const sidebarResizer = document.getElementById('sidebar-resizer');
const categoryPanel = document.getElementById('category-panel');
const appContainer = document.querySelector('.app-container');

function updateSidebarButtonsUI() {
    const isDockRight = appContainer && appContainer.classList.contains('dock-right');
    const isCollapsed = sidebarDual && sidebarDual.classList.contains('collapsed');
    const currentWidth = categoryPanel ? (categoryPanel.offsetWidth || 380) : 380;
    const isExpanded = currentWidth >= 500;

    if (btnToggleDock) {
        btnToggleDock.classList.toggle('active', isDockRight);
        const dockTitle = isDockRight ? "Mover menú a la izquierda" : "Mover menú a la derecha";
        btnToggleDock.title = dockTitle;
        btnToggleDock.innerHTML = `<i data-lucide="arrow-left-right"></i><span class="rail-tooltip" id="dock-tooltip">${dockTitle}</span>`;
    }

    if (btnToggleExpand) {
        btnToggleExpand.classList.toggle('active', isExpanded);
        const expandTitle = isExpanded ? "Contraer ancho del menú" : "Expandir ancho del menú";
        btnToggleExpand.title = expandTitle;
        const expandIcon = isExpanded ? 'minimize-2' : 'maximize-2';
        btnToggleExpand.innerHTML = `<i data-lucide="${expandIcon}"></i><span class="rail-tooltip" id="expand-tooltip">${expandTitle}</span>`;
    }

    if (btnToggleSidebar) {
        btnToggleSidebar.classList.toggle('active', isCollapsed);
        const collapseTitle = isCollapsed ? "Mostrar menú lateral" : "Ocultar menú lateral";
        btnToggleSidebar.title = collapseTitle;
        const collapseIcon = isDockRight
            ? (isCollapsed ? 'panel-right-open' : 'panel-right-close')
            : (isCollapsed ? 'panel-left-open' : 'panel-left-close');
        btnToggleSidebar.innerHTML = `<i data-lucide="${collapseIcon}"></i><span class="rail-tooltip" id="collapse-tooltip">${collapseTitle}</span>`;
    }

    lucide.createIcons();
}

function toggleSidebarCollapse() {
    if (!sidebarDual) return;
    sidebarDual.classList.toggle('collapsed');
    updateSidebarButtonsUI();
    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 280);
}

function toggleSidebarDock() {
    if (!appContainer) return;
    const isDockRight = !appContainer.classList.contains('dock-right');
    appContainer.classList.toggle('dock-right', isDockRight);
    localStorage.setItem('atlas_dock_right', isDockRight ? 'true' : 'false');
    updateSidebarButtonsUI();
    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 280);
}

function toggleSidebarWidth() {
    if (!categoryPanel) return;
    const currentWidth = categoryPanel.offsetWidth || 380;
    const targetWidth = currentWidth >= 500 ? 380 : 560;
    applySidebarWidth(targetWidth, true);
}

function applySidebarWidth(widthPx, smooth = true) {
    if (!categoryPanel) return;
    const maxAllowed = Math.min(window.innerWidth - 120, 850);
    const clampedWidth = Math.max(260, Math.min(widthPx, maxAllowed));

    categoryPanel.style.transition = smooth ? 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none';
    categoryPanel.style.width = `${clampedWidth}px`;
    localStorage.setItem('atlas_sidebar_width', clampedWidth);

    updateSidebarButtonsUI();
}

function initNavigation() {
    railBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebarCollapse();
        });
    }

    if (btnToggleDock) {
        btnToggleDock.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebarDock();
        });
    }

    try {
        const isDockRight = localStorage.getItem('atlas_dock_right') === 'true';
        if (isDockRight && appContainer) appContainer.classList.add('dock-right');
    } catch (e) { }

    if (btnToggleExpand) {
        btnToggleExpand.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebarWidth();
        });
    }

    try {
        const savedWidth = localStorage.getItem('atlas_sidebar_width');
        if (savedWidth) applySidebarWidth(parseInt(savedWidth, 10), false);
    } catch (e) { }

    if (sidebarResizer && categoryPanel) {
        let isDragging = false;
        const railEl = document.querySelector('.icon-rail');
        const resizerBadge = document.getElementById('resizer-live-badge');

        const onPointerDown = (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            e.preventDefault();
            isDragging = true;
            document.body.classList.add('is-resizing');
            sidebarResizer.classList.add('resizing');
            categoryPanel.classList.add('no-transition');
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const railWidth = railEl ? railEl.offsetWidth : 68;
            const isDockRight = appContainer && appContainer.classList.contains('dock-right');
            const targetWidth = isDockRight
                ? window.innerWidth - e.clientX - railWidth
                : e.clientX - railWidth;

            applySidebarWidth(targetWidth, false);

            if (resizerBadge) {
                const currentW = Math.round(parseFloat(categoryPanel.style.width) || targetWidth);
                resizerBadge.textContent = `↔ ${currentW}px`;
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;
            document.body.classList.remove('is-resizing');
            sidebarResizer.classList.remove('resizing');
            categoryPanel.classList.remove('no-transition');

            if (resizerBadge) resizerBadge.textContent = '↔ Ajustar ancho';

            applySidebarWidth(categoryPanel.offsetWidth || 380, true);
            if (map) map.invalidateSize();
        };

        sidebarResizer.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);

        sidebarResizer.addEventListener('dblclick', (e) => {
            e.preventDefault();
            toggleSidebarWidth();
        });
    }

    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
        brandLogo.addEventListener('click', () => switchTab('search'));
    }

    const btnResetView = document.getElementById('btn-reset-map-view');
    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            if (map) {
                map.flyTo([-18, -65], 4, { duration: 1.4 });
                map.closePopup();
            }
        });
    }

    updateSidebarButtonsUI();
}

function switchTab(tabId) {
    currentActiveTab = tabId;

    if (sidebarDual && sidebarDual.classList.contains('collapsed')) {
        sidebarDual.classList.remove('collapsed');
        updateSidebarButtonsUI();
    }

    railBtns.forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });

    panelSections.forEach(section => {
        section.classList.toggle('active', section.id === `section-${tabId}`);
    });

    if (tabId === 'admin') {
        renderAdminList();
    } else if (tabId === 'terrain') {
        renderTerrainPresets();
        setMapVisualMode('terrain', true);
    } else if (tabId === 'search') {
        setTimeout(() => searchInput && searchInput.focus(), 150);
    }
}

/* Formulario de Contribuciones (RS-02 MoSCoW: YouTube, Bioma, Geometría, Tags) */

const songForm = document.getElementById('song-form');
const formMessage = document.getElementById('form-message');
const adminCardsList = document.getElementById('admin-cards-list');
const pendingCountBadge = document.getElementById('pending-count-badge');

function initSubmissionForm() {
    if (!songForm) return;

    // Selector de tipo de delimitación (Punto, Línea, Área)
    const geomBtns = document.querySelectorAll('.geom-btn');
    const geomInput = document.getElementById('song-geom-type');
    const geomHint = document.getElementById('geom-hint-text');
    const coordsMultiGroup = document.getElementById('coords-multi-group');

    geomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            geomBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const gType = btn.getAttribute('data-geom');
            if (geomInput) geomInput.value = gType;

            if (gType === 'point') {
                if (geomHint) geomHint.textContent = 'Representación puntual de una ciudad, poblado o sitio específico.';
                if (coordsMultiGroup) coordsMultiGroup.classList.add('hidden');
            } else if (gType === 'line') {
                if (geomHint) geomHint.textContent = 'Trazado continuo que representa un río, trayecto migratorio o ruta cultural.';
                if (coordsMultiGroup) coordsMultiGroup.classList.remove('hidden');
            } else if (gType === 'polygon') {
                if (geomHint) geomHint.textContent = 'Área o polígono cerrado para cuencas hidrográficas, valles o zonas territoriales.';
                if (coordsMultiGroup) coordsMultiGroup.classList.remove('hidden');
            }
        });
    });

    songForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const geomType = geomInput ? geomInput.value : 'point';
        const coordsMultiVal = document.getElementById('song-coords-multi') ? document.getElementById('song-coords-multi').value.trim() : '';

        let parsedCoordinates = null;
        if (geomType !== 'point' && coordsMultiVal) {
            try {
                parsedCoordinates = JSON.parse(coordsMultiVal);
            } catch (err) {
                alert("Las coordenadas del trazado deben ser un arreglo JSON válido (ej: [[-31.39, -58.01], [-32.48, -58.23]]). Haz clic sobre el mapa para capturarlas automáticamente.");
                return;
            }
        }

        const tagsRaw = document.getElementById('song-tags') ? document.getElementById('song-tags').value : '';
        const tagsArray = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

        const newSong = {
            title: document.getElementById('song-title').value.trim(),
            artist: document.getElementById('song-artist').value.trim(),
            locality: document.getElementById('song-locality') ? document.getElementById('song-locality').value.trim() : '',
            geomType: geomType,
            lat: parseFloat(document.getElementById('song-lat').value),
            lng: parseFloat(document.getElementById('song-lng').value),
            coordinates: parsedCoordinates,
            terrain: document.getElementById('song-terrain').value.trim(),
            biome: document.getElementById('song-biome') ? document.getElementById('song-biome').value : '',
            tags: tagsArray,
            context: document.getElementById('song-context').value.trim(),
            pedagogicalUse: document.getElementById('song-pedagogical') ? document.getElementById('song-pedagogical').value.trim() : '',
            ytLink: document.getElementById('yt-link').value.trim(),
            status: 'pending'
        };

        // Enviar al Backend REST
        const apiResult = await apiRequest(`${API_BASE}/songs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSong)
        });

        if (apiResult && apiResult.songId) {
            newSong.id = apiResult.songId;
        } else {
            newSong.id = Date.now();
        }

        songsDatabase.unshift(newSong);
        saveSongs(songsDatabase);
        updatePendingBadge();

        formMessage.textContent = '¡Propuesta enviada con éxito! Queda en revisión en el Validador antes de su publicación oficial.';
        formMessage.className = 'success';
        formMessage.classList.remove('hidden');

        songForm.reset();
        tempShapeCoordinates = [];
        if (tempDraftLayer) {
            tempDraftLayer.remove();
            tempDraftLayer = null;
        }

        setTimeout(() => formMessage.classList.add('hidden'), 5500);
    });
}

function updatePendingBadge() {
    const pendingCount = songsDatabase.filter(s => s.status === 'pending').length;
    if (pendingCountBadge) {
        if (pendingCount > 0) {
            pendingCountBadge.textContent = pendingCount;
            pendingCountBadge.classList.remove('hidden');
        } else {
            pendingCountBadge.classList.add('hidden');
        }
    }

    const countPendingEl = document.getElementById('admin-count-pending');
    const countApprovedEl = document.getElementById('admin-count-approved');
    const countRejectedEl = document.getElementById('admin-count-rejected');

    if (countPendingEl) countPendingEl.textContent = songsDatabase.filter(s => s.status === 'pending').length;
    if (countApprovedEl) countApprovedEl.textContent = songsDatabase.filter(s => s.status === 'approved').length;
    if (countRejectedEl) countRejectedEl.textContent = songsDatabase.filter(s => s.status === 'rejected').length;
}

/* Módulo de Moderación / Validador (RS-03 MoSCoW: Validación de Contenido) */

function initAdminFilterBar() {
    const filterTabs = document.querySelectorAll('.admin-tab-btn');
    filterTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            filterTabs.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentAdminFilter = btn.getAttribute('data-status');
            renderAdminList();
        });
    });
}

function renderAdminList() {
    if (!adminCardsList) return;
    adminCardsList.innerHTML = '';

    let filtered = [...songsDatabase];
    if (currentAdminFilter !== 'all') {
        filtered = filtered.filter(s => s.status === currentAdminFilter);
    }

    if (filtered.length === 0) {
        adminCardsList.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:2rem 0;">No hay propuestas bajo el filtro "${currentAdminFilter}".</p>`;
        updatePendingBadge();
        return;
    }

    filtered.forEach(song => {
        const isPending = song.status === 'pending';
        const isApproved = song.status === 'approved';
        const card = document.createElement('div');
        card.className = 'admin-song-card';

        const geomLabel = song.geomType === 'line'
            ? `<span class="admin-badge-geom"><i data-lucide="git-commit"></i> Línea/Río</span>`
            : (song.geomType === 'polygon' ? `<span class="admin-badge-geom"><i data-lucide="hexagon"></i> Área</span>` : `<span class="admin-badge-geom"><i data-lucide="map-pin"></i> Punto</span>`);

        const actionsHtml = isPending ? `
            <div class="moderation-action-row">
                <input type="text" class="moderation-note-input" id="mod-note-${song.id}" placeholder="Nota de moderación / feedback pedagógico...">
                <button class="btn-mod-approve" onclick="moderateSongAction(${song.id}, 'approved')">
                    <i data-lucide="check"></i> Aprobar
                </button>
                <button class="btn-mod-reject" onclick="moderateSongAction(${song.id}, 'rejected')">
                    <i data-lucide="x"></i> Rechazar
                </button>
            </div>
        ` : `
            <div style="font-size:0.75rem; color:${isApproved ? 'var(--success)' : 'var(--danger)'}; font-weight:600; margin-top:0.6rem; display:flex; align-items:center; gap:0.4rem;">
                <i data-lucide="${isApproved ? 'check-circle' : 'x-circle'}"></i> 
                ${isApproved ? 'Publicada en el mapa oficial' : 'Rechazada por moderación'}
                ${song.moderationNote ? `<span style="color:var(--text-muted); font-weight:400;">(${song.moderationNote})</span>` : ''}
            </div>
        `;

        card.innerHTML = `
            <div class="admin-card-header">
                <div>
                    <h4 class="admin-card-title">${song.title}</h4>
                    <span class="admin-card-artist">${song.artist}</span>
                </div>
                <div>
                    ${geomLabel}
                    <span class="badge ${song.status}">${song.status}</span>
                </div>
            </div>

            <div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:0.4rem;">
                <strong>Localidad:</strong> ${song.locality || 'No especificada'} &bull; 
                <strong>Bioma:</strong> ${song.biome || '—'}
            </div>

            <div class="admin-card-details">${song.context}</div>

            ${song.pedagogicalUse ? `<div class="admin-pedagogical-box"><strong>Pedagogía:</strong> ${song.pedagogicalUse}</div>` : ''}

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem; font-size:0.74rem;">
                <span style="color:var(--text-muted);"><i data-lucide="crosshair"></i> ${formatCoordinate(song.lat)}°, ${formatCoordinate(song.lng)}°</span>
                <a href="${song.ytLink}" target="_blank" style="color:var(--primary-light); text-decoration:none;">
                    <i data-lucide="youtube"></i> Ver Enlace YouTube
                </a>
            </div>

            ${actionsHtml}
        `;

        adminCardsList.appendChild(card);
    });

    lucide.createIcons();
    updatePendingBadge();
}

window.moderateSongAction = async (id, status) => {
    const noteInput = document.getElementById(`mod-note-${id}`);
    const note = noteInput ? noteInput.value.trim() : '';

    const song = songsDatabase.find(s => s.id === id);
    if (!song) return;

    // Actualizar Backend REST
    await apiRequest(`${API_BASE}/songs/${id}/moderate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
    });

    song.status = status;
    song.moderationNote = note;
    saveSongs(songsDatabase);

    renderAdminList();
    renderMapMarkers();
    updatePendingBadge();
};

/* Reporte de Problemas (Modal) */

const reportModal = document.getElementById('report-modal');
const reportForm = document.getElementById('report-form');
const btnCloseReportModal = document.getElementById('btn-close-report-modal');
const btnCancelReport = document.getElementById('btn-cancel-report');
const reportSectionOrigin = document.getElementById('report-section-origin');
const reportFeedback = document.getElementById('report-feedback');

function initReportModal() {
    document.querySelectorAll('.btn-report-issue').forEach(btn => {
        btn.addEventListener('click', () => {
            openReportModal(btn.getAttribute('data-section') || 'General');
        });
    });

    if (btnCloseReportModal) btnCloseReportModal.addEventListener('click', closeReportModal);
    if (btnCancelReport) btnCancelReport.addEventListener('click', closeReportModal);

    if (reportModal) {
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) closeReportModal();
        });
    }

    if (reportForm) {
        reportForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const report = {
                section: reportSectionOrigin.value,
                issueType: document.getElementById('report-issue-type').value,
                description: document.getElementById('report-description').value.trim(),
                contact: document.getElementById('report-contact').value.trim()
            };

            await apiRequest(`${API_BASE}/reports`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(report)
            });

            reportFeedback.textContent = '¡Reporte enviado exitosamente! Gracias por tu aporte.';
            reportFeedback.className = 'success';
            reportFeedback.classList.remove('hidden');

            setTimeout(() => {
                closeReportModal();
                reportForm.reset();
            }, 1800);
        });
    }
}

function openReportModal(sectionName) {
    if (!reportModal) return;
    reportSectionOrigin.value = sectionName;
    reportModal.classList.remove('hidden');
    lucide.createIcons();
    setTimeout(() => {
        document.getElementById('report-description').focus();
    }, 150);
}

function closeReportModal() {
    if (!reportModal) return;
    reportModal.classList.add('hidden');
    reportFeedback.classList.add('hidden');
}

/* Arranque de la Aplicación */

async function startApp() {
    if (window._atlasAppStarted) return;
    window._atlasAppStarted = true;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        lucide.createIcons();
    }

    initLeafletMap();
    initNavigation();
    initSearchFeature();
    initMapLocationSearch();
    initSubmissionForm();
    initAdminFilterBar();
    initTerrainFeature();
    renderTerrainPresets();
    initReportModal();
    updatePendingBadge();

    // Sincronizar datos con el backend REST
    await syncWithBackend();

    const initialApproved = songsDatabase.find(s => s.status === 'approved');
    if (initialApproved) {
        selectSong(initialApproved, false);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
