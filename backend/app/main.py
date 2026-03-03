from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.routes import auth, users, ai, assessments, courses, admin, career, ml
from app.routes import notes
Base.metadata.create_all(bind=engine)
from app.database import engine, Base
from app import models 
from app.routes import auth, ai
Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="LearnAI API",
    description="Backend for AI-Powered Education Platform",
    version="1.0.0"
)
class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response

app.add_middleware(CustomCORSMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This allows ANY frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["User Profile"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI & ML Engine"])
app.include_router(assessments.router, prefix="/api/v1/assessments", tags=["Assessments"])
app.include_router(courses.router, prefix="/api/v1/courses", tags=["Course Library"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin Analytics"])
app.include_router(career.router, prefix="/api/v1/career", tags=["Career Roadmap"])
app.include_router(notes.router, prefix="/api/v1/notes", tags=["Notes"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Tutor"])
app.include_router(ml.router, prefix="/api/v1/ml", tags=["Machine Learning"])
@app.get("/")
async def root():
    return {"message": "LearnAI Backend is Online", "status": "Ready"}
