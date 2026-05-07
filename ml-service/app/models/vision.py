import numpy as np
from PIL import Image
import requests
from io import BytesIO
import imagehash
import time
from typing import Dict, Any

class VisionVerifier:
    @staticmethod
    def is_ai_generated(image_url: str) -> float:
        """Google Vision API + heuristics for AI-generated detection"""
        from google.cloud import vision
        import os
        # Skip credentials for API key mode - fallback if needed
        # os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'google_credentials.json'

        try:
            client = vision.ImageAnnotatorClient()
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            image = vision.Image(content=response.content)

            # Object detection + label confidence
            objects = client.object_localization(image=image).localized_object_annotations
            labels = client.label_detection(image=image).label_annotations

            # Heuristic: low confidence + generic labels = suspicious/AI
            if not objects or not labels or len(labels) < 3:
                return 0.7  # High AI prob

            ai_prob = 0.2  # Base low
            for label in labels[:5]:
                desc = (label.description or '').lower()
                if desc in ['digital art', 'illustration', 'rendering']:
                    ai_prob += 0.15
                if getattr(label, 'score', 1.0) < 0.6:
                    ai_prob += 0.1

            return min(0.95, ai_prob)
        except Exception as e:
            print(f"Vision API error: {e}")
            return 0.5  # Fallback

    @staticmethod
    def reverse_image_search(image_url: str) -> Dict[str, Any]:
        """Improved dummy reverse image search"""
        try:
            response = requests.get(image_url, timeout=10)
            response.raise_for_status()
            img = Image.open(BytesIO(response.content)).convert("RGB")
            phash = imagehash.phash(img)

            # Dummy matches with variety
            matches = [
                {'url': image_url, 'score': 1.0, 'source': 'Uploaded'},
                {'url': f"{image_url}?t={int(time.time())}", 'score': 0.92, 'source': 'News Agency 2024'},
            ]
            if np.random.random() > 0.7:
                matches.append({'url': 'https://stockphoto.com/image.jpg', 'score': 0.75, 'source': 'Stock Photo'})

            return {'matches': matches[:3], 'similarity_threshold': 0.8, 'is_stock': len(matches) > 1}
        except Exception as e:
            return {'matches': [], 'error': f'Image load failed: {e}', 'suspicious': True}

    @staticmethod
    def verify_image(image_url: str) -> Dict[str, Any]:
        ai_prob = VisionVerifier.is_ai_generated(image_url)
        reverse = VisionVerifier.reverse_image_search(image_url)

        authenticity = 1 - ai_prob if len(reverse.get('matches', [])) > 0 else 0.5
        is_suspicious = ai_prob > 0.3 or authenticity < 0.7
        return {
            'ai_probability': ai_prob,
            'authenticity_score': authenticity * 100,
            'reverse_matches': reverse.get('matches', [])[:3],
            'is_suspicious': is_suspicious
        }

