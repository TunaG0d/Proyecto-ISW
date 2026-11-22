import http.server
import socketserver
import json
import sqlite3
import os
import mimetypes
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get("PORT", 8000))
DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")
BIOMES_PATH = os.path.join(os.path.dirname(__file__), "biomes.json")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        locality TEXT,
        geom_type TEXT DEFAULT 'point',
        lat REAL,
        lng REAL,
        coordinates_json TEXT,
        terrain TEXT,
        biome TEXT,
        tags TEXT,
        context TEXT NOT NULL,
        pedagogical_use TEXT,
        yt_link TEXT,
        status TEXT DEFAULT 'pending',
        moderation_note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        song_id INTEGER NOT NULL,
        author TEXT NOT NULL,
        content TEXT NOT NULL,
        role TEXT DEFAULT 'Estudiante',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT,
        issue_type TEXT,
        description TEXT,
        contact TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Check if songs exist, if not seed initial songs
    cursor.execute("SELECT COUNT(*) FROM songs")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_data = [
            (
                "Sube a Nacer Conmigo Hermano",
                "Los Jaivas",
                "Machu Picchu / Cusco, Perú",
                "point",
                -13.1631,
                -72.5450,
                None,
                "Altiplano / Cordillera",
                "Puna y Altiplano Andino",
                "Cordillera, Puna, Andino, Pablo Neruda, Charango, Alturas",
                "Obra fundamental que conecta la geografía andina con las alturas de Machu Picchu y la poesía de Pablo Neruda. Refleja la identidad territorial y la inmensidad de la cordillera de los Andes.",
                "Enseñanza de pisos ecológicos andinos, geomorfología de alta montaña y el diálogo entre literatura y geografía musical.",
                "https://www.youtube.com/watch?v=F3qE1Wb4gM0",
                "approved",
                "Validado con excelente contenido pedagógico."
            ),
            (
                "Río de los Pájaros Pintados (Ruta del Río Uruguay)",
                "Aníbal Sampayo",
                "Cuenca del Río Uruguay / Litoral Argentino-Uruguayo",
                "line",
                -31.3900,
                -58.0100,
                json.dumps([[-28.18, -54.95], [-29.72, -57.08], [-31.39, -58.01], [-32.48, -58.23], [-34.20, -58.35]]),
                "Cuenca Fluvial / Ribera",
                "Selva Paranaense y Espinal",
                "Río, Cuenca Fluvial, Litoral, Pesca Artesanal, Chamamé, Biodiversidad",
                "Retrata el trayecto del Río Uruguay ('río de los pájaros' en guaraní), la vida cotidiana de los pescadores artesanales y la flora ribereña que bordea la cuenca.",
                "Estudio de hidrografía fluvial sudamericana, cuencas compartidas y la influencia de los cursos de agua en los ritmos litoraleños.",
                "https://www.youtube.com/watch?v=kR2e_4o0Wqg",
                "approved",
                "Excelente representación de delimitación lineal (río/trayecto)."
            ),
            (
                "La Jardinera / Arriba Quemando el Sol",
                "Violeta Parra",
                "Pampa del Salitre / Desierto de Atacama, Chile",
                "polygon",
                -21.8000,
                -69.5000,
                json.dumps([[-20.10, -69.80], [-20.10, -69.20], [-23.50, -69.00], [-23.50, -70.10]]),
                "Desierto Hiperárido / Pampa",
                "Desierto de Atacama",
                "Desierto, Aridez, Salitre, Pampa, Clima Extremo, Resistencia",
                "Crónica descarnada del sol abrasador y la sequedad extrema del Desierto de Atacama, contrastada con la historia social de las oficinas salitreras chilenas.",
                "Comprensión de los climas áridos mundiales, la adaptación del ser humano en desiertos hiperáridos y la geografía económica del salitre.",
                "https://www.youtube.com/watch?v=Bq3W2Z7t3-c",
                "approved",
                "Aprobado: ejemplo sobresaliente de delimitación por área territorial."
            ),
            (
                "Zamba de mi Esperanza",
                "Jorge Cafrune",
                "Valles Calchaquíes / Salta, Argentina",
                "point",
                -24.7821,
                -65.4232,
                None,
                "Valles Calchaquíes",
                "Monte y Prepuna",
                "Quebrada, Valles, Gaucho, Zamba, Secano, Acústica de Valle",
                "Expresión viva del paisaje montañoso y quebradas del noroeste argentino, retratando la relación íntima entre el gaucho, la soledad y la aridez del relieve andino-pampeano.",
                "Geografía física del relieve de quebradas, valles transversales y su reflejo en la acústica de la zamba.",
                "https://www.youtube.com/watch?v=0hK22Qn5oYk",
                "approved",
                "Validado."
            ),
            (
                "La Flor de la Canela",
                "Chabuca Granda",
                "Lima / Valle del Rímac, Perú",
                "point",
                -12.0464,
                -77.0428,
                None,
                "Valle Costero",
                "Desierto Costero Pacífico",
                "Costa, Valle, Río Rímac, Vals Criollo, Oasis Costero",
                "Evoca la cuenca del río Rímac y los tradicionales puentes y alamedas de Lima. Describe la brisa costeña y la arquitectura tradicional del desierto costero peruano.",
                "Análisis de asentamientos humanos en cuencas áridas y desarrollo urbano junto a cursos de agua.",
                "https://www.youtube.com/watch?v=nO_3Vq27m1g",
                "approved",
                "Validado."
            ),
            (
                "El Pescador",
                "Totó la Momposina",
                "Depresión Momposina / Río Magdalena, Colombia",
                "polygon",
                9.2400,
                -74.4200,
                json.dumps([[9.15, -74.60], [9.35, -74.30], [9.10, -74.15], [8.90, -74.45]]),
                "Humedal Fluvial / Ciénaga",
                "Bosque Húmedo y Ciénagas del Caribe",
                "Ciénaga, Humedal, Río Magdalena, Cumbia, Tambora, Anfibio",
                "Homenaje poético al pescador que navega las ciénagas y brazos del río Magdalena. Refleja la simbiosis entre el ecosistema anfibio, la luna y la cadencia de la cumbia tradicional.",
                "Estudio de ecosistemas cenagosos, dinámica de inundaciones fluviales y culturas anfibias de Colombia.",
                "https://www.youtube.com/watch?v=eZ2vVUXZg3I",
                "approved",
                "Área de ciénagas validada."
            ),
            (
                "Canción de cuna para despertar a un negrito",
                "Inti-Illimani",
                "Camagüey / Antillas, Cuba",
                "point",
                21.5218,
                -77.7812,
                None,
                "Costa / Antillas",
                "Bosque Tropical Estacional y Manglar",
                "Caribe, Archipiélago, Afrocaribeño, Sincretismo, Manglares",
                "Muestra la influencia cultural afrocubana y su arraigo territorial en las antillas. Útil para enseñar sobre migraciones forzadas, paisajes caribeños y sincretismo.",
                "Geografía insular del Caribe, historia de la diáspora africana y mestizaje sonoro.",
                "https://www.youtube.com/watch?v=k4o9sFDBPzM",
                "pending",
                None
            ),
            (
                "Volver a los 17",
                "Violeta Parra",
                "San Carlos / Valle Central, Chile",
                "point",
                -36.6067,
                -72.1034,
                None,
                "Valle Central / Secano",
                "Bosque y Matorral Esclerófilo",
                "Secano, Valle Central, Campesinado, Clima Mediterráneo, Guitarra Traspuesta",
                "Composición nacida en el secano interior de la región de Ñuble, conectada con la flora campesina, las lomas de trigo y el sentir popular chileno.",
                "Ecosistemas de clima mediterráneo y paisajes agrícolas del valle central chileno.",
                "https://www.youtube.com/watch?v=s5e_U_6t5_Y",
                "approved",
                "Validado con relación geográfica confirmada."
            )
        ]

        cursor.executemany("""
        INSERT INTO songs (title, artist, locality, geom_type, lat, lng, coordinates_json, terrain, biome, tags, context, pedagogical_use, yt_link, status, moderation_note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_data)

        # Seed initial comments
        comments_seed = [
            (1, "Prof. Marcela Gómez", "Excelente recurso para la unidad de Geomorfología Andina en 7° básico. Los alumnos aprecian la conexión entre la altitud y los instrumentos de viento.", "Docente"),
            (1, "Lukas (Estudiante)", "El video en vivo en Machu Picchu ayuda mucho a imaginar el espacio acústico que describe Neruda.", "Estudiante"),
            (2, "Diego Silva", "Visualizar la cuenca completa del Río Uruguay como una línea en el mapa hace evidente cómo la música viaja por el agua entre Argentina y Uruguay.", "Geógrafo"),
            (3, "Martina J.", "La delimitación del área en la pampa salitrera contrasta perfectamente con la música del valle central. Muy pedagógico.", "Docente")
        ]
        cursor.executemany("""
        INSERT INTO comments (song_id, author, content, role)
        VALUES (?, ?, ?, ?)
        """, comments_seed)

    conn.commit()
    conn.close()

class MusicalAtlasHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for modern web development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/songs":
            self.handle_get_songs(query)
        elif path.startswith("/api/songs/") and path.endswith("/comments"):
            parts = path.split("/")
            song_id = parts[3]
            self.handle_get_comments(song_id)
        elif path.startswith("/api/songs/"):
            parts = path.split("/")
            song_id = parts[3]
            self.handle_get_song(song_id)
        elif path == "/api/biomes":
            self.handle_get_biomes()
        elif path == "/api/stats":
            self.handle_get_stats()
        else:
            # Serve static files from workspace root
            super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            body = json.loads(post_data.decode('utf-8')) if post_data else {}
        except Exception:
            body = {}

        if path == "/api/songs":
            self.handle_create_song(body)
        elif path.startswith("/api/songs/") and path.endswith("/comments"):
            parts = path.split("/")
            song_id = parts[3]
            self.handle_create_comment(song_id, body)
        elif path == "/api/reports":
            self.handle_create_report(body)
        else:
            self.send_error(404, "Endpoint no encontrado")

    def do_PUT(self):
        parsed = urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get('Content-Length', 0))
        put_data = self.rfile.read(content_length)

        try:
            body = json.loads(put_data.decode('utf-8')) if put_data else {}
        except Exception:
            body = {}

        if path.startswith("/api/songs/") and path.endswith("/moderate"):
            parts = path.split("/")
            song_id = parts[3]
            self.handle_moderate_song(song_id, body)
        elif path.startswith("/api/songs/"):
            parts = path.split("/")
            song_id = parts[3]
            self.handle_update_song(song_id, body)
        else:
            self.send_error(404, "Endpoint no encontrado")

    def handle_get_songs(self, query):
        status = query.get('status', [None])[0]
        search = query.get('search', [None])[0]
        biome = query.get('biome', [None])[0]
        tag = query.get('tag', [None])[0]

        sql = "SELECT * FROM songs WHERE 1=1"
        params = []

        if status and status != 'all':
            sql += " AND status = ?"
            params.append(status)
        elif not status:
            # default: return approved unless specified
            sql += " AND status = 'approved'"

        if search:
            search_pattern = f"%{search.strip()}%"
            sql += " AND (title LIKE ? OR artist LIKE ? OR locality LIKE ? OR context LIKE ? OR tags LIKE ?)"
            params.extend([search_pattern, search_pattern, search_pattern, search_pattern, search_pattern])

        if biome and biome != 'all':
            sql += " AND (biome LIKE ? OR terrain LIKE ?)"
            params.extend([f"%{biome}%", f"%{biome}%"])

        if tag and tag != 'all':
            sql += " AND tags LIKE ?"
            params.append(f"%{tag}%")

        sql += " ORDER BY id DESC"

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(sql, params)
        rows = cursor.fetchall()

        songs = []
        for r in rows:
            coords = None
            if r['coordinates_json']:
                try:
                    coords = json.loads(r['coordinates_json'])
                except Exception:
                    coords = None

            songs.append({
                "id": r['id'],
                "title": r['title'],
                "artist": r['artist'],
                "locality": r['locality'],
                "geomType": r['geom_type'] or 'point',
                "lat": r['lat'],
                "lng": r['lng'],
                "coordinates": coords,
                "terrain": r['terrain'],
                "biome": r['biome'],
                "tags": [t.strip() for t in r['tags'].split(',')] if r['tags'] else [],
                "context": r['context'],
                "pedagogicalUse": r['pedagogical_use'],
                "ytLink": r['yt_link'],
                "status": r['status'],
                "moderationNote": r['moderation_note'],
                "createdAt": r['created_at']
            })

        conn.close()
        self.send_json_response({"success": True, "count": len(songs), "songs": songs})

    def handle_get_song(self, song_id):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM songs WHERE id = ?", (song_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            self.send_json_response({"success": False, "error": "Canción no encontrada"}, status=404)
            return

        coords = None
        if row['coordinates_json']:
            try:
                coords = json.loads(row['coordinates_json'])
            except Exception:
                coords = None

        cursor.execute("SELECT * FROM comments WHERE song_id = ? ORDER BY id ASC", (song_id,))
        comments_rows = cursor.fetchall()
        comments = [{
            "id": c['id'],
            "author": c['author'],
            "content": c['content'],
            "role": c['role'],
            "createdAt": c['created_at']
        } for c in comments_rows]

        song_data = {
            "id": row['id'],
            "title": row['title'],
            "artist": row['artist'],
            "locality": row['locality'],
            "geomType": row['geom_type'] or 'point',
            "lat": row['lat'],
            "lng": row['lng'],
            "coordinates": coords,
            "terrain": row['terrain'],
            "biome": row['biome'],
            "tags": [t.strip() for t in row['tags'].split(',')] if row['tags'] else [],
            "context": row['context'],
            "pedagogicalUse": row['pedagogical_use'],
            "ytLink": row['yt_link'],
            "status": row['status'],
            "moderationNote": row['moderation_note'],
            "createdAt": row['created_at'],
            "comments": comments
        }
        conn.close()
        self.send_json_response({"success": True, "song": song_data})

    def handle_create_song(self, body):
        title = body.get('title', '').strip()
        artist = body.get('artist', '').strip()
        yt_link = body.get('ytLink', '').strip()
        context = body.get('context', '').strip()

        if not title or not artist or not yt_link or not context:
            self.send_json_response({"success": False, "error": "Campos obligatorios incompletos"}, status=400)
            return

        locality = body.get('locality', '')
        geom_type = body.get('geomType', 'point')
        lat = float(body.get('lat', 0.0))
        lng = float(body.get('lng', 0.0))
        coordinates = body.get('coordinates', None)
        coordinates_json = json.dumps(coordinates) if coordinates else None
        terrain = body.get('terrain', '')
        biome = body.get('biome', '')
        tags = body.get('tags', '')
        if isinstance(tags, list):
            tags = ", ".join(tags)
        pedagogical_use = body.get('pedagogicalUse', '')

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO songs (title, artist, locality, geom_type, lat, lng, coordinates_json, terrain, biome, tags, context, pedagogical_use, yt_link, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        """, (title, artist, locality, geom_type, lat, lng, coordinates_json, terrain, biome, tags, context, pedagogical_use, yt_link))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()

        self.send_json_response({
            "success": True,
            "message": "Propuesta enviada con éxito. Será revisada por los moderadores antes de aparecer en el mapa oficial.",
            "songId": new_id
        }, status=201)

    def handle_moderate_song(self, song_id, body):
        status = body.get('status')
        note = body.get('note', '')

        if status not in ('approved', 'rejected', 'pending'):
            self.send_json_response({"success": False, "error": "Estado inválido"}, status=400)
            return

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE songs SET status = ?, moderation_note = ? WHERE id = ?", (status, note, song_id))
        conn.commit()
        conn.close()

        self.send_json_response({"success": True, "message": f"Canción {status} correctamente."})

    def handle_get_comments(self, song_id):
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM comments WHERE song_id = ? ORDER BY id ASC", (song_id,))
        rows = cursor.fetchall()
        comments = [{
            "id": r['id'],
            "songId": r['song_id'],
            "author": r['author'],
            "content": r['content'],
            "role": r['role'],
            "createdAt": r['created_at']
        } for r in rows]
        conn.close()
        self.send_json_response({"success": True, "comments": comments})

    def handle_create_comment(self, song_id, body):
        author = body.get('author', 'Anónimo').strip() or 'Anónimo'
        content = body.get('content', '').strip()
        role = body.get('role', 'Docente / Estudiante').strip()

        if not content:
            self.send_json_response({"success": False, "error": "El comentario no puede estar vacío"}, status=400)
            return

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO comments (song_id, author, content, role) VALUES (?, ?, ?, ?)",
                       (song_id, author, content, role))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()

        self.send_json_response({"success": True, "message": "Comentario agregado.", "commentId": new_id}, status=201)

    def handle_create_report(self, body):
        section = body.get('section', '')
        issue_type = body.get('issueType', '')
        description = body.get('description', '')
        contact = body.get('contact', '')

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO reports (section, issue_type, description, contact) VALUES (?, ?, ?, ?)",
                       (section, issue_type, description, contact))
        new_id = cursor.lastrowid
        conn.commit()
        conn.close()

        self.send_json_response({"success": True, "message": "Reporte registrado.", "reportId": new_id}, status=201)

    def handle_get_biomes(self):
        if os.path.exists(BIOMES_PATH):
            with open(BIOMES_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self.send_json_response(data)
        else:
            self.send_json_response({"type": "FeatureCollection", "features": []})

    def handle_get_stats(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT status, COUNT(*) FROM songs GROUP BY status")
        counts = dict(cursor.fetchall())
        cursor.execute("SELECT COUNT(*) FROM comments")
        total_comments = cursor.fetchone()[0]
        conn.close()

        self.send_json_response({
            "approved": counts.get('approved', 0),
            "pending": counts.get('pending', 0),
            "rejected": counts.get('rejected', 0),
            "comments": total_comments
        })

    def send_json_response(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    init_db()
    print(f"Iniciando Servidor Atlas Musical Geográfico en http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), MusicalAtlasHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
