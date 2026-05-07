from .risk_patterns import detect_risk_patterns, calculate_pattern_penalty, detect_contradiction

def calculate_production_trust(
    text_confidence: float, 
    bert_prediction: str,
    image_authenticity: float,
    source_credible: bool,
    geo_verified: bool,
    input_text: str,
    image_suspicious: bool,
    news_score: float = 1.0
) -> tuple:
    """Production-level dynamic trust scoring"""
    
    # 1. Input validation penalty
    text_length = len(input_text.strip())
    validation_penalty = 0.3 if text_length < 10 else 0.0
    
    # 2. Risk pattern detection
    patterns = detect_risk_patterns(input_text)
    pattern_penalty = calculate_pattern_penalty(patterns)
    
    # 3. Multimodal contradiction
    contradiction, contradiction_penalty = detect_contradiction(
        bert_prediction, image_suspicious, source_credible
    )
    
    # 4. Weighted fusion
    text_weight = 0.4
    image_weight = 0.2
    source_weight = 0.2
    news_weight = 0.15
    geo_weight = 0.05
    
    base_score = (
        text_confidence * text_weight +
        (image_authenticity / 100) * image_weight +
        (1.0 if source_credible else 0.2) * source_weight +
        news_score * news_weight +
        (1.0 if geo_verified else 0.3) * geo_weight
    )
    
    # 5. Apply all penalties
    total_penalty = (
        validation_penalty +
        pattern_penalty +
        contradiction_penalty
    )
    
    final_score = max(0, min(1.0, base_score - total_penalty)) * 100
    
    # 6. Dynamic trust level
    if final_score >= 75:
        level = 'High Trust 🟢'
    elif final_score >= 50:
        level = 'Medium Trust 🟡'
    elif final_score >= 25:
        level = 'Low Trust 🟠'
    else:
        level = 'Critical Risk 🔴'
    
    return final_score, level, {
        'contradiction_detected': contradiction,
        'pattern_penalty': pattern_penalty,
        'suspicious_patterns': patterns,
        'input_validation_ok': validation_penalty == 0
    }

