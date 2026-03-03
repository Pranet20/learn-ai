from sqlalchemy.orm import Session
from app.models.user import User
from app.models.profile import Profile
import json

def update_user_skill_matrix(db: Session, user_id: int, matrix: dict):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        profile = Profile(user_id=user_id)
        db.add(profile)
    
    # Save the skill scores as a JSON string for the Radar Graph
    profile.subjects = json.dumps(matrix)
    db.commit()
    return profile

def get_user_profile_data(db: Session, user_id: int):
    return db.query(Profile).filter(Profile.user_id == user_id).first()