# 🚀 GeoTruthAI - Advanced Fake News Detection

## Architecture
Frontend (React) → Node Express API + Mongo → FastAPI ML Service → Response

## Quick Start

```bash
# 1. Install ML deps
cd ml-service
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# 2. Start Mongo (optional, Docker)
docker run -p 27017:27017 mongo

# 3. Start ML service
cd ../ml-service
uvicorn app.main:app --reload --port 8001

# 4. Install Node deps & start API
cd ../server
npm install
npm run dev

# 5. Frontend
cd ../client
npm install
npm run dev

# OR Docker
docker-compose up
```

## API Endpoints

**POST /api/verify**
```json
{
  "text": "Breaking news...",
  "image_url": "https://example.com/image.jpg",
  "userId": "user123"
}
```

**Response**:
- bert_prediction, confidence, lime_explanation (word weights)
- image_verification (AI prob, reverse matches)
- geo_locations, summary
- trust_score (weighted), trust_level
- user_trust_score

**ML Proxy**: /ml/predict

## Features
✅ Text BERT + LIME explainability  
✅ Image AI detect + reverse pHash  
✅ Geo NER locations  
✅ Advanced weighted trust  
✅ User trust tracking (Mongo)  
✅ Heatmap visualization  

## ML Service (localhost:8001)
- POST /predict: Full verification

Resume-ready production architecture!

