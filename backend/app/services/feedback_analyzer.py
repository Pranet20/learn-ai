def analyze_sentiment(feedback_text: str):
    frustration_keywords = ["slow", "bored", "easy", "hard", "confused"]
    text = feedback_text.lower()
    if any(word in text for word in ["slow", "easy", "bored"]):
        return "ACCELERATE"
    elif any(word in text for word in ["hard", "confused", "stuck"]):
        return "DECELERATE"
    return "MAINTAIN"
