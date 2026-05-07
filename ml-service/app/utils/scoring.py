from typing import List, Dict, Any, Tuple
import logging
import random
import numpy as np

logger = logging.getLogger(__name__)

def calculate_trust_score(
    bert_confidence: float,
    news_credibility: float,
    image_score: float = 50.0,
    suspicious_words: List[str] = None,
    bert_prediction: str = 'real',
    news_data: Dict = None,
    image_suspicious: bool = False,
    geo_verified: bool = True,
    text: str = ""
) -> Tuple[float, str, Dict[str, Any]]:
    """
    Advanced Hybrid Trust Scoring (v3.0)
    Balanced weightage with strong penalty for fake signals.
    """
    weights = {
        'bert': 0.40,
        'news': 0.35,
        'image': 0.15,
        'patterns': 0.10
    }
    
    # AI Score (0-100)
    bert_val = bert_confidence if bert_prediction == 'real' else (100 - bert_confidence)
    
    # News Credibility
    news_val = news_credibility
    
    # Image Authenticity
    img_val = image_score
    
    # Pattern Penalty Logic
    pattern_score = 100
    text_lower = text.lower()
    
    # Caps penalty
    if text.isupper() and len(text) > 15: pattern_score -= 30
    
    # Sensationalism penalty
    sensational_words = ['shocking', 'unbelievable', 'exposed', 'secret', 'miracle', 'conspiracy']
    if any(w in text_lower for w in sensational_words):
        pattern_score -= 20
        
    # Suspicious word count penalty
    if suspicious_words:
        pattern_score -= min(30, len(suspicious_words) * 10)

    # Weighted Calculation
    trust = (
        (bert_val * weights['bert']) +
        (news_val * weights['news']) +
        (img_val * weights['image']) +
        (pattern_score * weights['patterns'])
    )

    # Final Smoothing
    trust = round(max(5, min(95, trust)), 1)
    
    # Adaptive Level
    if trust >= 75: level = "High 🟢"
    elif trust >= 40: level = "Neutral ⚠️"
    else: level = "Low 🔴"
    
    diagnostics = {
        'ai_contribution': round(bert_val * weights['bert'], 1),
        'verification_contribution': round(news_val * weights['news'], 1),
        'image_contribution': round(img_val * weights['image'], 1),
        'pattern_score': round(pattern_score * weights['patterns'], 1),
        'final_trust': trust
    }
    
    return trust, level, diagnostics

