# PIGEON Web Interface

A web application for uploading images and predicting their geographic locations using the PIGEON model.

## Features

- Drag-and-drop image upload
- Real-time geolocation prediction
- Interactive map display with predicted location marker
- Predictions stored in Supabase database
- Responsive design

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Backend API

The frontend expects a Python FastAPI backend running on `http://localhost:8000` with the following endpoint:

- `POST /predict` - Accepts image file and returns predicted coordinates

To start the backend:

```bash
cd ../api
pip install -r requirements.txt
python main.py
```

## Environment Variables

The following variables are configured in `.env`:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
