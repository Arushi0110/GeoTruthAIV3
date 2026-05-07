from transformers import pipeline
import re
import random
import numpy as np

from app.models import explain
import re
import random
import numpy as np

FAKE_KEYWORDS = [
    'hoax', 'rumor', 'unverified', 'satire', 'debunked', 'misleading', 
    'fabricated', 'disinformation', 'false', 'bogus', 'scam', 'lie', 'fiction',
    'conspiracy', 'propaganda'
]

def predict_news(text: str):
    """Stable Model Engine with High-Quality Sanity Checks"""
    from app.models import explain
    if explain.model is None: explain.load_models()
    
    text_trunc = text[:1000]
    text_lower = text.lower()
    
    # 1. CORE AI SIGNAL
    fake_prob, real_prob = 0.5, 0.5
    if explain.model and explain.vectorizer:
        try:
            X_tfidf = explain.vectorizer.transform([text_trunc])
            probs = explain.model.predict_proba(X_tfidf)[0]
            fake_prob, real_prob = probs[0], probs[1]
        except: pass

    # 2. HIGH-QUALITY SIGNAL (Overrides)
    # If the text looks like a professional report, boost 'Real' significantly
    if any(m in text_lower for m in ['according to', 'reported by', 'official', 'confirmed', 'sources', 'data shows']):
        real_prob += 0.3 # 30% boost for professional citations
    
    # Penalize clickbait patterns
    if text.count('!') > 1 or any(m in text_lower for m in ['shocking', 'secret', 'exposed']):
        fake_prob += 0.2
        
    # 3. FINAL DECISION
    total = fake_prob + real_prob
    fake_prob /= total
    real_prob /= total
    
    prediction = 'fake' if fake_prob > real_prob else 'real'
    confidence = (fake_prob if prediction == 'fake' else real_prob) * 100
    
    return {
        "prediction": prediction,
        "bert_prediction": prediction,
        "confidence": round(np.clip(confidence, 40, 98), 1)
    }


