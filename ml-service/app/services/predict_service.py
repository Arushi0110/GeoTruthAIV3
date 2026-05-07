import logging
from app.models.bert_model import predict_news
from app.models.explain import lime_explain
from app.services.news_verifier import verify_news
from app.utils.scoring import calculate_trust_score
from app.services.geo import get_geo_summary
from app.models.vision import VisionVerifier

logger = logging.getLogger(__name__)

def process_news_prediction(text: str, image_url: str = None) -> dict:
    # 1️⃣ BERT PREDICTION
    bert_result = predict_news(text)
    bert_confidence = bert_result.get("confidence", 50.0)

    # 2️⃣ LIME EXPLANATION
    import re
    explanation = lime_explain(text)
    highlighted_text = text
    suspicious_words = []
    
    # Sort and process top indicators
    sorted_exp = sorted(explanation, key=lambda x: abs(x[1]), reverse=True)
    for word, weight in sorted_exp[:10]:
        if weight < -0.02: # Lowered threshold for "Fake" markers
            suspicious_words.append(word)
            pattern = re.compile(re.escape(word), re.IGNORECASE)
            highlighted_text = pattern.sub(
                f'<span style="color: #ef4444; font-weight: 800; font-size: 1.1em; background: rgba(239, 68, 68, 0.1); padding: 0 4px; border-radius: 4px; border-bottom: 2px solid #ef4444;">{word}</span>',
                highlighted_text
            )
        elif weight > 0.04: # Lowered threshold for "Real" markers
            pattern = re.compile(re.escape(word), re.IGNORECASE)
            highlighted_text = pattern.sub(
                f'<span style="color: #10b981; font-weight: 800;">{word}</span>',
                highlighted_text
            )

    # 3️⃣ NEWS VERIFICATION
    news_data = verify_news(text)
    credibility_score = news_data.get("credibility_score", 50.0)
    source_credible = news_data.get("verified", False)
    sources = news_data.get("sources", [])

    # 4️⃣ GEO ANALYSIS
    geo_data = get_geo_summary(text)
    locations = geo_data.get('locations', [])
    geo_summary = geo_data.get('summary', "")

    # 5️⃣ IMAGE ANALYSIS
    image_data = {}
    image_authenticity = 50.0
    if image_url:
        try:
            image_data = VisionVerifier.verify_image(image_url)
            image_authenticity = image_data.get('authenticity_score', 50.0)
        except Exception as e:
            logger.error(f"Image verification failed: {e}")
            image_data = {"error": str(e)}

    # 6️⃣ PRODUCTION TRUST SCORE
    trust_score, trust_level, diagnostics = calculate_trust_score(
        bert_confidence,
        credibility_score,
        image_authenticity,
        suspicious_words,
        bert_result.get("prediction", "real"),
        news_data,
        image_data.get('is_suspicious', False),
        len(geo_data.get('locations', [])) > 0,
        text=text
    )

    return {
        "input_text": text,
        "image_url": image_url,
        "bert_prediction": bert_result.get("prediction"),
        "bert_confidence": bert_confidence,
        "lime_explanation": explanation[:10],
        "suspicious_words": suspicious_words,
        "highlighted_text": highlighted_text,
        "geo_locations": locations,
        "geo_summary": geo_summary,
        "news_verified": source_credible,
        "credibility_score": credibility_score,
        "sources": sources[:3],
        "image_verification": image_data,
        "trust_score": round(trust_score, 1),
        "trust_level": trust_level,
        "diagnostics": diagnostics
    }
