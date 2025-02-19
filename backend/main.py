import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.v1.auth import router as auth_router

app = FastAPI()

origin = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the LCSC Scheduler!"}

app.include_router(auth_router, prefix="/auth")
