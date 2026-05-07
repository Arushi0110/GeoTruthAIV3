import joblib
from lime.lime_text import LimeTextExplainer

model = joblib.load("models/fake_news_model.pkl")

explainer = LimeTextExplainer(class_names=["class0", "class1"])

def explain(text):
    exp = explainer.explain_instance(text, model.predict_proba, num_features=10)
    exp.show_in_notebook()