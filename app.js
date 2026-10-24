//API Google Maps
const GOOGLE_MAPS_API_KEY = "#USAR UNA API-GOOGLE JS";

//Canciones iniciales de prueba
const initialSongs = [
    {
        id: 1,
        title: "Sube a Nacer Conmigo Hermano",
        artist: "Los Jaivas",
        locality: "Machu Picchu / Cusco, Perú",
        lat: -13.1631,
        lng: -72.5450,
        terrain: "Altiplano / Cordillera",
        context: "Obra fundamental que conecta la geografía andina con las alturas de Machu Picchu y la poesía de Pablo Neruda. Refleja la identidad territorial y la inmensidad de la cordillera de los Andes.",
        ytLink: "https://www.youtube.com/watch?v=F3qE1Wb4gM0",
        status: "approved"
    },
    {
        id: 2,
        title: "Canción de cuna para despertar a un negrito",
        artist: "Inti-Illimani",
        locality: "Camagüey / Antillas, Cuba",
        lat: 21.5218,
        lng: -77.7812,
        terrain: "Costa / Antillas",
        context: "Muestra la influencia cultural afrocubana y su arraigo territorial en las antillas. Útil para enseñar sobre migraciones forzadas, paisajes caribeños y sincretismo.",
        ytLink: "https://www.youtube.com/watch?v=k4o9sFDBPzM",
        status: "pending"
    },
    {
        id: 3,
        title: "La Flor de la Canela",
        artist: "Chabuca Granda",
        locality: "Lima / Valle del Rímac, Perú",
        lat: -12.0464,
        lng: -77.0428,
        terrain: "Valle Costero",
        context: "Evoca la cuenca del río Rímac y los tradicionales puentes y alamedas de Lima. Describe la brisa costeña y la arquitectura tradicional del desierto costero peruano.",
        ytLink: "https://www.youtube.com/watch?v=nO_3Vq27m1g",
        status: "approved"
    },
    {
        id: 4,
        title: "Zamba de mi Esperanza",
        artist: "Jorge Cafrune",
        locality: "Valles Calchaquíes / Salta, Argentina",
        lat: -24.7821,
        lng: -65.4232,
        terrain: "Valles Calchaquíes",
        context: "Expresión viva del paisaje montañoso y quebradas del noroeste argentino, retratando la relación íntima entre el gaucho, la soledad y la aridez del relieve andino-pampeano.",
        ytLink: "https://www.youtube.com/watch?v=0hK22Qn5oYk",
        status: "approved"
    },
    {
        id: 5,
        title: "Volver a los 17",
        artist: "Violeta Parra",
        locality: "San Carlos / Valle Central, Chile",
        lat: -36.6067,
        lng: -72.1034,
        terrain: "Valle Central / Secano",
        context: "Composición nacida en el secano interior de la región de Ñuble, conectada con la flora campesina, las lomas de trigo y el sentir popular chileno.",
        ytLink: "https://www.youtube.com/watch?v=s5e_U_6t5_Y",
        status: "approved"
    }
];

//Formateo de coordenadas
function formatCoordinate(val, maxDecimals = 4) {
    if (val === null || val === undefined || val === "" || isNaN(Number(val))) return '—';
    const num = Number(val);
    return num.toFixed(maxDecimals);
}

//Persistencia en LocalStorage (Front & Back en cliente)
function getStoredSongs() {
    const data = localStorage.getItem('atlas_musical_songs_v2');
    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error("Error al leer canciones de localStorage:", e);
        }
    }
    localStorage.setItem('atlas_musical_songs_v2', JSON.stringify(initialSongs));
    return initialSongs;
}

function saveSongs(songs) {
    localStorage.setItem('atlas_musical_songs_v2', JSON.stringify(songs));
}

let songsDatabase = getStoredSongs();
let selectedSongId = null;
let currentActiveTab = 'search';

//Variables de Google Maps
let map = null;
let markersMap = new Map(); //id es google.maps.Marker
let currentInfoWindow = null;
let pointedLocationMarker = null;

//Visual oscura
const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];

//Obtener API Key activa
function getActiveApiKey() {
    if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim() !== "") {
        return GOOGLE_MAPS_API_KEY.trim();
    }
    return localStorage.getItem('gmaps_api_key') || "";
}

//Inicialización de Google Maps
function setupMapEngine() {
    const apiKey = getActiveApiKey();
    const mapContainer = document.getElementById('map-container');

    if (!apiKey) {
        showApiKeyPrompt(mapContainer);
    } else {
        loadGoogleMapsScript(apiKey);
    }
}

function showApiKeyPrompt(container) {
    container.innerHTML = `
        <div class="api-key-overlay">
            <div class="api-key-card">
                <i data-lucide="map-pin" style="width: 48px; height: 48px; color: var(--primary); margin: 0 auto 1rem auto; display: block;"></i>
                <h3>Conectar Google Maps</h3>
                <p>Introduce tu API Key de Google Maps para activar el mapa y los marcadores musicales.</p>
                <div class="api-key-input-group">
                    <input type="text" id="gmaps-key-input" placeholder="Pega tu API Key (ej: AIzaSy...)" autocomplete="off">
                    <button id="save-gmaps-key-btn" class="btn-primary" style="margin: 0; width: auto; padding: 0.8rem 1.5rem;">Cargar Mapa</button>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();

    document.getElementById('save-gmaps-key-btn').addEventListener('click', () => {
        const inputKey = document.getElementById('gmaps-key-input').value.trim();
        if (inputKey) {
            localStorage.setItem('gmaps_api_key', inputKey);
            container.innerHTML = `<div style="display:flex;height:100%;align-items:center;justify-content:center;color:var(--text-muted);">Cargando Google Maps...</div>`;
            loadGoogleMapsScript(inputKey);
        }
    });
}

function loadGoogleMapsScript(apiKey) {
    if (window.google && window.google.maps) {
        initGoogleMap();
        return;
    }

    window.initGoogleMap = initGoogleMap;

    const script = document.createElement('script');
    script.id = 'gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
        alert('Hubo un error al cargar Google Maps. Verifica tu clave de API.');
        showApiKeyPrompt(document.getElementById('map-container'));
    };
    document.head.appendChild(script);
}

function initGoogleMap() {
    const mapContainer = document.getElementById('map-container');
    mapContainer.innerHTML = '';

    //Botón flotante para cambiar la clave si se requiere
    const badge = document.createElement('div');
    badge.className = 'map-key-badge';
    badge.innerHTML = `<i data-lucide="key" style="width: 14px; height: 14px;"></i> Cambiar Key`;
    badge.title = "Cambiar API Key de Google Maps";
    badge.onclick = () => {
        if (confirm('¿Deseas cambiar la API Key de Google Maps?')) {
            localStorage.removeItem('gmaps_api_key');
            location.reload();
        }
    };
    mapContainer.appendChild(badge);

    //Mapa centrado en América Latina
    map = new google.maps.Map(mapContainer, {
        center: { lat: -16, lng: -63 },
        zoom: 4,
        styles: darkMapStyle,
        disableDefaultUI: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    //Aplicar modo de visualización de mapa inicial
    if (typeof setMapVisualMode === 'function') {
        setMapVisualMode(currentMapMode, false);
    }

    //Clic en el mapa con comportamiento inteligente según la pestaña activa
    map.addListener('click', (e) => {
        const lat = parseFloat(e.latLng.lat().toFixed(4));
        const lng = parseFloat(e.latLng.lng().toFixed(4));

        if (currentActiveTab === 'map') {
            //En el menú MAPA: apuntar la localidad en el mapa y listar canciones
            reverseGeocodePoint(lat, lng, (placeName) => {
                pointLocationOnMap(lat, lng, placeName);
            });
        } else if (currentActiveTab === 'submit') {
            //En el menú CONTRIBUCIÓN: capturar coordenadas automáticamente para el formulario
            const latInput = document.getElementById('song-lat');
            const lngInput = document.getElementById('song-lng');
            if (latInput && lngInput) {
                latInput.value = lat;
                lngInput.value = lng;
            }
        }
    });

    renderMapMarkers();
    lucide.createIcons();

    //Inicializar punto por defecto en el menú mapa
    pointLocationOnMap(-13.1631, -72.5450, "Cusco / Machu Picchu, Perú");

    //Si ya había una canción seleccionada, centrarla
    if (selectedSongId) {
        const song = songsDatabase.find(s => s.id === selectedSongId);
        if (song) focusSongOnMap(song.id);
    }
}

//Extraer ID de YouTube
function extractVideoID(url) {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
}

//Renderizar marcadores en Google Maps
function renderMapMarkers() {
    if (!map || !window.google) return;

    markersMap.forEach(marker => marker.setMap(null));
    markersMap.clear();

    const approvedSongs = songsDatabase.filter(s => s.status === 'approved');

    approvedSongs.forEach(song => {
        const marker = new google.maps.Marker({
            position: { lat: song.lat, lng: song.lng },
            map: map,
            title: `${song.title} - ${song.artist}`,
            animation: google.maps.Animation.DROP
        });

        const videoId = extractVideoID(song.ytLink);
        const embedHtml = videoId
            ? `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
            : `<p style="color:red; font-size:0.8rem;">Enlace no disponible</p>`;

        const terrainHtml = song.terrain ? `<p style="font-size:0.8rem; color:#A29BFE; margin-bottom:0.3rem;"><strong>Terreno:</strong> ${song.terrain}</p>` : '';

        const popupContent = `
            <div class="popup-content">
                ${embedHtml}
                <h3>${song.title}</h3>
                <p><strong>Artista:</strong> ${song.artist}</p>
                ${terrainHtml}
                <p>${song.context}</p>
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: popupContent
        });

        marker.addListener('click', () => {
            if (currentInfoWindow) currentInfoWindow.close();
            infoWindow.open({
                anchor: marker,
                map: map,
                shouldFocus: false
            });
            currentInfoWindow = infoWindow;

            //Al hacer clic en un marcador, seleccionar la canción y mostrarla en el buscador
            selectSong(song, false);
            switchTab('search');
        });

        markersMap.set(song.id, { marker, infoWindow });
    });
}

//Menú Mapa
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
                    map.panTo({ lat, lng });
                    map.setZoom(8);
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

//Geocodificación (Google Geocoder con fallback a Nominatim)
function geocodeLocation(query, callback) {
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: query }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const loc = results[0].geometry.location;
                callback(loc.lat(), loc.lng(), results[0].formatted_address);
                return;
            }
            fetchNominatimGeocode(query, callback);
        });
    } else {
        fetchNominatimGeocode(query, callback);
    }
}

function fetchNominatimGeocode(query, callback) {
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

//Geocodificación inversa al apuntar en el mapa
function reverseGeocodePoint(lat, lng, callback) {
    if (window.google && window.google.maps && window.google.maps.Geocoder) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const parts = results[0].address_components;
                const city = parts.find(p => p.types.includes('locality'))?.long_name || 
                             parts.find(p => p.types.includes('administrative_area_level_2'))?.long_name;
                const country = parts.find(p => p.types.includes('country'))?.long_name;
                const name = (city && country) ? `${city}, ${country}` : results[0].formatted_address;
                callback(name);
                return;
            }
            callback(`Ubicación: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
        });
    } else {
        callback(`Punto: ${lat.toFixed(2)}°, ${lng.toFixed(2)}°`);
    }
}

//Calcular distancia Haversine en kilómetros
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; //Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}

//Actualizar el punto de localidad apuntado en el Menú Mapa
function pointLocationOnMap(lat, lng, placeName) {
    //Actualizar textos y nombre
    const localityNameEl = document.getElementById('locality-name');
    const localityLatEl = document.getElementById('map-locality-lat');
    const localityLngEl = document.getElementById('map-locality-lng');
    const localityLatFill = document.getElementById('map-locality-lat-fill');
    const localityLngFill = document.getElementById('map-locality-lng-fill');

    if (localityNameEl) localityNameEl.textContent = placeName || "Punto apuntado en el mapa";
    if (localityLatEl) {
        localityLatEl.textContent = `${formatCoordinate(lat)}°`;
        localityLatEl.title = `Latitud: ${lat}°`;
    }
    if (localityLngEl) {
        localityLngEl.textContent = `${formatCoordinate(lng)}°`;
        localityLngEl.title = `Longitud: ${lng}°`;
    }

    //Porcentaje visual para las dos barras de coordenadas
    const latPct = Math.min(100, Math.max(10, ((lat + 60) / 90) * 100));
    const lngPct = Math.min(100, Math.max(10, ((lng + 120) / 90) * 100));
    if (localityLatFill) localityLatFill.style.width = `${latPct}%`;
    if (localityLngFill) localityLngFill.style.width = `${lngPct}%`;

    //Colocar o mover marcador distintivo de la localidad apuntada
    if (map && window.google) {
        if (!pointedLocationMarker) {
            pointedLocationMarker = new google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: placeName || "Localidad apuntada",
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 9,
                    fillColor: "#6C5CE7",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2.5
                }
            });
        } else {
            pointedLocationMarker.setPosition({ lat, lng });
            pointedLocationMarker.setTitle(placeName || "Localidad apuntada");
        }
    }

    //Buscar y listar canciones asociadas a esta localidad
    renderLocalityAssociatedSongs(lat, lng, placeName);
}

//Renderizar canciones asociadas a la localidad apuntada
function renderLocalityAssociatedSongs(targetLat, targetLng, placeName) {
    const localitySongsList = document.getElementById('locality-songs-list');
    const localitySongsCount = document.getElementById('locality-songs-count');
    if (!localitySongsList) return;

    const approved = songsDatabase.filter(s => s.status === 'approved');

    //Calcular distancia a todas las canciones y ordenar por proximidad
    const withDistance = approved.map(song => {
        const dist = calculateDistanceKm(targetLat, targetLng, song.lat, song.lng);
        return { ...song, distanceKm: dist };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    //Consideramos asociadas aquellas en un radio de hasta 850 km o las 3 más cercanas
    const associated = withDistance.filter(s => s.distanceKm <= 850);

    localitySongsList.innerHTML = '';

    if (associated.length > 0) {
        localitySongsCount.textContent = `${associated.length} registrada${associated.length > 1 ? 's' : ''}`;
        localitySongsCount.className = 'badge approved';

        associated.forEach(song => {
            const card = document.createElement('div');
            card.className = 'locality-song-card';
            
            const distLabel = song.distanceKm < 30 ? 'En esta localidad' : `Aprox. a ${song.distanceKm} km`;

            card.innerHTML = `
                <div class="locality-song-row-top">
                    <span class="locality-song-title">${song.title}</span>
                    <span class="locality-song-distance">${distLabel}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="locality-song-artist">${song.artist}</span>
                    ${song.terrain ? `<span style="font-size:0.72rem; color:var(--primary-light);">⛰️ ${song.terrain}</span>` : ''}
                </div>
            `;

            card.addEventListener('click', () => {
                selectSong(song, true);
                switchTab('search');
            });

            localitySongsList.appendChild(card);
        });
    } else {
        localitySongsCount.textContent = '0 asociadas';
        localitySongsCount.className = 'badge pending';

        localitySongsList.innerHTML = `
            <div class="locality-empty-songs">
                <p>No hay canciones registradas en el radio inmediato de esta localidad.</p>
                <button class="btn-contribute-here" onclick="contributeAtPoint(${targetLat}, ${targetLng})">
                    <i data-lucide="plus-circle"></i> Proponer canción aquí
                </button>
            </div>
        `;
    }

    lucide.createIcons();
}

//Acción para proponer una canción en el punto geográfico apuntado
window.contributeAtPoint = (lat, lng) => {
    switchTab('submit');
    const latInput = document.getElementById('song-lat');
    const lngInput = document.getElementById('song-lng');
    const titleInput = document.getElementById('song-title');
    if (latInput && lngInput) {
        latInput.value = lat;
        lngInput.value = lng;
    }
    if (titleInput) {
        titleInput.focus();
    }
};

//Lógica de búsqueda y carrusel de terrenos deslizable
const searchInput = document.getElementById('song-search-input');
const searchClearBtn = document.getElementById('search-clear-btn');
const suggestionsDropdown = document.getElementById('search-suggestions');
const songDetailContainer = document.getElementById('song-detail-container');
const quickFilters = document.querySelectorAll('.filter-pill');
const quickFiltersContainer = document.getElementById('quick-terrain-filters');
const btnScrollLeft = document.getElementById('filters-scroll-left');
const btnScrollRight = document.getElementById('filters-scroll-right');

function centerFilterPill(pill) {
    if (!quickFiltersContainer || !pill) return;
    const containerWidth = quickFiltersContainer.clientWidth;
    const pillLeft = pill.offsetLeft;
    const pillWidth = pill.clientWidth;
    const targetScroll = pillLeft - (containerWidth / 2) + (pillWidth / 2);
    quickFiltersContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
    setTimeout(updateFilterScrollButtons, 300);
}

function updateFilterScrollButtons() {
    if (!quickFiltersContainer || !btnScrollLeft || !btnScrollRight) return;
    const scrollLeft = quickFiltersContainer.scrollLeft;
    const maxScroll = quickFiltersContainer.scrollWidth - quickFiltersContainer.clientWidth;

    if (scrollLeft <= 4) {
        btnScrollLeft.classList.add('hidden');
    } else {
        btnScrollLeft.classList.remove('hidden');
    }

    if (scrollLeft >= maxScroll - 4) {
        btnScrollRight.classList.add('hidden');
    } else {
        btnScrollRight.classList.remove('hidden');
    }
}

function initFilterCarousel() {
    if (!quickFiltersContainer) return;

    if (btnScrollLeft) {
        btnScrollLeft.addEventListener('click', () => {
            quickFiltersContainer.scrollBy({ left: -160, behavior: 'smooth' });
            setTimeout(updateFilterScrollButtons, 250);
        });
    }

    if (btnScrollRight) {
        btnScrollRight.addEventListener('click', () => {
            quickFiltersContainer.scrollBy({ left: 160, behavior: 'smooth' });
            setTimeout(updateFilterScrollButtons, 250);
        });
    }

    quickFiltersContainer.addEventListener('scroll', updateFilterScrollButtons);
    window.addEventListener('resize', updateFilterScrollButtons);

    //Arrastre horizontal interactivo
    let isDown = false;
    let startX;
    let scrollStart;
    let hasDragged = false;

    quickFiltersContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false;
        quickFiltersContainer.classList.add('is-dragging');
        startX = e.pageX - quickFiltersContainer.offsetLeft;
        scrollStart = quickFiltersContainer.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        quickFiltersContainer.classList.remove('is-dragging');
        updateFilterScrollButtons();
    });

    quickFiltersContainer.addEventListener('mouseleave', () => {
        if (isDown) {
            isDown = false;
            quickFiltersContainer.classList.remove('is-dragging');
            updateFilterScrollButtons();
        }
    });

    quickFiltersContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - quickFiltersContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 4) hasDragged = true;
        quickFiltersContainer.scrollLeft = scrollStart - walk;
    });

    //Desplazamiento horizontal con rueda del ratón
    quickFiltersContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            quickFiltersContainer.scrollBy({ left: e.deltaY * 0.9, behavior: 'smooth' });
            setTimeout(updateFilterScrollButtons, 150);
        }
    }, { passive: false });

    updateFilterScrollButtons();
}

function syncActiveTerrainPill(terrainName) {
    if (!terrainName) return;
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
        const filter = pill.getAttribute('data-filter');
        if (filter !== 'all' && terrainName.toLowerCase().includes(filter.toLowerCase())) {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            centerFilterPill(pill);
        }
    });
}

function initSearchFeature() {
    initFilterCarousel();

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 0) {
            searchClearBtn.classList.remove('hidden');
            renderSuggestions(query);
        } else {
            searchClearBtn.classList.add('hidden');
            hideSuggestions();
        }
    });

    searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchClearBtn.classList.add('hidden');
        hideSuggestions();
        searchInput.focus();
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            hideSuggestions();
        }
    });

    quickFilters.forEach(pill => {
        pill.addEventListener('click', () => {
            quickFilters.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            //Centrar automáticamente la opción seleccionada y desplazar carrusel
            centerFilterPill(pill);

            const filter = pill.getAttribute('data-filter');
            if (filter === 'all') {
                searchInput.value = '';
                searchClearBtn.classList.add('hidden');
                hideSuggestions();
            } else {
                searchInput.value = filter;
                searchClearBtn.classList.remove('hidden');
                renderSuggestions(filter.toLowerCase());
            }
        });
    });
}

function renderSuggestions(query) {
    const approved = songsDatabase.filter(s => s.status === 'approved');
    const matches = approved.filter(s => {
        const title = (s.title || '').toLowerCase();
        const artist = (s.artist || '').toLowerCase();
        const terrain = (s.terrain || '').toLowerCase();
        const context = (s.context || '').toLowerCase();
        return title.includes(query) || artist.includes(query) || terrain.includes(query) || context.includes(query);
    });

    suggestionsDropdown.innerHTML = '';

    if (matches.length === 0) {
        suggestionsDropdown.innerHTML = `
            <div class="suggestion-empty">
                No se encontraron canciones registradas para "${query}".
            </div>
        `;
    } else {
        matches.forEach(song => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            
            const terrainBadge = song.terrain 
                ? `<span class="suggestion-terrain">${song.terrain}</span>` 
                : '';

            item.innerHTML = `
                <div class="suggestion-info">
                    <span class="suggestion-title">${highlightMatch(song.title, query)}</span>
                    <span class="suggestion-artist">${highlightMatch(song.artist, query)}</span>
                </div>
                ${terrainBadge}
            `;

            item.addEventListener('click', () => {
                searchInput.value = song.title;
                hideSuggestions();
                selectSong(song, true);
            });

            suggestionsDropdown.appendChild(item);
        });
    }

    suggestionsDropdown.classList.remove('hidden');
}

function highlightMatch(text, query) {
    if (!text) return '';
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    const before = text.substring(0, index);
    const match = text.substring(index, index + query.length);
    const after = text.substring(index + query.length);
    return `${before}<strong style="color:var(--primary-light);">${match}</strong>${after}`;
}

function hideSuggestions() {
    suggestionsDropdown.classList.add('hidden');
}

//Selección de canción
function selectSong(song, shouldFlyTo = true) {
    selectedSongId = song.id;

    if (shouldFlyTo && map && window.google) {
        focusSongOnMap(song.id);
    }

    //Centrar y resaltar la píldora correspondiente en el carrusel de terrenos
    syncActiveTerrainPill(song.terrain);

    const videoId = extractVideoID(song.ytLink);
    const embedHtml = videoId
        ? `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
        : `<p style="color:var(--danger); font-size:0.85rem; padding:0.5rem 0;">Enlace de YouTube no válido</p>`;

    const latPercent = Math.min(100, Math.max(10, ((song.lat + 60) / 90) * 100));
    const lngPercent = Math.min(100, Math.max(10, ((song.lng + 120) / 90) * 100));

    const hasTerrain = Boolean(song.terrain && song.terrain.trim() !== "");
    const terrainDisplay = hasTerrain ? song.terrain : "—";
    const terrainClass = hasTerrain ? "" : "empty";

    songDetailContainer.innerHTML = `
        <div class="selected-song-card">
            <div class="song-card-header">
                <h3 class="song-card-title">${song.title}</h3>
                <span class="song-card-artist">${song.artist}</span>
            </div>

            ${embedHtml}

            <!-- Mini barras que muestran las coordenadas (Disposición vertical espaciosa) -->
            <div class="mini-bars-container">
                <div class="mini-bar mini-bar-lat">
                    <span class="mini-bar-label"><i data-lucide="navigation"></i> Latitud</span>
                    <span class="mini-bar-value" title="Latitud: ${song.lat}°">${formatCoordinate(song.lat)}°</span>
                    <div class="mini-bar-track">
                        <div class="mini-bar-fill" style="width: ${latPercent}%;"></div>
                    </div>
                </div>

                <div class="mini-bar mini-bar-lng">
                    <span class="mini-bar-label"><i data-lucide="globe"></i> Longitud</span>
                    <span class="mini-bar-value" title="Longitud: ${song.lng}°">${formatCoordinate(song.lng)}°</span>
                    <div class="mini-bar-track">
                        <div class="mini-bar-fill" style="width: ${lngPercent}%;"></div>
                    </div>
                </div>
            </div>

            <!-- Barra que detalla el tipo de terreno y botón para activar mapa topográfico -->
            <div class="terrain-bar-card">
                <div class="terrain-bar-left">
                    <div class="terrain-bar-icon">
                        <i data-lucide="mountain"></i>
                    </div>
                    <div class="terrain-bar-content">
                        <span class="terrain-bar-title">Tipo de Terreno</span>
                        <span class="terrain-bar-val ${terrainClass}">${terrainDisplay}</span>
                    </div>
                </div>
                <button class="btn-terrain-topo" onclick="focusSongTerrainTopography(${song.id})" title="Ver curvas de nivel y relieve de este terreno">
                    <i data-lucide="mountain-snow"></i>
                    <span>Ver Relieve</span>
                </button>
            </div>

            <!-- Breve caja que muestra una descripción o contexto pedagógico -->
            <div class="context-box">
                <div class="context-box-header">
                    <i data-lucide="book-open"></i>
                    <span>Justificación Geográfica y Cultural</span>
                </div>
                <p class="context-box-text">${song.context}</p>
            </div>

            <div class="song-card-actions">
                <button class="btn-focus-song" onclick="focusSongOnMap(${song.id})">
                    <i data-lucide="crosshair"></i> Centrar en el Mapa
                </button>
                <button class="btn-focus-song" onclick="focusSongTerrainTopography(${song.id})" style="background: rgba(108, 92, 231, 0.2); border-color: rgba(108, 92, 231, 0.45); color: var(--primary-light);">
                    <i data-lucide="mountain-snow"></i> Relieve Topográfico
                </button>
            </div>
        </div>
    `;

    lucide.createIcons();
}

window.focusSongOnMap = (id) => {
    const song = songsDatabase.find(s => s.id === id);
    if (!song || !map || !window.google) return;

    map.panTo({ lat: song.lat, lng: song.lng });
    map.setZoom(7);

    const markerObj = markersMap.get(song.id);
    if (markerObj) {
        if (currentInfoWindow) currentInfoWindow.close();
        markerObj.infoWindow.open({
            anchor: markerObj.marker,
            map: map,
            shouldFocus: false
        });
        currentInfoWindow = markerObj.infoWindow;
    }
};

//Modo Topográfico y relieve
let currentMapMode = localStorage.getItem('atlas_map_mode') || 'dark';
let topoBadgeTimeout = null;

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
        id: "valle-costero",
        name: "Valle Costero y Desierto del Rímac",
        elevation: "0 - 450 m.s.n.m.",
        region: "Lima, Cuenca del Río Rímac (Perú)",
        terrainType: "Valle Costero",
        acousticImpact: "Guitarras criollas, cajón de madera y marinera",
        center: { lat: -12.0464, lng: -77.0428 },
        zoom: 10,
        description: "Planicie aluvial y oasis costero regado por el río Rímac que baja veloz de la cordillera. Inspiró el florecimiento del vals criollo, la lírica de alamedas y puentes virreinales, y el sincretismo costeño.",
        songTitle: "La Flor de la Canela"
    },
    {
        id: "secano-campesino",
        name: "Valle Central y Secano Campesino",
        elevation: "150 - 850 m.s.n.m.",
        region: "San Carlos, Ñuble, Valle Central (Chile)",
        terrainType: "Valle Central / Secano",
        acousticImpact: "Tonadas campesinas, guitarra traspuesta y arpa",
        center: { lat: -36.6067, lng: -72.1034 },
        zoom: 9,
        description: "Lomas onduladas de secano interior y vegas fértiles flanqueadas por las cordilleras. Dio origen al folclore campesino chileno de raíz telúrica y profunda poética popular campesina.",
        songTitle: "Volver a los 17"
    },
    {
        id: "costa-antillas",
        name: "Costa y Llanura Antillana",
        elevation: "0 - 180 m.s.n.m.",
        region: "Camagüey, Santiago, Caribe Insular (Cuba)",
        terrainType: "Costa / Antillas",
        acousticImpact: "Percusión afrocubana, clave, tres y síncopa marina",
        center: { lat: 21.5218, lng: -77.7812 },
        zoom: 9,
        description: "Relieve llano y costa tropical rodeada de palmares y brisa marina. Terreno ligado a las migraciones afrocubanas, al trabajo azucarero y a ritmos bailables con percusión sincopada.",
        songTitle: "Canción de cuna para despertar a un negrito"
    },
    {
        id: "selva-amazonia",
        name: "Llanura Aluvial y Selva Amazónica",
        elevation: "80 - 350 m.s.n.m.",
        region: "Iquitos, Cuenca del Río Amazonas (Perú / Brasil)",
        terrainType: "Selva / Amazonía",
        acousticImpact: "Sonidos de la floresta, maderas sonoras y cumbia selvática",
        center: { lat: -3.7491, lng: -73.2538 },
        zoom: 8,
        description: "Inmensa planicie aluvial con meandros serpenteantes y densa biodiversidad vegetal. El rumor constante del agua y la fauna moldea cadencias continuas y ritmos de trance selvático.",
        songTitle: "Paisajes Amazónicos"
    }
];

function setMapVisualMode(mode, showFeedback = true) {
    currentMapMode = mode;
    localStorage.setItem('atlas_map_mode', mode);

    if (map && window.google) {
        if (mode === 'terrain') {
            map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
            map.setOptions({ styles: [] });
        } else if (mode === 'hybrid') {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            map.setOptions({ styles: [] });
        } else if (mode === 'roadmap') {
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            map.setOptions({ styles: [] });
        } else {
            // 'dark'
            map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            map.setOptions({ styles: darkMapStyle });
        }
    }

    //Actualizar botones de selección de modo
    document.querySelectorAll('.map-type-btn').forEach(btn => {
        if (btn.getAttribute('data-map-mode') === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const floatingBtnTopo = document.getElementById('floating-btn-topo');
    const floatingTopoText = document.getElementById('floating-topo-text');
    const btnMapToggleTopo = document.getElementById('btn-map-toggle-topo');

    if (mode === 'terrain') {
        if (floatingBtnTopo) floatingBtnTopo.classList.add('active');
        if (floatingTopoText) floatingTopoText.textContent = "Relieve Topográfico (Activo)";
        if (btnMapToggleTopo) {
            btnMapToggleTopo.innerHTML = `<i data-lucide="moon"></i> Volver a Modo Nocturno`;
            btnMapToggleTopo.classList.add('active');
        }
        if (showFeedback) showMapTopoBadge("🏔️ Modo Topográfico: Curvas de nivel y relieve activas");
    } else {
        if (floatingBtnTopo) floatingBtnTopo.classList.remove('active');
        if (floatingTopoText) floatingTopoText.textContent = "Vista Topográfica";
        if (btnMapToggleTopo) {
            btnMapToggleTopo.innerHTML = `<i data-lucide="mountain-snow"></i> Ver Relieve Topográfico`;
            btnMapToggleTopo.classList.remove('active');
        }
        if (showFeedback && mode === 'dark') showMapTopoBadge("🌙 Modo Nocturno Cartográfico Activo");
        else if (showFeedback && mode === 'hybrid') showMapTopoBadge("🛰️ Modo Satelital y Cobertura de Biomas");
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

window.focusSongTerrainTopography = (songId) => {
    const song = songsDatabase.find(s => s.id === songId);
    if (!song) return;

    //Activar el modo topográfico de Google Maps
    setMapVisualMode('terrain', false);

    //Centrar y acercar el mapa en la escala perfecta para apreciar el relieve
    if (map && window.google) {
        map.panTo({ lat: song.lat, lng: song.lng });
        map.setZoom(10); //Nivel de zoom donde las cotas y sombras de montaña se ven nítidas

        const markerObj = markersMap.get(song.id);
        if (markerObj) {
            if (currentInfoWindow) currentInfoWindow.close();
            markerObj.infoWindow.open({
                anchor: markerObj.marker,
                map: map,
                shouldFocus: false
            });
            currentInfoWindow = markerObj.infoWindow;
        }
    }

    //Mostrar badge flotante destacando el relieve de la canción
    showMapTopoBadge(`🏔️ Relieve: ${song.terrain || 'Topografía'} — ${song.title}`);

    //Actualizar la tarjeta de análisis topográfico con los datos de esta canción
    updateTerrainInsightCardFromSong(song);
};

function updateTerrainInsightCardFromSong(song) {
    const nameEl = document.getElementById('terrain-active-name');
    const elevEl = document.getElementById('terrain-active-elevation');
    const descEl = document.getElementById('terrain-active-desc');
    const typeEl = document.getElementById('terrain-metric-type');
    const acousticEl = document.getElementById('terrain-metric-acoustic');

    if (nameEl) nameEl.textContent = `${song.terrain || 'Terreno Geográfico'} — ${song.locality}`;
    if (elevEl) elevEl.textContent = `Coordenadas: ${formatCoordinate(song.lat)}°, ${formatCoordinate(song.lng)}°`;
    if (descEl) descEl.textContent = song.context;
    if (typeEl) typeEl.textContent = song.terrain || 'Relieve Local';
    if (acousticEl) acousticEl.textContent = `${song.title} (${song.artist})`;
}

window.openTopographyMenu = function() {
    switchTab('terrain');
    setMapVisualMode('terrain', true);

    if (map && window.google) {
        let targetCoords = null;
        let targetName = '';

        if (selectedSongId) {
            const song = songsDatabase.find(s => s.id === selectedSongId);
            if (song) {
                targetCoords = { lat: song.lat, lng: song.lng };
                targetName = `${song.title} (${song.terrain || 'Relieve montañoso'})`;
            }
        }

        if (!targetCoords) {
            const latEl = document.getElementById('map-locality-lat');
            const lngEl = document.getElementById('map-locality-lng');
            const nameEl = document.getElementById('locality-name');
            if (latEl && lngEl) {
                const latVal = parseFloat(latEl.textContent);
                const lngVal = parseFloat(lngEl.textContent);
                if (!isNaN(latVal) && !isNaN(lngVal)) {
                    targetCoords = { lat: latVal, lng: lngVal };
                    targetName = (nameEl ? nameEl.textContent : '') || 'Localidad activa';
                }
            }
        }

        if (targetCoords) {
            map.panTo(targetCoords);
            map.setZoom(10);
            showMapTopoBadge(`Explorando relieve: ${targetName}`);
        } else {
            map.panTo({ lat: -13.1631, lng: -72.5450 });
            map.setZoom(9);
            showMapTopoBadge("Modo Topográfico: Curvas de nivel y relieve activas");
        }
    }
};

function initTerrainFeature() {
    //Botones de conmutación de capas en el menú
    document.querySelectorAll('.map-type-btn[data-map-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('data-map-mode');
            setMapVisualMode(mode);
        });
    });

    //Botón flotante en el mapa
    const floatingBtnTopo = document.getElementById('floating-btn-topo');
    if (floatingBtnTopo) {
        floatingBtnTopo.addEventListener('click', () => {
            const newMode = (currentMapMode === 'terrain') ? 'dark' : 'terrain';
            setMapVisualMode(newMode);
        });
    }

    //Botón de acceso rápido en el Explorador de Mapa
    const btnMapToggleTopo = document.getElementById('btn-map-toggle-topo');
    if (btnMapToggleTopo) {
        btnMapToggleTopo.addEventListener('click', (e) => {
            e.preventDefault();
            window.openTopographyMenu();
        });
    }

    //Estado visual inicial
    setMapVisualMode(currentMapMode, false);
}

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
            <span class="terrain-preset-region">📍 ${preset.region}</span>
            <div class="terrain-preset-songs">
                <span>🎵 Canción: <strong>${preset.songTitle}</strong></span>
                <span>Explorar relieve &rarr;</span>
            </div>
        `;

        card.addEventListener('click', () => {
            document.querySelectorAll('.terrain-preset-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            setMapVisualMode('terrain', false);
            if (map && window.google) {
                map.panTo(preset.center);
                map.setZoom(preset.zoom);
            }

            const nameEl = document.getElementById('terrain-active-name');
            const elevEl = document.getElementById('terrain-active-elevation');
            const descEl = document.getElementById('terrain-active-desc');
            const typeEl = document.getElementById('terrain-metric-type');
            const acousticEl = document.getElementById('terrain-metric-acoustic');

            if (nameEl) nameEl.textContent = preset.name;
            if (elevEl) elevEl.textContent = `Elevación: ${preset.elevation}`;
            if (descEl) descEl.textContent = preset.description;
            if (typeEl) typeEl.textContent = preset.terrainType;
            if (acousticEl) acousticEl.textContent = preset.acousticImpact;

            showMapTopoBadge(`🏔️ Explorando relieve: ${preset.name}`);
        });

        container.appendChild(card);
    });

    lucide.createIcons();
}

//Navegación Dual
const railBtns = document.querySelectorAll('.rail-btn[data-tab]');
const panelSections = document.querySelectorAll('.panel-section');
const sidebarDual = document.getElementById('sidebar-dual');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const btnToggleDock = document.getElementById('btn-toggle-dock');
const btnToggleExpand = document.getElementById('btn-toggle-expand');
const sidebarResizer = document.getElementById('sidebar-resizer');
const categoryPanel = document.getElementById('category-panel');
const appContainer = document.querySelector('.app-container');

//Actualización reactiva e infalible de iconos y estados de botones del rail
function updateSidebarButtonsUI() {
    const isDockRight = appContainer && appContainer.classList.contains('dock-right');
    const isCollapsed = sidebarDual && sidebarDual.classList.contains('collapsed');
    const currentWidth = categoryPanel ? (categoryPanel.offsetWidth || 380) : 380;
    const isExpanded = currentWidth >= 500;

    //Botón Alternar Ubicación (Dock Izquierda / Derecha)
    const dockBtn = document.getElementById('btn-toggle-dock');
    if (dockBtn) {
        dockBtn.classList.toggle('active', isDockRight);
        const dockTitle = isDockRight ? "Mover menú a la izquierda" : "Mover menú a la derecha";
        dockBtn.title = dockTitle;
        dockBtn.innerHTML = `<i data-lucide="arrow-left-right"></i><span class="rail-tooltip" id="dock-tooltip">${dockTitle}</span>`;
    }

    //Botón Expandir / Contraer Ancho
    const expandBtn = document.getElementById('btn-toggle-expand');
    if (expandBtn) {
        expandBtn.classList.toggle('active', isExpanded);
        const expandTitle = isExpanded ? "Contraer ancho del menú" : "Expandir ancho del menú";
        expandBtn.title = expandTitle;
        const expandIcon = isExpanded ? 'minimize-2' : 'maximize-2';
        expandBtn.innerHTML = `<i data-lucide="${expandIcon}"></i><span class="rail-tooltip" id="expand-tooltip">${expandTitle}</span>`;
    }

    //Botón Colapsar / Mostrar Barra Lateral
    const collapseBtn = document.getElementById('btn-toggle-sidebar');
    if (collapseBtn) {
        collapseBtn.classList.toggle('active', isCollapsed);
        const collapseTitle = isCollapsed ? "Mostrar menú lateral" : "Ocultar menú lateral";
        collapseBtn.title = collapseTitle;
        let collapseIcon;
        if (isDockRight) {
            collapseIcon = isCollapsed ? 'panel-right-open' : 'panel-right-close';
        } else {
            collapseIcon = isCollapsed ? 'panel-left-open' : 'panel-left-close';
        }
        collapseBtn.innerHTML = `<i data-lucide="${collapseIcon}"></i><span class="rail-tooltip" id="collapse-tooltip">${collapseTitle}</span>`;
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}
window.updateSidebarButtonsUI = updateSidebarButtonsUI;

//Funciones globales expuestas para máxima compatibilidad
window.toggleSidebarCollapse = function() {
    if (!sidebarDual) return;
    sidebarDual.classList.toggle('collapsed');
    updateSidebarButtonsUI();

    setTimeout(() => {
        if (map && window.google) {
            google.maps.event.trigger(map, 'resize');
        }
    }, 320);
};

window.toggleSidebarDock = function() {
    if (!appContainer) return;
    const isDockRight = !appContainer.classList.contains('dock-right');
    if (isDockRight) {
        appContainer.classList.add('dock-right');
    } else {
        appContainer.classList.remove('dock-right');
    }

    try {
        localStorage.setItem('atlas_sidebar_dock', isDockRight ? 'right' : 'left');
    } catch (e) {
        console.warn('Storage warn:', e);
    }

    updateSidebarButtonsUI();

    setTimeout(() => {
        if (map && window.google) {
            google.maps.event.trigger(map, 'resize');
        }
    }, 320);
};

window.toggleSidebarWidth = function() {
    if (!categoryPanel) return;
    if (sidebarDual && sidebarDual.classList.contains('collapsed')) {
        sidebarDual.classList.remove('collapsed');
    }
    const currentWidth = categoryPanel.offsetWidth || 380;
    const targetWidth = currentWidth >= 500 ? 380 : 560;
    applySidebarWidth(targetWidth, true);

    setTimeout(() => {
        if (map && window.google) google.maps.event.trigger(map, 'resize');
    }, 320);
};

function applySidebarWidth(widthPx, smooth = true) {
    if (!categoryPanel) return;
    const maxAllowed = Math.min(window.innerWidth - 120, 850);
    const clampedWidth = Math.max(260, Math.min(widthPx, maxAllowed));

    if (!smooth) {
        categoryPanel.classList.add('no-transition');
    } else {
        categoryPanel.classList.remove('no-transition');
    }

    categoryPanel.style.width = `${clampedWidth}px`;
    document.documentElement.style.setProperty('--panel-width', `${clampedWidth}px`);

    //Durante el arrastre fluido evitamos llamadas costosas al disco y a Lucide
    if (smooth) {
        try {
            localStorage.setItem('atlas_sidebar_width', clampedWidth);
        } catch (e) {}
        updateSidebarButtonsUI();
    }
}

function initNavigation() {
    railBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    //Alternar colapso total del menú
    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleSidebarCollapse();
        });
    }

    //Alternar docking (Izquierda vs Derecha)
    if (btnToggleDock) {
        btnToggleDock.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleSidebarDock();
        });
    }

    try {
        const savedDock = localStorage.getItem('atlas_sidebar_dock');
        if (savedDock === 'right' && appContainer) {
            appContainer.classList.add('dock-right');
        }
    } catch (e) {}

    //Alternar ancho rápido (Expandir / Contraer)
    if (btnToggleExpand) {
        btnToggleExpand.addEventListener('click', (e) => {
            e.preventDefault();
            window.toggleSidebarWidth();
        });
    }

    try {
        const savedWidth = localStorage.getItem('atlas_sidebar_width');
        if (savedWidth) {
            applySidebarWidth(parseInt(savedWidth, 10), false);
        }
    } catch (e) {}

    //Redimensionamiento libre por arrastre (Drag Resizer a izquierda / derecha)
    if (sidebarResizer && categoryPanel) {
        let isDragging = false;
        const railEl = document.querySelector('.icon-rail');
        const resizerBadge = document.getElementById('resizer-live-badge');

        const onPointerDown = (e) => {
            //Permitir solo clic principal (botón izquierdo) o entrada táctil
            if (e.button !== undefined && e.button !== 0) return;
            e.preventDefault();
            isDragging = true;
            document.body.classList.add('is-resizing');
            sidebarResizer.classList.add('resizing');
            categoryPanel.classList.add('no-transition');

            if (sidebarResizer.setPointerCapture && e.pointerId !== undefined) {
                try {
                    sidebarResizer.setPointerCapture(e.pointerId);
                } catch (err) {}
            }
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const railWidth = railEl ? railEl.offsetWidth : 68;
            const isDockRight = appContainer && appContainer.classList.contains('dock-right');
            let targetWidth;

            if (isDockRight) {
                targetWidth = window.innerWidth - e.clientX - railWidth;
            } else {
                targetWidth = e.clientX - railWidth;
            }

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

            if (sidebarResizer.releasePointerCapture && e.pointerId !== undefined) {
                try {
                    sidebarResizer.releasePointerCapture(e.pointerId);
                } catch (err) {}
            }

            if (resizerBadge) {
                resizerBadge.textContent = '↔ Ajustar ancho';
            }

            const currentW = categoryPanel.offsetWidth || 380;
            applySidebarWidth(currentW, true);

            if (map && window.google) {
                google.maps.event.trigger(map, 'resize');
            }
        };

        //Pointer Events (Soporte moderno, táctil y ratón con captura de puntero)
        sidebarResizer.addEventListener('pointerdown', onPointerDown);
        sidebarResizer.addEventListener('pointermove', onPointerMove);
        sidebarResizer.addEventListener('pointerup', onPointerUp);
        sidebarResizer.addEventListener('pointercancel', onPointerUp);

        //Fallbacks globales para ratón en ventanas o sobre capas complejas
        window.addEventListener('mousemove', (e) => {
            if (isDragging && (!sidebarResizer.hasPointerCapture || !sidebarResizer.hasPointerCapture(e.pointerId))) {
                onPointerMove(e);
            }
        });
        window.addEventListener('mouseup', (e) => {
            if (isDragging) {
                onPointerUp(e);
            }
        });

        //Doble clic para alternar tamaño rápidamente entre 380px y 560px
        sidebarResizer.addEventListener('dblclick', (e) => {
            e.preventDefault();
            window.toggleSidebarWidth();
        });
    }

    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
        brandLogo.addEventListener('click', () => {
            switchTab('search');
        });
    }

    const btnResetView = document.getElementById('btn-reset-map-view');
    if (btnResetView) {
        btnResetView.addEventListener('click', () => {
            if (map) {
                map.panTo({ lat: -16, lng: -63 });
                map.setZoom(4);
                if (currentInfoWindow) currentInfoWindow.close();
            }
        });
    }

    //Inicializar UI de botones correctamente
    updateSidebarButtonsUI();
}

function switchTab(tabId) {
    currentActiveTab = tabId;

    if (sidebarDual && sidebarDual.classList.contains('collapsed')) {
        sidebarDual.classList.remove('collapsed');
        updateSidebarButtonsUI();
    }

    railBtns.forEach(b => {
        if (b.getAttribute('data-tab') === tabId) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    panelSections.forEach(section => {
        if (section.id === `section-${tabId}`) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    if (tabId === 'admin') {
        renderAdminList();
    } else if (tabId === 'terrain') {
        renderTerrainPresets();
        setMapVisualMode('terrain', true);
    } else if (tabId === 'search') {
        setTimeout(() => searchInput.focus(), 150);
    }
}

//Contribuciones
const formMessage = document.getElementById('form-message');

function initSubmissionForm() {
    if (!songForm) return;

    songForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newSong = {
            id: Date.now(),
            title: document.getElementById('song-title').value.trim(),
            artist: document.getElementById('song-artist').value.trim(),
            terrain: document.getElementById('song-terrain').value.trim(),
            lat: parseFloat(document.getElementById('song-lat').value),
            lng: parseFloat(document.getElementById('song-lng').value),
            context: document.getElementById('song-context').value.trim(),
            ytLink: document.getElementById('yt-link').value.trim(),
            status: 'pending'
        };

        songsDatabase.push(newSong);
        saveSongs(songsDatabase);
        updatePendingBadge();

        formMessage.textContent = '¡Propuesta enviada con éxito! Queda en revisión en el Validador.';
        formMessage.className = 'success';
        formMessage.classList.remove('hidden');

        songForm.reset();
        setTimeout(() => formMessage.classList.add('hidden'), 5000);
    });
}

//Validaciones (Admin)
const adminCardsList = document.getElementById('admin-cards-list');
const pendingCountBadge = document.getElementById('pending-count-badge');

function updatePendingBadge() {
    const pendingCount = songsDatabase.filter(s => s.status === 'pending').length;
    if (pendingCount > 0) {
        pendingCountBadge.textContent = pendingCount;
        pendingCountBadge.classList.remove('hidden');
    } else {
        pendingCountBadge.classList.add('hidden');
    }
}

function renderAdminList() {
    if (!adminCardsList) return;
    adminCardsList.innerHTML = '';

    const sorted = [...songsDatabase].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
    });

    if (sorted.length === 0) {
        adminCardsList.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:2rem 0;">No hay propuestas registradas.</p>`;
        return;
    }

    sorted.forEach(song => {
        const isPending = song.status === 'pending';
        const card = document.createElement('div');
        card.className = 'admin-card';

        const actionsHtml = isPending ? `
            <div class="admin-card-actions">
                <button class="btn-admin-action approve" onclick="approveSong(${song.id})">
                    <i data-lucide="check"></i> Aprobar
                </button>
                <button class="btn-admin-action reject" onclick="rejectSong(${song.id})">
                    <i data-lucide="trash-2"></i> Rechazar
                </button>
            </div>
        ` : `<div style="font-size:0.75rem; color:var(--success); font-weight:600;"><i data-lucide="check-circle" style="width:12px; height:12px; display:inline;"></i> Aprobada y visible en el mapa</div>`;

        card.innerHTML = `
            <div class="admin-card-header">
                <div>
                    <h4 class="admin-card-title">${song.title}</h4>
                    <span class="admin-card-artist">${song.artist}</span>
                </div>
                <span class="badge ${isPending ? 'pending' : 'approved'}">${isPending ? 'Pendiente' : 'Aprobado'}</span>
            </div>
            ${song.terrain ? `<span style="font-size:0.75rem; color:var(--primary-light);">⛰️ Terreno: ${song.terrain}</span>` : ''}
            <div class="admin-card-context">${song.context}</div>
            <div class="admin-card-coords-row">
                <span class="admin-card-coords" title="Latitud: ${song.lat}, Longitud: ${song.lng}">
                    <i data-lucide="map-pin"></i> ${formatCoordinate(song.lat)}, ${formatCoordinate(song.lng)}
                </span>
                <a href="${song.ytLink}" target="_blank" style="color:var(--primary-light); flex-shrink:0;">Ver Video</a>
            </div>
            ${actionsHtml}
        `;

        adminCardsList.appendChild(card);
    });

    lucide.createIcons();
    updatePendingBadge();
}

window.approveSong = (id) => {
    const song = songsDatabase.find(s => s.id === id);
    if (song) {
        song.status = 'approved';
        saveSongs(songsDatabase);
        renderAdminList();
        renderMapMarkers();
        updatePendingBadge();
    }
};

window.rejectSong = (id) => {
    if (confirm('¿Deseas rechazar y eliminar esta propuesta?')) {
        songsDatabase = songsDatabase.filter(s => s.id !== id);
        saveSongs(songsDatabase);
        renderAdminList();
        renderMapMarkers();
        updatePendingBadge();
    }
};

//Reportar un problema
const reportModal = document.getElementById('report-modal');
const reportForm = document.getElementById('report-form');
const btnCloseReportModal = document.getElementById('btn-close-report-modal');
const btnCancelReport = document.getElementById('btn-cancel-report');
const reportSectionOrigin = document.getElementById('report-section-origin');
const reportFeedback = document.getElementById('report-feedback');

function initReportModal() {
    //Escuchar clics en todos los botones de "Reportar un problema" de cada menú
    document.querySelectorAll('.btn-report-issue').forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.getAttribute('data-section') || 'General';
            openReportModal(section);
        });
    });

    if (btnCloseReportModal) {
        btnCloseReportModal.addEventListener('click', closeReportModal);
    }
    if (btnCancelReport) {
        btnCancelReport.addEventListener('click', closeReportModal);
    }

    //Cerrar al hacer clic fuera del modal
    if (reportModal) {
        reportModal.addEventListener('click', (e) => {
            if (e.target === reportModal) {
                closeReportModal();
            }
        });
    }

    //Envío del reporte
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const report = {
                id: Date.now(),
                date: new Date().toISOString(),
                section: reportSectionOrigin.value,
                issueType: document.getElementById('report-issue-type').value,
                description: document.getElementById('report-description').value.trim(),
                contact: document.getElementById('report-contact').value.trim()
            };

            //Guardar reporte en localStorage
            const existingReports = JSON.parse(localStorage.getItem('atlas_reported_issues') || '[]');
            existingReports.push(report);
            localStorage.setItem('atlas_reported_issues', JSON.stringify(existingReports));

            reportFeedback.textContent = '¡Gracias! Tu reporte ha sido recibido para su revisión técnica y pedagógica.';
            reportFeedback.classList.remove('hidden');

            setTimeout(() => {
                reportForm.reset();
                reportFeedback.classList.add('hidden');
                closeReportModal();
            }, 2200);
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

//Inicialización Global
function startApp() {
    if (window._atlasAppStarted) return;
    window._atlasAppStarted = true;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        lucide.createIcons();
    }
    initNavigation();
    initSearchFeature();
    initMapLocationSearch();
    initSubmissionForm();
    initTerrainFeature();
    renderTerrainPresets();
    initReportModal();
    updatePendingBadge();
    setupMapEngine();

    //Seleccionar automáticamente la primera canción para deleitar al usuario en su primera vista
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
