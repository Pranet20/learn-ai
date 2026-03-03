import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

class RecommendationEngine:
    def __init__(self):
        self.courses_df = pd.read_csv("data/courses.csv")
        
    def calculate_skill_gap(self, user_assessment):
        return [topic for topic, score in user_assessment.items() if score < 60]
    
    def content_based_filtering(self, user_profile, courses):
        user_vector = self._create_user_vector(user_profile)
        course_vectors = [self._create_course_vector(c) for c in courses]
        
        similarities = cosine_similarity([user_vector], course_vectors)[0]
        ranked_indices = np.argsort(similarities)[::-1]
        
        return [courses[i] for i in ranked_indices[:5]]

    def find_complementary_peer(self, target_user_id, user_profiles):
        target_profile = user_profiles.get(target_user_id)
        if not target_profile:
            return None

        target_weaknesses = set(self.calculate_skill_gap(target_profile['assessment']))
        target_strengths = set([t for t, s in target_profile['assessment'].items() if s >= 85])
        
        best_match = None
        highest_score = 0

        for peer_id, profile in user_profiles.items():
            if peer_id == target_user_id:
                continue
                
            peer_weaknesses = set(self.calculate_skill_gap(profile['assessment']))
            peer_strengths = set([t for t, s in profile['assessment'].items() if s >= 85])
            
            help_they_provide = len(target_weaknesses.intersection(peer_strengths))
            help_we_provide = len(target_strengths.intersection(peer_weaknesses))
            
            match_score = help_they_provide + help_we_provide
            
            if match_score > highest_score:
                highest_score = match_score
                best_match = peer_id
                
        return best_match

    def _create_user_vector(self, profile):
        return np.array([
            profile.get('grade', 10),
            profile.get('weekly_hours', 5),
            1 if profile.get('learning_style') == 'visual' else 0
        ])
    
    def _create_course_vector(self, course):
        return np.array([
            course.get('difficulty', 5),
            course.get('duration_weeks', 4),
            1 if course.get('format') == 'video' else 0
        ])