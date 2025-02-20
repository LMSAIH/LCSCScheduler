from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import get_current_user
from typing import List
from models.schedule import Event
from datetime import datetime
import pytz
import uuid

router = APIRouter()

PST = pytz.timezone("America/Vancouver")

@router.get("/")
def get_schedule(supabase: Client = Depends(get_supabase), current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user.id
        today = datetime.now(PST).isoformat()

        query = supabase.table("events").select("*").filter("user_id", "eq", user_id).or_(f"event_type.eq.Recurrent, (event_type.eq.Temporary and start_time.gte.{today})").execute()

        # TODO

        return {"schedule": query.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting schedule: {str(e)}")
    
@router.post("/")
def set_schedule(events: List[Event], supabase: Client = Depends(get_supabase), current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user.id

        event_data = []

        for event in events:
            if (event.type == "Temporary" and event.start and event.end):
                start_time_iso = event.start.astimezone(PST).isoformat()
                end_time_iso = event.end.astimezone(PST).isoformat()
                event_data.append({
                    "user_id": user_id,
                    "start_time": start_time_iso,
                    "end_time": end_time_iso,
                    "event_type": "Temporary"
                })
            elif (event.type == "Permanent" and event.startTime and event.endTime and event.daysOfWeek):
                pass
            else:
                raise HTTPException(status_code=400, detail="Invalid event data.")

        response = supabase.rpc("replace_user_events", {"_user_id": user_id, "_event_data": event_data}).execute()

        if (response.data is None):
            raise HTTPException(status_code=500, detail="Database error")

        return {"message": "Schedule updated."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error setting schedule: {str(e)}")