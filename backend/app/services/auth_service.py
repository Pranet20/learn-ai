from datetime import datetime, timedelta
import uuid

def rotate_refresh_token(db: Session, old_token_str: str):
    token_record = db.query(RefreshToken).filter(RefreshToken.token == old_token_str).first()
    
    if not token_record or token_record.revoked:
        # Potential attack: Revoke all tokens for this user
        db.query(RefreshToken).filter(RefreshToken.user_id == token_record.user_id).update({"revoked": True})
        db.commit()
        return None

    # Invalidate old, issue new
    token_record.revoked = True
    new_token = str(uuid.uuid4())
    # ... logic to save and return new token