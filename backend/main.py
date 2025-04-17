import os
from fastapi import FastAPI
from contextlib import asynccontextmanager
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import logging
from supabase import Client
from db.supabase_client import get_supabase
import pytz

from routes.v1.auth import router as auth_router
from routes.v1.schedule import router as schedule_router
from routes.v1.admin import router as admin_router
from routes.v1.roles import router as roles_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()
supabase = get_supabase()
PST = pytz.timezone("America/Vancouver")

def delete_expired_events():
    logger.info(f"Running cleanup at {datetime.now()}")
    try:
        query = supabase.table("events").delete().lt("end_date", datetime.now(PST)).eq("event_type", "Temporary").execute()
        logger.info(f"Deleted {len(query.data)} expired events.")
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")

scheduler.add_job(delete_expired_events, 'cron', day_of_week='sun', hour=0, minute=0, timezone='America/Vancouver')

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting scheduler...")
    scheduler.start()
    logger.info("Scheduler started successfully!")
    yield
    logger.info("Shutting down scheduler...")
    scheduler.shutdown()
    logger.info("Scheduler shut down successfully!")

logger.info("Starting app..")
app = FastAPI(lifespan=lifespan)

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
app.include_router(roles_router, prefix="/roles")