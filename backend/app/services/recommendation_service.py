def generate_path(skill_matrix: dict, courses: list):
    path = []
    for topic, score in skill_matrix.items():
        if score < 60:
            # High priority for topics with gaps
            matching_course = next((c for c in courses if c.subject == topic), None)
            if matching_course:
                path.append({
                    "course_id": matching_course.id,
                    "priority": "Critical",
                    "reason": f"Knowledge gap detected in {topic}"
                })
    return sorted(path, key=lambda x: x['priority'])