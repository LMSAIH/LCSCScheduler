from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import check_admin
from typing import List
from models.schedule import Availability
from datetime import datetime, timedelta
import pytz
from typing import Optional

router = APIRouter()

PST = pytz.timezone("America/Vancouver")

@router.get("/")
def get_availabilities(role: Optional[str] = Query(None, description="Role to filter by"), supabase: Client = Depends(get_supabase), admin_user = Depends(check_admin) ) -> List[Availability]:
    try:
        VALID_ROLES = ["Developer", "Volunteer", "President"] # TODO

        if role and role not in VALID_ROLES:
            raise HTTPException(status_code=400, detail="Invalid role.")

        today = datetime.now(PST)
        beginning_of_week = today - timedelta(days=today.weekday() + 1)
        beginning_of_week = beginning_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_week = beginning_of_week + timedelta(days=7)

        prev_sunday = beginning_of_week.isoformat()
        next_saturday = end_of_week.isoformat()

        events_query = supabase.table("events").select("*, profiles(*, user_roles(*))").or_(f"start_date.is.null, and(start_date.gte.'{prev_sunday}', start_date.lte.'{next_saturday}')").execute()
        events = events_query.data

        if role:
            profiles_query = supabase.table("profiles").select("*, user_roles!inner(*)").eq("verified", True).filter("user_roles.roles", "cs", f'{{"{role}"}}').execute()
        else:
            profiles_query = supabase.table("profiles").select("*").eq("verified", True).execute()

        max_people = len(profiles_query.data) if profiles_query.data else 0
        
        availability_slots = []
        for i in range(7): # TODO: use hashmap
            current_day = beginning_of_week + timedelta(days=i)
            for j in range(7, 20):
                slot_start = current_day.replace(hour=j, minute=0, second=0, microsecond=0)
                slot_end = current_day.replace(hour=j + 1, minute=0, second=0, microsecond=0)
                count = max_people

                for event in events:
                    user_roles_list = event["profiles"].get("user_roles", []) # TODO: cleanup

                    if role and not any(role in user_roles.get("roles", []) for user_roles in user_roles_list):
                        continue

                    elif event.get("event_type") == "Permanent" and event["start_time"] and event["end_time"] and event["day_of_week"] is not None:
                        event_day = beginning_of_week + timedelta(days=event["day_of_week"])

                        event_start_time = datetime.strptime(event["start_time"], "%H:%M:%S").time()
                        event_end_time = datetime.strptime(event["end_time"], "%H:%M:%S").time()

                        event_start = PST.localize(datetime.combine(event_day.date(), event_start_time))
                        event_end = PST.localize(datetime.combine(event_day.date(), event_end_time))

                    elif event["event_type"] == "Temporary" and event["start_date"] and event["end_date"]:
                        event_start = PST.localize(datetime.fromisoformat(event["start_date"]))
                        event_end = PST.localize(datetime.fromisoformat(event["end_date"]))

                    else:
                        continue

                    if event_end > slot_start and event_start < slot_end:
                        count -= 1

                availability_slots.append({
                    "startDate": slot_start,
                    "endDate": slot_end,
                    "numberOfPeople": count,
                    "maxPeopleAvailable": max_people,
                    "role": role if role else "All"
                })

        return availability_slots

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting availabilities: {str(e)}")