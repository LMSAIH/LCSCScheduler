import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.v1.auth import router as auth_router
from routes.v1.schedule import router as schedule_router
from routes.v1.admin import router as admin_router

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
app.include_router(schedule_router, prefix="/schedule")
app.include_router(admin_router, prefix="/admin")
