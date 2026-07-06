from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, ideas, evaluate, chat

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StartSmart AI API",
    description="Backend API for StartSmart AI Startup Evaluator & Business Mentor",
    version="1.0.0"
)

import os

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(auth.router, prefix="/api")
app.include_router(ideas.router, prefix="/api")
app.include_router(evaluate.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "project": "StartSmart AI"}
