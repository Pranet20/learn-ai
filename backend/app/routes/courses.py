from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_all_courses():
    return [
        {
            "id": 1,
            "title": "Mastering Algebra Foundations",
            "subject": "Algebra",
            "instructor": "Dr. Sarah Chen",
            "duration": "2h 15m",
            "level": "Beginner",
            "progress": 30,
            "thumbnail": "bg-blue-500",
            "modules": [
                {"title": "Solving Linear Equations", "duration": "15m", "completed": True},
                {"title": "Understanding Functions", "duration": "25m", "completed": False},
                {"title": "Graphing on a Coordinate Plane", "duration": "20m", "completed": False}
            ]
        },
        {
            "id": 2,
            "title": "Physics: Kinematics & Dynamics",
            "subject": "Physics",
            "instructor": "Prof. James Miller",
            "duration": "4h 30m",
            "level": "Intermediate",
            "progress": 0,
            "thumbnail": "bg-emerald-500",
            "modules": [
                {"title": "Newton's Laws of Motion", "duration": "30m", "completed": False},
                {"title": "Calculating Velocity & Acceleration", "duration": "45m", "completed": False}
            ]
        },
        {
            "id": 3,
            "title": "Python Programming 101",
            "subject": "Coding",
            "instructor": "Alex Developer",
            "duration": "5h 00m",
            "level": "Beginner",
            "progress": 100,
            "thumbnail": "bg-indigo-500",
            "modules": [
                {"title": "Variables and Data Types", "duration": "20m", "completed": True},
                {"title": "Loops and Conditionals", "duration": "35m", "completed": True}
            ]
        }
    ]
