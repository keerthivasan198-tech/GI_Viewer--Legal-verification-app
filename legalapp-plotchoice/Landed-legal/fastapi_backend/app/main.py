from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from app.api.router import api_router

app = FastAPI(
    title="Landed Property Intelligence & Legal Backend",
    description="FastAPI Production Backend for Property Verification, Section 22-A Filtering, Valuation, and Deed Generation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "service": "Landed Legal & Property Intelligence FastAPI Backend",
        "framework": "FastAPI + Pydantic v2",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, reload=True)