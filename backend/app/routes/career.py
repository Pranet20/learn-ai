from fastapi import APIRouter

router = APIRouter()

@router.get("/recommendations")
async def get_career_advice():
    return [
        {
            "role": "Data Scientist",
            "match_score": 85,
            "description": "Uses math and coding to solve complex problems.",
            "requirements": {"Algebra": 80, "Coding": 90, "Physics": 50},
            "status": "Ready to Apply"
        },
        {
            "role": "Software Engineer",
            "match_score": 65,
            "description": "Builds scalable applications and systems.",
            "requirements": {"Coding": 95, "Algebra": 60, "Physics": 40},
            "status": "Skill Gap: Coding"
        },
        {
            "role": "Aerospace Researcher",
            "match_score": 40,
            "description": "Studies the mechanics of flight and space.",
            "requirements": {"Physics": 95, "Algebra": 90, "Coding": 70},
            "status": "Skill Gap: Physics"
        }
    ]
