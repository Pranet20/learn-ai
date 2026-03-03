from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import traceback

# 1. Import the NEW library
from google import genai 

# Force it to look for the .env file in the current directory
load_dotenv(dotenv_path=".env")

router = APIRouter()

# Grab the key safely
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# 2. Setup the NEW Client
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
    print("✅ Gemini AI Key Loaded Successfully with NEW GenAI Client!")
else:
    client = None
    print(" ERROR: Gemini API Key NOT FOUND. Check your .env file!")

class ChatRequest(BaseModel):
    prompt: str

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    if not client:
        return {"response": "🤖 I am currently in 'Offline Mode'. The backend cannot find the GEMINI_API_KEY in the .env file!"}

    try:
        system_prompt = (
            "You are an expert AI tutor for a student portal called LearnAI. "
            "You help students with subjects like Math, Physics, and Coding. "
            "Keep your answers friendly, highly educational, and concise.\n\n"
            f"Student asks: {request.prompt}"
        )
        
        # 3. Use the NEW generation syntax and latest flash model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=system_prompt,
        )
        
        return {"response": response.text}
    
    except Exception as e:
        print("--- AI ERROR TRACEBACK ---")
        traceback.print_exc()
        return {"response": f"Oops! Technical issue: {str(e)}"}