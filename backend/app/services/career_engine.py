def generate_career_roadmap(current_skills: dict, target_role: str):
    role_requirements = {
        "AI Engineer": {"Math": 90, "Logic": 95, "Coding": 85, "Physics": 70},
        "Data Scientist": {"Math": 85, "Logic": 80, "Coding": 75, "Statistics": 90}
    }
    
    reqs = role_requirements.get(target_role, {"General": 70})
    roadmap = []
    
    for skill, required_level in reqs.items():
        current_level = current_skills.get(skill, 0)
        if current_level < required_level:
            roadmap.append({
                "skill": skill,
                "gap": required_level - current_level,
                "recommendation": f"Take Advanced {skill} Module to reach industry standard of {required_level}%"
            })
            
    return roadmap
