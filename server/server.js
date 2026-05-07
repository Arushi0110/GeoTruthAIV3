require('dotenv').config({ path: '../.env' });
const app = require('./src/app');

const PORT = process.env.PORT || 3000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

app.listen(PORT, () => {
  console.log(`🚀 GeoTruthAI Server running on port ${PORT}`);
  console.log(`📡 ML Service: ${ML_SERVICE_URL}`);
});
