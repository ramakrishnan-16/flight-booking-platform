from fastapi import FastAPI

from app.api.routes import router


app = FastAPI(
    title="Flight Booking AI Service",
    version="1.0.0",
)


app.include_router(
    router,
    prefix="/api",
)


@app.get("/")
async def root():
    return {
        "success": True,
        "service": "Flight Booking AI Service",
        "llm": False,
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "llm": False,
    }