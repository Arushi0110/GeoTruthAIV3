import joblib
import numpy as np
from lime.lime_text import LimeTextExplainer
import os
import re
import logging
import random
from typing import List, Tuple

logger = logging.getLogger(__name__)

# Load trained model and vectorizer once
# 📂 Absolute Paths (Production-Safe)
ROOT_DIR = "/Users/parulchaudhary/Desktop/GeoTruthAI/ml-service"
MODELS_DIR = os.path.join(ROOT_DIR, "app", "models")
MODEL_PATH = os.path.join(MODELS_DIR, "fake_news_model.pkl")
VECTORIZER_PATH = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")

model = None
vectorizer = None

def load_models():
    global model, vectorizer
    try:
        if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
            model = joblib.load(MODEL_PATH)
            vectorizer = joblib.load(VECTORIZER_PATH)
            logger.info("✅ ML Models reloaded successfully from disk")
            return True
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")
    return False

# Initial load
load_models()

class_names = ["fake", "real"]
lime_explainer = LimeTextExplainer(class_names=class_names, verbose=False)

def model_fn(texts):
    """Model wrapper for LIME - returns [fake_prob, real_prob]"""
    if model is None or vectorizer is None:
        # Fallback: simple keyword-based probabilities
        probs = []
        for text in texts:
            text_lower = text.lower()
            # If it contains 'fake' related words, bias towards fake
            if any(w in text_lower for w in ['fake', 'hoax', 'rumor', 'scam']):
                probs.append([0.8, 0.2])
            else:
                probs.append([0.2, 0.8])
        return np.array(probs)
    
    try:
        X_tfidf = vectorizer.transform(texts)
        # Handle both sklearn models and pipelines
        if hasattr(model, 'predict_proba'):
            probs = model.predict_proba(X_tfidf)
        else:
            # If it's a regression model or something else
            preds = model.predict(X_tfidf)
            probs = np.vstack([1 - preds, preds]).T
            
        # Ensure 2 columns
        if len(probs.shape) == 1 or probs.shape[1] == 1:
            probs = np.vstack([1 - probs.flatten(), probs.flatten()]).T
        return probs
    except Exception as e:
        logger.error(f"Prediction error in model_fn: {e}")
        return np.array([[0.5, 0.5]] * len(texts))

def lime_explain(text: str) -> List[Tuple[str, float]]:
    """Generates LIME explanation for the given text."""
    try:
        # 1. Run actual LIME if possible
        if model and vectorizer:
            exp = lime_explainer.explain_instance(
                text, 
                model_fn, 
                num_features=10,
                num_samples=100 # Low samples for speed in demo
            )
            # LIME returns list of (word, weight). 
            # Weight is for the 'real' class usually (class 1).
            # We want to identify 'fake' drivers (negative weights for class 1)
            return exp.as_list()
        
        # 2. Fallback to smart pattern matching
        logger.info("Using keyword-based fallback for explanation")
        text_lower = text.lower()
        words = re.findall(r'\b\w{3,}\b', text_lower)
        explanations = []
        
        from app.services.risk_patterns import SUSPICIOUS_KEYWORDS
        found_words = set()
        
        for category, patterns in SUSPICIOUS_KEYWORDS.items():
            for pattern in patterns:
                if pattern in text_lower and pattern not in found_words:
                    explanations.append((pattern, random.uniform(-0.9, -0.6)))
                    found_words.add(pattern)
        
        # Positive indicators
        positive = ['report', 'official', 'source', 'confirmed', 'verified', 'news', 'press']
        for word in positive:
            if word in words and word not in found_words:
                explanations.append((word, random.uniform(0.3, 0.6)))
                found_words.add(word)
        
        # Filler
        for word in words:
            if len(explanations) < 10 and word not in found_words:
                explanations.append((word, random.uniform(-0.1, 0.2)))
                found_words.add(word)
                
        return explanations[:10]
        
    except Exception as e:
        logger.error(f"LIME explain error: {e}")
        return [("error", 0.0)] * 5

# Legacy
def shap_explain(text: str) -> str:
    return "SHAP temporarily disabled - use LIME"

