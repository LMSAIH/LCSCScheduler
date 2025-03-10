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
        end_of_week = end_of_week.replace(hour=23, minute=59, second=59, microsecond=999999)

        end_of_month = beginning_of_week + timedelta(days=28)
        end_of_month = end_of_month.replace(hour=23, minute=59, second=59, microsecond=999999)

        prev_sunday = beginning_of_week.isoformat()
        next_saturday = end_of_week.isoformat()
        last_saturday = end_of_month.isoformat()

        if role:
            profiles_query = supabase.table("profiles").select("*, user_roles!inner(*)").eq("verified", True).filter("user_roles.roles", "cs", f'{{"{role}"}}').execute()
            events_query = supabase.table("events").select("*, profiles!inner(*, user_roles!inner(*))").filter("profiles.user_roles.roles", "cs", f'{{"{role}"}}').or_(f"start_date.is.null, and(start_date.gte.'{prev_sunday}', start_date.lte.'{last_saturday}')").execute() # TODO
        else:
            profiles_query = supabase.table("profiles").select("name").eq("verified", True).execute()
            events_query = supabase.table("events").select("*, profiles(*, user_roles(*))").or_(f"start_date.is.null, and(start_date.gte.'{prev_sunday}', start_date.lte.'{last_saturday}')").execute() # TODO

        print(profiles_query) # TODO
        max_people = len(profiles_query.data) if profiles_query.data else 0
        events = events_query.data
        
        slot_event_perm_counts = {}
        slot_event_temp_counts = {}

        slot_unavailable_profiles = {}

        for event in events:
            if event.get("event_type") == "Permanent" and event["start_time"] and event["end_time"] and event["day_of_week"] is not None:
                event_day = beginning_of_week + timedelta(days=event["day_of_week"])

                event_start_time = datetime.strptime(event["start_time"], "%H:%M:%S").time()
                event_end_time = datetime.strptime(event["end_time"], "%H:%M:%S").time()

                event_start = PST.localize(datetime.combine(event_day.date(), event_start_time))
                event_end = PST.localize(datetime.combine(event_day.date(), event_end_time))

                slot_time = event_start
                while slot_time < event_end:
                    slot_key = slot_time
                    slot_event_perm_counts[slot_key] = slot_event_perm_counts.get(slot_key, 0) + 1
                    slot_time += timedelta(hours=1)                

            elif event["event_type"] == "Temporary" and event["start_date"] and event["end_date"]:
                event_start = PST.localize(datetime.fromisoformat(event["start_date"]))
                event_end = PST.localize(datetime.fromisoformat(event["end_date"]))

                slot_time = event_start
                while slot_time < event_end:
                    slot_key = slot_time
                    slot_event_temp_counts[slot_key] = slot_event_temp_counts.get(slot_key, 0) + 1
                    slot_time += timedelta(hours=1)

            else:
                continue

        availability_slots = []
        for day in range(28):
            current_week_day = beginning_of_week + timedelta(days=(day%7))
            current_day = beginning_of_week + timedelta(days=day)
            for hour in range(7, 20):
                slot_start = current_day.replace(hour=hour, minute=0, second=0, microsecond=0)
                slot_week_start = current_week_day.replace(hour=hour, minute=0, second=0, microsecond=0)

                slot_end = current_day.replace(hour=hour+1, minute=0, second=0, microsecond=0)
                
                events_overlapping = slot_event_temp_counts.get(slot_start, 0) + slot_event_perm_counts.get(slot_week_start, 0)
                
                available_count = max_people - events_overlapping

                availability_slots.append({
                    "startDate": slot_start,
                    "endDate": slot_end,
                    "numberOfPeople": available_count,
                    "maxPeopleAvailable": max_people,
                    "role": role if role else "All"
                })

        return availability_slots

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting availabilities: {str(e)}")