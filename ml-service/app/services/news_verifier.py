import re
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

# Production credibility scores (0-100) based on media bias charts / reliability ratings
TRUSTED_SOURCES = {
    # High reliability
    'cnn': 92, 'bbc': 95, 'reuters': 94, 'ap': 93, 'associated press': 93,
    'nytimes': 88, 'the guardian': 87, 'washington post': 85,
    # Medium 
    'fox news': 65, 'fox': 65, 'wall street journal': 78,
    # Low/Satire/Poor
    'breitbart': 35, 'infowars': 15, 'zerohedge': 28, 'daily caller': 42,
    # International
    'al jazeera': 82, 'nhk': 90
}

SUSPICIOUS_INDICATORS = ['fake', 'rumor', 'hoax', 'unverified', 'satire', 'opinion', 'breaking unconfirmed']

SOURCE_PATTERNS = re.compile(
    r'\\b(' + '|'.join(TRUSTED_SOURCES.keys()) + r')\\b',
    re.IGNORECASE
)

def extract_sources(text: str) -> List[str]:
    """Extract source mentions from text."""
    matches = SOURCE_PATTERNS.findall(text)
    return list(set(matches))  # unique

def verify_news(text: str) -> Dict:
    """GNews API real verification with smart query expansion"""
    import requests
    from urllib.parse import quote
    import re
    
    # 🗝️ GNews API Key (Prod-Ready)
    api_key = "a573ded2818bf6da30eb9fb579e3edc2"
    
    # 1. Smart Keyword Extraction (Heuristic)
    # Remove common words and keep entities/nouns
    stop_words = {'the', 'and', 'was', 'were', 'that', 'with', 'this', 'from', 'about', 'said', 'will'}
    words = re.findall(r'\b[A-Z]\w*\b|\b\w{5,}\b', text) # Cap words or long words
    keywords = [w for w in words if w.lower() not in stop_words]
    search_query = " ".join(keywords[:6]) # Best 6 words
    
    if not search_query:
        search_query = text[:100]

    try:
        # Strategy A: Direct Search
        url = f"https://gnews.io/api/v4/search?q={quote(search_query)}&token={api_key}&lang=en&max=10"
        resp = requests.get(url, timeout=7)
        data = resp.json()
        
        articles = data.get('articles', [])
        total_articles = data.get('totalArticles', 0)
        
        if total_articles == 0:
            # Strategy B: Broaden search if zero results
            fallback_query = " ".join(keywords[:3])
            url = f"https://gnews.io/api/v4/search?q={quote(fallback_query)}&token={api_key}&lang=en&max=5"
            resp = requests.get(url, timeout=5)
            data = resp.json()
            articles = data.get('articles', [])
            total_articles = data.get('totalArticles', 0)

        if total_articles == 0:
            return {
                "verified": False, 
                "credibility_score": 35, 
                "sources": [], 
                "reason": "News not found in mainstream media"
            }
        
        source_scores = []
        for article in articles:
            source = article['source']['name'].lower()
            # Dynamic weighting
            score = TRUSTED_SOURCES.get(source, 65) # Default 65 for unknown
            if any(domain in article['url'] for domain in ['.gov', '.edu', '.org']):
                score += 10
            source_scores.append(min(score, 100))
        
        avg_score = sum(source_scores) / len(source_scores)
        
        # Boost score if multiple sources report it
        if total_articles > 10: avg_score += 10
        elif total_articles > 3: avg_score += 5
        
        avg_score = min(avg_score, 98)
        verified = avg_score > 65
        
        sources = [
            {"title": a['source']['name'], "url": a['url'], "reliability": f"{s:.0f}%"} 
            for a, s in zip(articles, source_scores)
        ][:3]
        
        return {
            "verified": verified,
            "credibility_score": round(avg_score, 1),
            "sources": sources,
            "total_results": data['totalArticles'],
            "reason": "GNews API match" if verified else "Low source reliability"
        }
    except Exception as e:
        logger.error(f"GNews error: {e}")
        return {"verified": False, "credibility_score": 40, "sources": [], "reason": "API error fallback"}

