import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from app.models import User
import json
def find_best_peer_match(db: Session, current_user_id: int):
    user = db.query(User).filter(User.id == current_user_id).first()
    others = db.query(User).filter(User.id != current_user_id).all()
    
    if not user or not others:
        return {"match_name": "No peers found", "reason": "Join some courses to find study buddies!"}

    subjects = ["Algebra", "Physics", "Coding", "Literature"]
    user_skills = json.loads(user.subjects)
    user_vec = np.array([[user_skills.get(s, 0) for s in subjects]])

    best_peer = None
    lowest_sim = 1.0

    for peer in others:
        peer_skills = json.loads(peer.subjects)
        peer_vec = np.array([[peer_skills.get(s, 0) for s in subjects]])
        sim = cosine_similarity(user_vec, peer_vec)[0][0]
        
        if sim < lowest_sim:
            lowest_sim = sim
            best_peer = peer

    return {
        "match_name": best_peer.name if best_peer else "Searching...",
        "reason": "They have complementary skills to help you grow!"
    }
