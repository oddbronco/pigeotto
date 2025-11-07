from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
import tempfile
import os
from PIL import Image
from models import CLIPEmbedding
from models.super_guessr import SuperGuessr
from config import *

app = FastAPI(title="PIGEON Geolocation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
embedder = None

def load_model():
    global model, embedder
    try:
        embedder = CLIPEmbedding(CLIP_MODEL, load_checkpoint=True, panorama=True)
        model = SuperGuessr.from_pretrained(CLIP_PRETRAINED_HEAD)
        model.eval()
        print("Model loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
        embedder = None

@app.on_event("startup")
async def startup_event():
    load_model()

@app.get("/")
async def root():
    return {"message": "PIGEON Geolocation API is running"}

@app.get("/health")
async def health_check():
    if model is None or embedder is None:
        return JSONResponse(
            status_code=503,
            content={"status": "unavailable", "message": "Model not loaded"}
        )
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict")
async def predict_location(file: UploadFile = File(...)):
    if model is None or embedder is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            contents = await file.read()
            tmp_file.write(contents)
            tmp_file_path = tmp_file.name

        try:
            image = Image.open(tmp_file_path).convert('RGB')

            with torch.no_grad():
                embedding = embedder.embed_single(image)
                prediction = model.predict(embedding)

            lat = float(prediction['latitude'])
            lng = float(prediction['longitude'])
            confidence = float(prediction.get('confidence', 0.0))

            return {
                "latitude": lat,
                "longitude": lng,
                "confidence": confidence,
                "status": "success"
            }

        finally:
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
