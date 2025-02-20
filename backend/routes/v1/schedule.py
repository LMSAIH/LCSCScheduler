from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import get_current_user
from typing import List
from models.schedule import Event
from datetime import datetime
import pytz

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
            event_data.insert(event)

        delete_response = supabase.table("events").delete().filter("user_id", "eq", user_id).execute()
        insert_response = supabase.table("events").insert(event_data).execute()

        # TODO

        return {"message": "Schedule updated."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error setting schedule: {str(e)}")