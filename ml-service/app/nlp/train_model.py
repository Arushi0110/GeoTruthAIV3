import pandas as pd
import numpy as np
import os
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import LabelEncoder

# =========================
# 1. LOAD DATA
# =========================
DATA_PATH = "data/processed/clean_data.csv"
df = pd.read_csv(DATA_PATH, low_memory=False)

print("Original shape:", df.shape)

# Clean required columns
df = df[["text", "type"]].dropna()

df = df.rename(columns={"type": "label"})

# remove weird labels
df = df[df["label"].apply(lambda x: isinstance(x, str))]

print("\nLabel distribution:\n", df["label"].value_counts())

# =========================
# 2. LABEL ENCODING
# =========================
le = LabelEncoder()
df["label"] = le.fit_transform(df["label"])

# =========================
# 3. SPLIT DATA
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["label"],
    test_size=0.2,
    random_state=42,
    stratify=df["label"]
)

# =========================
# 4. PIPELINES (IMPORTANT FIX)
# =========================
svm_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=5000, stop_words="english")),
    ("clf", LinearSVC())
])

rf_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=5000, stop_words="english")),
    ("clf", RandomForestClassifier(n_estimators=200))
])

# =========================
# 5. CROSS VALIDATION (LEVEL 2)
# =========================
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

print("\nTraining SVM...")
svm_pipeline.fit(X_train, y_train)

print("Training Random Forest...")
rf_pipeline.fit(X_train, y_train)

# =========================
# 6. EVALUATION
# =========================
def evaluate(model, name):
    pred = model.predict(X_test)
    print(f"\n===== {name} RESULTS =====")
    print("Accuracy:", accuracy_score(y_test, pred))
    print("F1-score:", f1_score(y_test, pred, average="weighted"))
    print(classification_report(y_test, pred))

evaluate(svm_pipeline, "Linear SVM")
evaluate(rf_pipeline, "Random Forest")

# =========================
# 7. GRID SEARCH (LEVEL 2 BOOST)
# =========================
print("\nRunning GridSearchCV for SVM...")

grid = {
    "clf__C": [0.1, 1, 10]
}

grid_search = GridSearchCV(
    svm_pipeline,
    grid,
    cv=cv,
    scoring="f1_weighted",
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

print("Best Params:", grid_search.best_params_)

best_model = grid_search.best_estimator_

# =========================
# 8. SAVE MODELS
# =========================
os.makedirs("models", exist_ok=True)

joblib.dump(best_model, "models/fake_news_model.pkl")
joblib.dump(le, "models/label_encoder.pkl")

print("\n✅ Model saved successfully!")