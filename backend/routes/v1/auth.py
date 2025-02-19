from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from db.supabase_client import get_supabase
from models.auth import UserSignup

router = APIRouter()

@router.post("/signup")
def signup_user(user: UserSignup, supabase: Client = Depends(get_supabase)):
    """
    Signup route that creates a user in Supabase Auth.
    """
    try:
        response = supabase.auth.sign_up({"email": user.email, "password": user.password})
        return {"data": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during sign up: {str(e)}")

