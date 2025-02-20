from fastapi import Depends, HTTPException, Request
from supabase import Client
from db.supabase_client import get_supabase

def get_token(request: Request) -> str:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    
    return token

def get_current_user(token: str = Depends(get_token), supabase: Client = Depends(get_supabase)):
    try:
        result = supabase.auth.get_user(token)
        
        if not result or not result.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        return result.user

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Error getting user: {str(e)}")