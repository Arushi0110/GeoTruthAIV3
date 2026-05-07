from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import logging

from app.services.predict_service import process_news_prediction

logger = logging.getLogger(__name__)
router = APIRouter()

class NewsRequest(BaseModel):
    text: str
    image_url: Optional[str] = None

@router.post("/predict")
async def predict(request: NewsRequest):
    text = request.text.strip()
    image_url = request.image_url

    # Input validation
    if not text:
        return {
            "error": "Empty input",
            "trust_score": 0,
            "trust_level": "Low 🔴",
            "diagnostics": {"reason": "No content provided"}
        }

    try:
        return process_news_prediction(text, image_url)
    except Exception as e:
        logger.error(f"Predict failed: {str(e)}")
        return {
            "error": "Internal processing error (fallback)",
            "trust_score": 50.0,
            "trust_level": "Neutral ⚠️",
            "diagnostics": {"reason": "Safe fallback"}
        }
