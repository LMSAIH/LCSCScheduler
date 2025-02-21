from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import get_current_user
from typing import List
from models.schedule import Event
from datetime import datetime, timedelta
import pytz

router = APIRouter()

PST = pytz.timezone("America/Vancouver")

@router.get("/")
def get_schedule(supabase: Client = Depends(get_supabase), current_user: dict = Depends(get_current_user)) -> List[Event]:
    try:
        user_id = current_user.id

        today = datetime.now(PST)
        beginning_of_week = today - timedelta(days=today.weekday() + 1)
        beginning_of_week = beginning_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        prev_sunday = beginning_of_week.isoformat()

        query = supabase.table("events").select("*").filter("user_id", "eq", user_id).or_(f"start_date.is.null, start_date.gte.{prev_sunday})").execute()

        events = []

        for event in query.data:
            if (event["event_type"] == "Temporary"):
                events.append(Event(
                    id=event["calendar_id"],
                    title=event["event_type"],
                    start=datetime.fromisoformat(event["start_date"]),
                    end=datetime.fromisoformat(event["end_date"]),
                    color="yellow",
                    type=event["event_type"]
                ))
            elif (event["event_type"] == "Permanent"):
                events.append(Event(
                    id=event["calendar_id"],
                    title=event["event_type"],
                    daysOfWeek=[event["day_of_week"]],
                    startTime=event["start_time"],
                    endTime=event["end_time"],
                    color="green",
                    type=event["event_type"]
                ))

        return events
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting schedule: {str(e)}")
    
@router.post("/")
def set_schedule(events: List[Event], supabase: Client = Depends(get_supabase), current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user.id

        event_data = []

        for event in events:
            if (event.type == "Temporary" and event.start and event.end):
                event_data.append({
                    "user_id": user_id,
                    "calendar_id": event.id,
                    "start_date": event.start.isoformat(),
                    "end_date": event.end.isoformat(),
                    "event_type": event.type
                })
            elif (event.type == "Permanent" and event.startTime and event.endTime and event.daysOfWeek and len(event.daysOfWeek) > 0):
                event_data.append({
                    "user_id": user_id,
                    "calendar_id": event.id,
                    "start_time": event.startTime,
                    "end_time": event.endTime,
                    "day_of_week": event.daysOfWeek[0],
                    "event_type": event.type
                })
            else:
                raise HTTPException(status_code=400, detail="Invalid event data.")

        response = supabase.rpc("replace_user_events", {"_user_id": user_id, "_event_data": event_data}).execute()

        if (response.data is None):
            raise HTTPException(status_code=500, detail="Database error")

        return {"message": "Schedule updated."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error setting schedule: {str(e)}")