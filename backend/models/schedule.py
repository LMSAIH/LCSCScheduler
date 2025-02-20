from pydantic import BaseModel, EmailStr
from datetime import datetime

class User(BaseModel):
    email: EmailStr
    role: str

class Event(BaseModel):
    id: str
    title: str
    start: datetime
    end: datetime
    dayOfWeek: int
    color: str
    type: str

class Availability(BaseModel):
    startDate: datetime
    endDate: datetime
    numberOfPeople: int
    maxPeopleAvailable: int
    role: str