from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import get_current_user
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
    
@router.post("/login")
def login(user: UserSignup, supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})

        session = response.get("session")
        if not session:
            raise HTTPException(status_code=401, detail="Login failed or email not confirmed")
        
        access_token = session.get("access_token")
        user_data = response.get("user")
        
        return {
            "access_token": access_token,
            "user": user_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during login: {str(e)}")
    
@router.get("/verify")
async def verify(current_user: dict = Depends(get_current_user)):
    return current_user