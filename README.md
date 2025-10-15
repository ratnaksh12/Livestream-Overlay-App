## 1. Code Repo

**GitHub Repository:**  
  
`https://github.com/ratnaksh12/Livestream-Overlay-App`

***

## 2. API Documentation

### Overlay CRUD Endpoints (Flask Backend)

| Method   | Endpoint                  | Description                 | Request Body                           | Response (example)            |
|----------|---------------------------|-----------------------------|----------------------------------------|-------------------------------|
| GET      | `/api/overlays`           | Get all overlays            | -                                      | `[{"id":..., "type":..., ...}]`     |
| POST     | `/api/overlays`           | Create new overlay          | `{type, content, imageUrl, position, size}` | `{"success": true}`                |
| PUT      | `/api/overlays/<id>`      | Update an overlay           | `{type, content, imageUrl, position, size}` | `{"success": true}`                |
| DELETE   | `/api/overlays/<id>`      | Delete an overlay           | -                                      | `{"success": true}`                |

**Field Definitions**:  
- `type`: `"text"` or `"logo"`
- `content`: Text content for text overlays
- `imageUrl`: For logo overlays
- `position`: `{x: Number, y: Number}` – overlay coordinates
- `size`: `{width: Number, height: Number}` – overlay dimensions

**Usage:**  
- To create or update, send a `POST` or `PUT` request with JSON payload.
- To delete, send a `DELETE` request to the specific overlay id endpoint.
- All endpoints return JSON with either list of overlays or success status.

***

## 3. User Documentation

### Setup & Running the App

**Prerequisites:**
- Node.js (for React frontend)
- Python & Flask (for backend)
- MongoDB running locally or configure connection string

**Install & Run Backend:**
```bash
cd path/to/backend
pip install -r requirements.txt
python app.py
```
_Backend server runs at `http://127.0.0.1:5000`._

**Install & Run Frontend:**
```bash
cd path/to/livestream-frontend
npm install
npm start
```
_Frontend starts at `http://localhost:3000`._

***

### Managing Livestream & Overlays

**Change Livestream Video Source:**
- Open `src/LivestreamPlayer.js`
- Edit the value of `HLS_URL` to use your own HLS (or proxy-converted RTSP) stream URL.

**Add Overlays:**
- Use the “Add New Overlay” form to enter type, text or image URL.
- Click “Add” to place the overlay on the video.

**Edit/Delete Overlays:**
- Click “Edit” in the Overlay List section to adjust overlay properties.
- Use “Delete” to remove overlays.

**Resize/Drag Overlays:**
- Overlays can be resized or dragged on the video player by clicking and dragging.

***

**RTSP Note:**  
If your camera/service only provides RTSP, use a proxy/conversion tool (like ffmpeg or a cloud service) to get an HLS `.m3u8` URL before inputting as the source.

