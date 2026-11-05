
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from pathlib import Path
import tensorflow as tf
import numpy as np
import io

# Initialize FastAPI
app = FastAPI(
    title="Pneumonia Detection API",
    description="Chest X-ray classification using MobileNetV2",
    version="1.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get project directory
BASE_DIR = Path(__file__).resolve().parent

# Load the trained model
MODEL_PATH = BASE_DIR / "chest_xray_mobilenetv2.keras"
model = tf.keras.models.load_model(MODEL_PATH)

# Image configuration
IMAGE_SIZE = (224, 224)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Pneumonia Detection API is running",
        "model": "MobileNetV2",
        "status": "Ready"
    }


# Prediction endpoint
@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG or PNG image"
        )

    try:
        # Read uploaded image
        contents = await file.read()

        # Check empty file
        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )

        # Open and convert image to RGB
        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        # Resize image
        image = image.resize(IMAGE_SIZE)

        # Convert to NumPy array
        image_array = np.array(
            image,
            dtype=np.float32
        )

        # Add batch dimension
        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # Predict using trained model
        # Preprocessing is already inside the model
        probability = float(
            model.predict(image_array, verbose=0)[0][0]
        )

        # Classification
        if probability >= 0.5:
            prediction = "PNEUMONIA"
            confidence = probability * 100
        else:
            prediction = "NORMAL"
            confidence = (1 - probability) * 100

        # Return prediction result
        return {
            "filename": file.filename,
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "pneumonia_probability": round(
                probability * 100, 2
            )
        }

    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="Invalid or corrupted image"
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    finally:
        await file.close()
