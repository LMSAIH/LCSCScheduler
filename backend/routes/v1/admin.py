from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import get_current_user
from typing import List
from models.schedule import Availability
from datetime import datetime, timedelta
import pytz

router = APIRouter()

PST = pytz.timezone("America/Vancouver")

@router.get("/")
def get_availabilities(supabase: Client = Depends(get_supabase)):# -> List[Availability]:
    try:
        #user_id = current_user.id

        today = datetime.now(PST)
        beginning_of_week = today - timedelta(days=today.weekday() + 1)
        beginning_of_week = beginning_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_week = beginning_of_week + timedelta(days=7)

        prev_sunday = beginning_of_week.isoformat()
        next_saturday = end_of_week.isoformat()

        query = supabase.table("events").select("*, auth.users(*)").or_(f"start_date.is.null, and(start_date.gte.'{prev_sunday}', start_date.lte.'{next_saturday}')").execute()
        
        # for i in range(7):
        #     for j in range(24):
        #         print("hi")

        return query

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting availabilities: {str(e)}")