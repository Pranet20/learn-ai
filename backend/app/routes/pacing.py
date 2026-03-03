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
    
    # In a production environment, this would update the 'current_difficulty' 
    # field in the User's Active Course record in PostgreSQL.
    return {
        "status": "success",
        "adjustment": adjustment,
        "ui_instruction": "Showing easier sub-modules" if adjustment["level_delta"] < 0 else "Skipping to advanced quiz"
    }