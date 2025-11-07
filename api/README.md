# PIGEON API

FastAPI backend for serving the PIGEON geolocation prediction model.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Ensure the PIGEON model weights are available at the path specified in `../config.py`

3. Start the API server:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## Endpoints

### `GET /`
Health check endpoint

### `GET /health`
Returns model loading status

### `POST /predict`
Upload an image and get predicted coordinates

**Request:** multipart/form-data with `file` field containing the image

**Response:**
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "confidence": 0.85,
  "status": "success"
}
```

## Notes

- The API loads the PIGEON model on startup
- Predictions are CPU-intensive; GPU recommended for production use
- CORS is enabled for all origins in development
