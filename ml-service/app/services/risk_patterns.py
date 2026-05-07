from typing import List, Dict, Tuple
import re

SUSPICIOUS_KEYWORDS = {
    'authority': [
        r'who\\b', r'nasa\\b', r'un\\b', r'united nations', r'cdc\\b', r'fda\\b', 
        r'government says', r'official statement', r'breaking from white house'
    ],
    'medical': [
        r'cure[s]? cancer', r'instant cure', r'miracle cure', r'100% effective',
        r'no side effects', r'heals overnight', r'reverses aging', r'immune boost'
    ],
    'sensational': [
        r'breaking!!!?', r'world ending', r'millions dead', r'apocalypse', 
        r'never before seen', r'shocking truth', r'your mind blown'
    ],
    'clickbait': [
        r'free money', r'click now', r'you won[t]?', r'limited time', 
        r'secret revealed', r'must see', r'urgent', r'immediate'
    ]
}

def detect_risk_patterns(text: str) -> Dict[str, List[str]]:
    """Detect fake news patterns"""
    text_lower = text.lower()
    patterns = {}
    
    for category, keywords in SUSPICIOUS_KEYWORDS.items():
        matches = []
        for pattern in keywords:
            if re.search(pattern, text_lower, re.IGNORECASE):
                matches.append(pattern)
        patterns[category] = matches
    
    return patterns

def calculate_pattern_penalty(patterns: Dict) -> float:
    """Calculate penalty from detected patterns"""
    penalty = 0.0
    counts = sum(len(matches) for matches in patterns.values())
    
    if counts >= 3:
        penalty = 0.4
    elif counts >= 2:
        penalty = 0.3
    elif counts >= 1:
        penalty = 0.15
    
    return penalty

def detect_contradiction(bert_prediction: str, image_suspicious: bool, news_verified: bool) -> Tuple[bool, float]:
    """Detect multimodal contradiction"""
    contradiction = False
    penalty = 0.0
    
    if bert_prediction == 'fake' and image_suspicious:
        # Fake text + clean image = mismatch
        contradiction = True
        penalty = 0.25
    elif bert_prediction == 'real' and not news_verified:
        # Real text + unverified news = mismatch
        contradiction = True
        penalty = 0.20
    
    return contradiction, penalty

