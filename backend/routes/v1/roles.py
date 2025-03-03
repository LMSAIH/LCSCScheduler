from fastapi import APIRouter, Depends, HTTPException, Request
from supabase import Client
from db.supabase_client import get_supabase
from middleware.auth import get_current_user
from typing import List, Literal, Optional
from pydantic import BaseModel
from models.schedule import User
import os

RoleType = Literal["Developer","Volunteer","President","Admin","Events","Media"]
VALID_ROLES = ["Developer", "Volunteer", "President", "Admin", "Events", "Media"]

class Roles(BaseModel):
    password: Optional[str] = None
    roles: List[RoleType]

try:
    ADMIN_PWD = os.environ["ADMIN_PASSWORD"]
except KeyError as e:
    raise RuntimeError(f"Missing required supabase environment variable: {e.args[0]}")



router = APIRouter()

@router.post('/')
async def assignRoles(
    roles_updated: Roles,
    supabase: Client = Depends(get_supabase),
    current_user: dict = Depends(get_current_user),
    )->User:
    
    try:
        
        userMail = current_user.email
        
        if not all(role in VALID_ROLES for role in roles_updated.roles):
            raise HTTPException(
                status_code=400,
                detail="Invalid Role. Must be one of the approved role list."
            )
            
        for role in roles_updated.roles:
            if role == "Admin" and roles_updated.password != ADMIN_PWD:
                raise HTTPException(status_code=400,detail="Admin password wasn't provided or was incorrect")
                
        supabase.table('user_roles').delete().eq('email', userMail).execute()
        
        response = supabase.table('user_roles').insert({
            'email': userMail,
            'user_id': current_user.id,
            'roles': roles_updated.roles
        }).execute()   
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to update roles")
        
        user_data = response.data[0]
        
        return User(email=userMail,roles=user_data['roles'])
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get('/')
async def getRoles(
    supabase: Client = Depends(get_supabase),
    current_user: dict = Depends(get_current_user)
) -> User:
    try:
        userMail = current_user.email
        
        response = supabase.table('user_roles').select('*').eq('email', userMail).execute()
        
        if not response.data:
          
            return User(email=userMail, roles=[])
        
        user_data = response.data[0]
        return User(email=userMail, roles=user_data['roles'])
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    
    