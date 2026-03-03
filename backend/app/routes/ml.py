from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import json

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
SECRET_KEY = "learn-ai-super-secret-key"
ALGORITHM = "HS256"

@router.get("/match")
def generate_study_insights(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    current_user = db.query(User).filter(User.email == email).first()

    try:
        my_stats = json.loads(current_user.subjects)
    except:
        my_stats = {"Mathematics": 0, "Physics": 0, "Chemistry": 0, "Literature": 0}
    focus_areas = []
    strengths = []
    
    for subject, score in my_stats.items():
        if score < 70:
            focus_areas.append({"subject": subject, "score": score, "gap": 100 - score})
        else:
            strengths.append({"subject": subject, "score": score})
            
    focus_areas.sort(key=lambda x: x["gap"], reverse=True)
    other_users = db.query(User).filter(User.id != current_user.id).all()
    all_peers = []
    
    for u in other_users:
        try:
            all_peers.append({"name": u.name, "stats": json.loads(u.subjects)})
        except:
            pass
    ghost_peers = [
        {"name": "Alex Developer", "stats": {"Mathematics": 90, "Physics": 85, "Chemistry": 95, "Literature": 60}},
        {"name": "Sarah Scientist", "stats": {"Mathematics": 70, "Physics": 95, "Chemistry": 50, "Literature": 80}},
        {"name": "David Math", "stats": {"Mathematics": 98, "Physics": 60, "Chemistry": 45, "Literature": 70}},
    ]
    all_peers.extend(ghost_peers)
    best_match = None
    highest_score = 0
    target_subject = focus_areas[0]["subject"] if focus_areas else "Mathematics"

    for peer in all_peers:
        peer_score = peer["stats"].get(target_subject, 0)
        if peer_score > highest_score:
            highest_score = peer_score
            best_match = peer

    match_rate = min(99, 50 + int((highest_score / 100) * 49)) if highest_score > 0 else 0

    return {
        "analyzed": True,
        "focus_areas": focus_areas,
        "strengths": strengths,
        "top_match": {
            "name": best_match["name"] if best_match else "No Match Found",
            "expertise": target_subject,
            "peer_score": highest_score,
            "match_rate": match_rate
        } if best_match else None
    }
