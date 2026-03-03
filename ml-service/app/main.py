from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="LearnAI ML Service")

class AssessmentData(BaseModel):
    user_id: int
    scores: Dict[str, int]

@app.post("/recommend")
def get_recommendations(data: AssessmentData):
    gaps = [topic for topic, score in data.scores.items() if score < 60]
    return {
        "user_id": data.user_id,
        "recommended_topics": gaps,
        "message": "Focus on these areas to improve your Skill Score."
    }
