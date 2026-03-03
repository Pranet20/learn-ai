from fastapi import APIRouter

router = APIRouter()

@router.get("/stats")
async def get_platform_stats():
    return {
        "total_students": 1248,
        "active_courses": 42,
        "avg_completion_rate": 68,
        "avg_quiz_score": 75,
        "subject_performance": {
            "Algebra": 65,
            "Physics": 72,
            "Coding": 88,
            "Literature": 81
        }
    }

@router.get("/students")
async def get_recent_students():
    return [
        {"id": 1, "name": "Alex Johnson", "email": "alex@learnai.com", "progress": 85, "status": "Active"},
        {"id": 2, "name": "Sarah Miller", "email": "sarah@learnai.com", "progress": 42, "status": "Active"},
        {"id": 3, "name": "David Lee", "email": "david@learnai.com", "progress": 12, "status": "Inactive"},
        {"id": 4, "name": "Emma Wilson", "email": "emma@learnai.com", "progress": 95, "status": "Active"}
    ]
