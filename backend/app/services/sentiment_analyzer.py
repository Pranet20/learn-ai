def analyze_student_sentiment(text: str):
    acceleration_triggers = ["easy", "slow", "bored", "boring", "know this"]
    deceleration_triggers = ["hard", "confused", "stuck", "fast", "difficult", "help"]
    
    val = text.lower()
    
    if any(word in val for word in acceleration_triggers):
        return {"action": "INCREASE_PACE", "level_delta": 1, "sentiment": "Bored/Under-challenged"}
    
    if any(word in val for word in deceleration_triggers):
        return {"action": "DECREASE_PACE", "level_delta": -1, "sentiment": "Frustrated/Over-challenged"}
        
    return {"action": "MAINTAIN", "level_delta": 0, "sentiment": "Neutral"}
