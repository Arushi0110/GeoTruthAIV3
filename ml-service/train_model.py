import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import os

# 📂 Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "app", "models")
MODEL_FILE = os.path.join(MODELS_DIR, "fake_news_model.pkl")
VECTORIZER_FILE = os.path.join(MODELS_DIR, "tfidf_vectorizer.pkl")

# 📚 Training Data (Enriched for better accuracy)
data = [
    # REAL NEWS
    ("The global economy is expected to grow by 3% this year according to the latest World Bank report.", "real"),
    ("Scientific researchers at MIT have discovered a new method for carbon capture in urban areas.", "real"),
    ("The official statement from the health department confirms that the new vaccine is safe for all ages.", "real"),
    ("Reuters reports that the diplomatic talks in Geneva have reached a successful conclusion.", "real"),
    ("According to the Associated Press, the local government has approved the new infrastructure bill.", "real"),
    ("BBC News: The annual climate summit has officially started in Glasgow today.", "real"),
    ("NASA's Perseverance rover has successfully collected its first rock sample from the Martian surface.", "real"),
    
    # FAKE NEWS
    ("Breaking!!! Scientists find secret cure for all diseases that the government is hiding from you.", "fake"),
    ("You won't believe it! Drinking this miracle juice heals cancer overnight. Click now!", "fake"),
    ("SHOCKING: Aliens have landed in Washington and are currently meeting with the President.", "fake"),
    ("URGENT: Banks are closing across the country. Withdraw your money immediately before it is gone!", "fake"),
    ("The world is ending tomorrow! Secret prophecy revealed. Must see video inside.", "fake"),
    ("Free money for everyone! The UN has announced a new global basic income of $5000 a month.", "fake"),
    ("Miracle cure discovered: This 5-minute trick reverses aging by 20 years instantly.", "fake"),
]

def train():
    print("🚀 Starting Professional Model Training...")
    
    X = [item[0] for item in data]
    y = [1 if item[1] == "real" else 0 for item in data]
    
    # 🧪 Build Pipeline
    # Use 1-3 grams for better context detection
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 3), max_features=5000)),
        ('clf', LogisticRegression(C=10)) # Stronger regularization
    ])
    
    print("⏳ Fitting model to GeoTruthAI dataset...")
    pipeline.fit(X, y)
    
    # 📦 Save separately as requested by our architecture
    model = pipeline.named_steps['clf']
    vectorizer = pipeline.named_steps['tfidf']
    
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    joblib.dump(model, MODEL_FILE)
    joblib.dump(vectorizer, VECTORIZER_FILE)
    
    print(f"✅ Training Complete! Model saved to {MODEL_FILE}")
    print(f"✅ Vectorizer saved to {VECTORIZER_FILE}")
    print("🛡️ GeoTruthAI is now more accurate.")

if __name__ == "__main__":
    train()
