import re
from typing import List, Dict

# Keyword-based NER (reliable, no heavy deps)
COMMON_LOCATIONS = [
    # India
    'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad',
    # US
    'new york', 'los angeles', 'chicago', 'houston', 'washington', 'miami', 'atlanta',
    # Europe
    'london', 'manchester', 'berlin', 'paris', 'rome', 'madrid', 'barcelona', 'amsterdam',
    # Asia
    'tokyo', 'beijing', 'shanghai', 'seoul', 'singapore', 'mumbai', 'delhi',
    # Others
    'global', 'international', 'worldwide'
]

import spacy
from typing import List
import os

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_locations(text: str) -> List[str]:
    """spaCy NER for proper location extraction"""
    doc = nlp(text)
    locations = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "LOC"]]
    return list(set(locations))[:10]

def get_geo_summary(text: str) -> Dict:
    """Geo summary - NEVER empty."""
    locations = extract_locations(text)
    
    # Robust fallback UX
    if not locations:
        locations = ["Global / General News Context"]
        summary = "Global coverage (no specific locations detected)"
        count = 1
    else:
        summary = ', '.join(locations[:3])
        count = len(locations)
    
    return {
        'locations': locations,
        'count': count,
        'summary': summary
    }

