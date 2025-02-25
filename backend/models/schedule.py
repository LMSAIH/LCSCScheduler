from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class User(BaseModel):
    email: EmailStr
    roles: List[str]

class Event(BaseModel):
    id: str
    title: str
    start: Optional[datetime] = None
    end: Optional[datetime] = None
    daysOfWeek: Optional[List[int]] = None
    startTime: Optional[str] = None
    endTime: Optional[str] = None
    color: str
    type: str

class Availability(BaseModel):
    startDate: datetime
    endDate: datetime
    numberOfPeople: int
    maxPeopleAvailable: int
    role: str