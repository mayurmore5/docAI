from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import projects, generate

app = FastAPI(title="AI Document Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from services.firebase import initialize_firebase

@app.on_event("startup")
async def startup_event():
    initialize_firebase()

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Document Platform API"}

app.include_router(projects.router)
app.include_router(generate.router)
