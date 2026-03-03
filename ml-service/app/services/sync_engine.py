def find_study_partner(target_user_id, all_profiles):
    target = all_profiles.get(target_user_id)
    target_gaps = [k for k, v in target['skills'].items() if v < 60]
    target_strengths = [k for k, v in target['skills'].items() if v > 85]

    best_match = None
    max_score = 0

    for peer_id, profile in all_profiles.items():
        if peer_id == target_user_id: continue
        
        peer_skills = profile['skills']
        score = sum(1 for gap in target_gaps if peer_skills.get(gap, 0) > 80)
        score += sum(1 for skill in target_strengths if peer_skills.get(skill, 0) < 50)

        if score > max_score:
            max_score = score
            best_match = peer_id
            
    return {"partner_id": best_match, "match_strength": max_score}
