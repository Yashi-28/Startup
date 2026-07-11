from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, ideas, evaluate, chat

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NexalQ API",
    description="Backend API for NexalQ Startup Evaluator & Business Mentor",
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
    return {"status": "healthy", "project": "NexalQ"}

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi import HTTPException

# Serve React Static Frontend
static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    # Mount assets folder
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    # Catch-all route to serve index.html or raw files (favicon, icons)
    @app.get("/{catchall:path}")
    def serve_react_app(catchall: str):
        # Exclude API endpoints from catch-all
        if catchall.startswith("api/") or catchall == "api":
            raise HTTPException(status_code=404, detail="Not Found")
        
        file_path = os.path.join(static_dir, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
            
        return FileResponse(os.path.join(static_dir, "index.html"))
