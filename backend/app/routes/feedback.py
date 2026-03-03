from fastapi import APIRouter
from pydantic import BaseModel
from app.services.feedback_analyzer import analyze_sentiment

router = APIRouter()

class FeedbackEntry(BaseModel):
    user_id: int
    content: str

@router.post("/adjust-pace")
def adjust_pace(entry: FeedbackEntry):
    action = analyze_sentiment(entry.content)
    return {
        "action": action,
        "message": f"Pacing adjusted to: {action.lower()}"
    }