from fastapi import APIRouter, Depends, HTTPException, Response, Request
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
        signup_response = supabase.auth.sign_up({"email": user.email, "password": user.password})

        if not signup_response.user or not signup_response.user.id:
            raise HTTPException(status_code=401, detail="Signup failed.")
        
        profile_data = {
            "id": signup_response.user.id,
            "email": user.email
        }
        
        profile_response = supabase.table("profiles").insert(profile_data).execute()

        return {"signup_data": signup_response, "profile_data": profile_response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during sign up: {str(e)}")
    
@router.post("/login")
def login(user: UserSignup, response: Response, supabase: Client = Depends(get_supabase) ):
    try:
        login_response = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})

        if not login_response.session:
            raise HTTPException(
                status_code=401, 
                detail="Login failed or email not confirmed"
          )
      
        response.set_cookie(
                key="access_token",
                value=login_response.session.access_token,
                httponly=True,
                secure=True,
                max_age=6000,
                samesite="lax"             
        )
    
        return {
            "access_token": login_response.session.access_token,
            "user": login_response.user
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error during login: {str(e)}")

@router.get("/verify")
async def verify(
    response: Response,
    request: Request,
    supabase: Client = Depends(get_supabase)
   
):
    try:
        
        token = request.cookies.get("access_token")
        
        if not token:
            raise HTTPException(status_code=401, detail="No authentication token found")
        
        user = supabase.auth.get_user(token)
        
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=6000
        )
        
        return {"user": user, "token": token }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token verification failed")