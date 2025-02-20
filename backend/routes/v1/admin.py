from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import get_current_user

router = APIRouter()

@router.get("/")
def get_availabilities(supabase: Client = Depends(get_supabase), current_user: dict = Depends(get_current_user)):
    try:
        return {"message": "TODO"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting availabilities: {str(e)}")