from fastapi import APIRouter, Depends
from app.services.sentiment_analyzer import analyze_student_sentiment
from pydantic import BaseModel

router = APIRouter()

class SentimentPayload(BaseModel):
    user_id: int
    message: str

@router.post("/analyze-and-adjust")
def adjust_pacing(payload: SentimentPayload):
    adjustment = analyze_student_sentiment(payload.message)
    return {
        "status": "success",
        "adjustment": adjustment,
        "ui_instruction": "Showing easier sub-modules" if adjustment["level_delta"] < 0 else "Skipping to advanced quiz"
    }
