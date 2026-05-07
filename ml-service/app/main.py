from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router
import logging

# ✅ Logging setup (important for debugging)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GeoTruthAI ML Service",
    description="AI-powered Fake News Detection Microservice",
    version="1.0.0"
)

# ✅ Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)}
    )

# ✅ CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔥 later restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routes
app.include_router(router)

# ✅ Health check (used by frontend + backend)
@app.get("/")
def home():
    return {
        "status": "OK",
        "service": "GeoTruthAI ML Service",
        "version": "1.0.0"
    }

# ✅ Additional health endpoint (for monitoring tools)
@app.get("/health")
def health():
    return {"status": "healthy"}

# ✅ Startup event (optional but useful)
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 ML Service started successfully")

# ✅ Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 ML Service stopped")