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

function formatCoordinate(val, maxDecimals = 4) {
    if (val === null || val === undefined || val === "" || isNaN(Number(val))) return '—';
    return Number(val).toFixed(maxDecimals);
}

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
let currentMapMode = localStorage.getItem('atlas_map_mode') || 'dark';
let topoBadgeTimeout = null;

let map = null;
let currentBaseLayer = null;
const tileLayers = {};
const markersMap = new Map();
let pointedLocationMarker = null;

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

function initLeafletMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer || typeof L === 'undefined') return;

    if (map) {
        map.remove();
        map = null;
    }

    mapContainer.innerHTML = '';

    map = L.map(mapContainer, {
        center: [-16, -63],
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

    map.on('click', (e) => {
        const lat = parseFloat(e.latlng.lat.toFixed(4));
        const lng = parseFloat(e.latlng.lng.toFixed(4));

        if (currentActiveTab === 'map') {
            reverseGeocodePoint(lat, lng, (placeName) => {
                pointLocationOnMap(lat, lng, placeName);
            });
        } else if (currentActiveTab === 'submit') {
            const latInput = document.getElementById('song-lat');
            const lngInput = document.getElementById('song-lng');
            if (latInput && lngInput) {
                latInput.value = lat;
                lngInput.value = lng;
            }
        }
    });

    renderMapMarkers();
    pointLocationOnMap(-13.1631, -72.5450, "Cusco / Machu Picchu, Perú");

    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 250);
}

function extractVideoID(url) {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
}

function createMusicPinIcon(isActive = false) {
    return L.divIcon({
        className: 'custom-music-pin',
        html: `
            <div class="music-pin-wrapper ${isActive ? 'active' : ''}">
                <div class="music-pin-shadow"></div>
                <div class="music-pin-body">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
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

    const approvedSongs = songsDatabase.filter(s => s.status === 'approved');

    approvedSongs.forEach(song => {
        const isSelected = (song.id === selectedSongId);
        const marker = L.marker([song.lat, song.lng], {
            icon: createMusicPinIcon(isSelected),
            title: `${song.title} - ${song.artist}`
        }).addTo(map);

        const videoId = extractVideoID(song.ytLink);
        const embedHtml = videoId
            ? `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
            : `<p style="color:var(--danger); font-size:0.8rem;">Enlace no disponible</p>`;

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

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-leaflet-popup'
        });

        marker.on('click', () => {
            selectSong(song, false);
            switchTab('search');
        });

        markersMap.set(song.id, marker);
    });
}

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
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function pointLocationOnMap(lat, lng, placeName) {
    const localityNameEl = document.getElementById('locality-name');
    const localityLatEl = document.getElementById('map-locality-lat');
    const localityLngEl = document.getElementById('map-locality-lng');
    const localityLatFill = document.getElementById('map-locality-lat-fill');
    const localityLngFill = document.getElementById('map-locality-lng-fill');

    if (localityNameEl) localityNameEl.textContent = placeName || "Punto apuntado en el mapa";
    if (localityLatEl) localityLatEl.textContent = `${formatCoordinate(lat)}°`;
    if (localityLngEl) localityLngEl.textContent = `${formatCoordinate(lng)}°`;

    const latPct = Math.min(100, Math.max(10, ((lat + 60) / 90) * 100));
    const lngPct = Math.min(100, Math.max(10, ((lng + 120) / 90) * 100));
    if (localityLatFill) localityLatFill.style.width = `${latPct}%`;
    if (localityLngFill) localityLngFill.style.width = `${lngPct}%`;

    if (map) {
        const radarIcon = L.divIcon({
            className: 'custom-pointer-pin',
            html: `
                <div class="pointer-pin-ring">
                    <div class="pointer-pin-dot"></div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        if (!pointedLocationMarker) {
            pointedLocationMarker = L.marker([lat, lng], {
                icon: radarIcon,
                title: placeName || "Localidad apuntada"
            }).addTo(map);
        } else {
            pointedLocationMarker.setLatLng([lat, lng]);
            pointedLocationMarker.setIcon(radarIcon);
        }
    }

    renderLocalityAssociatedSongs(lat, lng);
}

function renderLocalityAssociatedSongs(targetLat, targetLng) {
    const localitySongsList = document.getElementById('locality-songs-list');
    const localitySongsCount = document.getElementById('locality-songs-count');
    if (!localitySongsList) return;

    const approved = songsDatabase.filter(s => s.status === 'approved');
    const withDistance = approved.map(song => ({
        ...song,
        distanceKm: calculateDistanceKm(targetLat, targetLng, song.lat, song.lng)
    })).sort((a, b) => a.distanceKm - b.distanceKm);

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

window.contributeAtPoint = (lat, lng) => {
    switchTab('submit');
    const latInput = document.getElementById('song-lat');
    const lngInput = document.getElementById('song-lng');
    const titleInput = document.getElementById('song-title');
    if (latInput && lngInput) {
        latInput.value = lat;
        lngInput.value = lng;
    }
    if (titleInput) titleInput.focus();
};

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
    const targetScroll = pill.offsetLeft - (quickFiltersContainer.clientWidth / 2) + (pill.clientWidth / 2);
    quickFiltersContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setTimeout(updateFilterScrollButtons, 300);
}

function updateFilterScrollButtons() {
    if (!quickFiltersContainer || !btnScrollLeft || !btnScrollRight) return;
    const scrollLeft = quickFiltersContainer.scrollLeft;
    const maxScroll = quickFiltersContainer.scrollWidth - quickFiltersContainer.clientWidth;

    btnScrollLeft.classList.toggle('hidden', scrollLeft <= 4);
    btnScrollRight.classList.toggle('hidden', scrollLeft >= maxScroll - 4);
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

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    quickFiltersContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        quickFiltersContainer.classList.add('is-dragging');
        startX = e.pageX - quickFiltersContainer.offsetLeft;
        scrollStart = quickFiltersContainer.scrollLeft;
    });

    const stopDragging = () => {
        if (!isDown) return;
        isDown = false;
        quickFiltersContainer.classList.remove('is-dragging');
        updateFilterScrollButtons();
    };

    window.addEventListener('mouseup', stopDragging);
    quickFiltersContainer.addEventListener('mouseleave', stopDragging);

    quickFiltersContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const walk = (e.pageX - quickFiltersContainer.offsetLeft - startX) * 1.5;
        quickFiltersContainer.scrollLeft = scrollStart - walk;
    });

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
    quickFilters.forEach(pill => {
        const filter = pill.getAttribute('data-filter');
        if (filter !== 'all' && terrainName.toLowerCase().includes(filter.toLowerCase())) {
            quickFilters.forEach(p => p.classList.remove('active'));
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
        suggestionsDropdown.innerHTML = `<div class="suggestion-empty">No se encontraron canciones registradas para "${query}".</div>`;
    } else {
        matches.forEach(song => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';

            item.innerHTML = `
                <div class="suggestion-info">
                    <span class="suggestion-title">${highlightMatch(song.title, query)}</span>
                    <span class="suggestion-artist">${highlightMatch(song.artist, query)}</span>
                </div>
                ${song.terrain ? `<span class="suggestion-terrain">${song.terrain}</span>` : ''}
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

function selectSong(song, shouldFlyTo = true) {
    selectedSongId = song.id;

    if (shouldFlyTo && map) {
        focusSongOnMap(song.id);
    }

    syncActiveTerrainPill(song.terrain);

    const videoId = extractVideoID(song.ytLink);
    const embedHtml = videoId
        ? `<div class="video-container"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
        : `<p style="color:var(--danger); font-size:0.85rem; padding:0.5rem 0;">Enlace de YouTube no válido</p>`;

    const latPercent = Math.min(100, Math.max(10, ((song.lat + 60) / 90) * 100));
    const lngPercent = Math.min(100, Math.max(10, ((song.lng + 120) / 90) * 100));
    const hasTerrain = Boolean(song.terrain && song.terrain.trim() !== "");

    songDetailContainer.innerHTML = `
        <div class="selected-song-card">
            <div class="song-card-header">
                <h3 class="song-card-title">${song.title}</h3>
                <span class="song-card-artist">${song.artist}</span>
            </div>

            ${embedHtml}

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

            <div class="terrain-bar-card">
                <div class="terrain-bar-left">
                    <div class="terrain-bar-icon">
                        <i data-lucide="mountain"></i>
                    </div>
                    <div class="terrain-bar-content">
                        <span class="terrain-bar-title">Tipo de Terreno</span>
                        <span class="terrain-bar-val ${hasTerrain ? '' : 'empty'}">${hasTerrain ? song.terrain : '—'}</span>
                    </div>
                </div>
                <button class="btn-terrain-topo" onclick="focusSongTerrainTopography(${song.id})" title="Ver curvas de nivel y relieve de este terreno">
                    <i data-lucide="mountain-snow"></i>
                    <span>Ver Relieve</span>
                </button>
            </div>

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
    if (!song || !map) return;

    map.flyTo([song.lat, song.lng], 8, { duration: 1.5 });

    markersMap.forEach((marker, sId) => {
        marker.setIcon(createMusicPinIcon(sId === song.id));
    });

    const marker = markersMap.get(song.id);
    if (marker) {
        setTimeout(() => marker.openPopup(), 700);
    }
};

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

    if (map && tileLayers[mode]) {
        if (currentBaseLayer && map.hasLayer(currentBaseLayer)) {
            map.removeLayer(currentBaseLayer);
        }
        currentBaseLayer = tileLayers[mode];
        map.addLayer(currentBaseLayer);
    }

    document.querySelectorAll('.map-type-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-map-mode') === mode);
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
        else if (showFeedback && mode === 'roadmap') showMapTopoBadge("🗺️ Modo Estándar OpenStreetMap");
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
        markersMap.forEach((marker, sId) => {
            marker.setIcon(createMusicPinIcon(sId === song.id));
        });

        const marker = markersMap.get(song.id);
        if (marker) {
            setTimeout(() => marker.openPopup(), 700);
        }
    }

    showMapTopoBadge(`🏔️ Relieve: ${song.terrain || 'Topografía'} — ${song.title}`);
    updateTerrainInsightCard(
        `${song.terrain || 'Terreno Geográfico'} — ${song.locality}`,
        `Coordenadas: ${formatCoordinate(song.lat)}°, ${formatCoordinate(song.lng)}°`,
        song.context,
        song.terrain || 'Relieve Local',
        `${song.title} (${song.artist})`
    );
};

window.openTopographyMenu = function () {
    switchTab('terrain');
    setMapVisualMode('terrain', true);

    if (map) {
        let targetCoords = null;
        let targetName = '';

        if (selectedSongId) {
            const song = songsDatabase.find(s => s.id === selectedSongId);
            if (song) {
                targetCoords = [song.lat, song.lng];
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
                    targetCoords = [latVal, lngVal];
                    targetName = (nameEl ? nameEl.textContent : '') || 'Localidad activa';
                }
            }
        }

        if (targetCoords) {
            map.flyTo(targetCoords, 10, { duration: 1.5 });
            showMapTopoBadge(`Explorando relieve: ${targetName}`);
        } else {
            map.flyTo([-13.1631, -72.5450], 9, { duration: 1.5 });
            showMapTopoBadge("Modo Topográfico: Curvas de nivel y relieve activas");
        }
    }
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

    const btnMapToggleTopo = document.getElementById('btn-map-toggle-topo');
    if (btnMapToggleTopo) {
        btnMapToggleTopo.addEventListener('click', (e) => {
            e.preventDefault();
            window.openTopographyMenu();
        });
    }
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

            showMapTopoBadge(`🏔️ Explorando relieve: ${preset.name}`);
        });

        container.appendChild(card);
    });

    lucide.createIcons();
}

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

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function toggleSidebarCollapse() {
    if (!sidebarDual) return;
    sidebarDual.classList.toggle('collapsed');
    updateSidebarButtonsUI();

    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 320);
}

function toggleSidebarDock() {
    if (!appContainer) return;
    const isDockRight = !appContainer.classList.contains('dock-right');
    appContainer.classList.toggle('dock-right', isDockRight);

    try {
        localStorage.setItem('atlas_sidebar_dock', isDockRight ? 'right' : 'left');
    } catch (e) { }

    updateSidebarButtonsUI();

    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 320);
}

function toggleSidebarWidth() {
    if (!categoryPanel) return;
    if (sidebarDual && sidebarDual.classList.contains('collapsed')) {
        sidebarDual.classList.remove('collapsed');
    }
    const currentWidth = categoryPanel.offsetWidth || 380;
    const targetWidth = currentWidth >= 500 ? 380 : 560;
    applySidebarWidth(targetWidth, true);

    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 320);
}

function applySidebarWidth(widthPx, smooth = true) {
    if (!categoryPanel) return;
    const maxAllowed = Math.min(window.innerWidth - 120, 850);
    const clampedWidth = Math.max(260, Math.min(widthPx, maxAllowed));

    categoryPanel.classList.toggle('no-transition', !smooth);
    categoryPanel.style.width = `${clampedWidth}px`;
    document.documentElement.style.setProperty('--panel-width', `${clampedWidth}px`);

    if (smooth) {
        try {
            localStorage.setItem('atlas_sidebar_width', clampedWidth);
        } catch (e) { }
        updateSidebarButtonsUI();
    }
}

function initNavigation() {
    railBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
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
        if (localStorage.getItem('atlas_sidebar_dock') === 'right' && appContainer) {
            appContainer.classList.add('dock-right');
        }
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

            if (sidebarResizer.setPointerCapture && e.pointerId !== undefined) {
                try {
                    sidebarResizer.setPointerCapture(e.pointerId);
                } catch (err) { }
            }
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

            if (sidebarResizer.releasePointerCapture && e.pointerId !== undefined) {
                try {
                    sidebarResizer.releasePointerCapture(e.pointerId);
                } catch (err) { }
            }

            if (resizerBadge) resizerBadge.textContent = '↔ Ajustar ancho';

            applySidebarWidth(categoryPanel.offsetWidth || 380, true);
            if (map) map.invalidateSize();
        };

        sidebarResizer.addEventListener('pointerdown', onPointerDown);
        sidebarResizer.addEventListener('pointermove', onPointerMove);
        sidebarResizer.addEventListener('pointerup', onPointerUp);
        sidebarResizer.addEventListener('pointercancel', onPointerUp);

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
                map.flyTo([-16, -63], 4, { duration: 1.4 });
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
        setTimeout(() => searchInput.focus(), 150);
    }
}

const songForm = document.getElementById('song-form');
const formMessage = document.getElementById('form-message');
const adminCardsList = document.getElementById('admin-cards-list');
const pendingCountBadge = document.getElementById('pending-count-badge');

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

function startApp() {
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
    initTerrainFeature();
    renderTerrainPresets();
    initReportModal();
    updatePendingBadge();

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
