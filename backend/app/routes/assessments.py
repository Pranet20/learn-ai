from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import User
import json

router = APIRouter()

# What the frontend will send us
class QuizResult(BaseModel):
    email: str 
    subject: str
    score: int

@router.post("/submit")
def submit_assessment(result: QuizResult, db: Session = Depends(get_db)):
    # Find the user in the database
    user = db.query(User).filter(User.email == result.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Load their current proficiencies (the JSON dictionary)
    try:
        proficiencies = json.loads(user.subjects)
    except:
        proficiencies = {"Mathematics": 0, "Physics": 0, "Chemistry": 0, "Literature": 0}
    
    # Update the specific subject with the new score
    proficiencies[result.subject] = result.score
    
    # Save it back to the database
    user.subjects = json.dumps(proficiencies)
    db.commit()
    
    return {
        "message": f"Successfully updated {result.subject} to {result.score}%", 
        "new_stats": proficiencies
    }