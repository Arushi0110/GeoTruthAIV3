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
    Advanced Hybrid Trust Scoring (v2.0)
    Combines BERT confidence, News API credibility, and Multimodal verification.
    """
    # 🛡️ Industry-Grade Weighted Logic
    weights = {
        'bert': 0.45,      # AI Model
        'news': 0.40,      # External verification
        'image': 0.10,     # Visual authenticity
        'patterns': 0.05   # Style/Tone
    }
    
    # Calculate individual components (0-100)
    bert_val = bert_confidence if bert_prediction == 'real' else (100 - bert_confidence)
    news_val = news_credibility
    img_val = image_score # Fixed parameter name
    
    # Pattern val based on text length and caps
    pattern_val = 100
    if text.isupper() and len(text) > 10: pattern_val -= 30
    if len(text) < 50: pattern_val -= 10
    
    # Weighted Aggregation (Balanced Stage)
    raw_trust = (
        (bert_val * weights['bert']) +
        (news_val * weights['news']) +
        (img_val * weights['image']) +
        (pattern_val * weights['patterns'])
    )
    
    # 🚀 ULTRA-POLARIZATION with Hard Constraints
    if bert_prediction == 'real':
        # Map 50-100 to 80-98 (Guaranteed High)
        trust = 80 + (raw_trust - 50) * 0.36 if raw_trust >= 50 else 80
    else:
        # Map 0-50 to 5-30 (Guaranteed Low)
        trust = 5 + (raw_trust) * 0.5 if raw_trust < 50 else 30
        
    trust = round(max(0, min(100, trust)), 1)
    level = "High 🟢" if trust >= 65 else "Low 🔴"
    
    diagnostics = {
        'ai_contribution': round(bert_val * weights['bert'], 1),
        'verification_contribution': round(news_val * weights['news'], 1),
        'image_contribution': round(img_val * weights['image'], 1),
        'pattern_penalty': round(100 - pattern_val, 1),
        'final_trust': trust
    }
    
    return trust, level, diagnostics

