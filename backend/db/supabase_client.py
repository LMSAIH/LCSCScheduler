import os
from supabase import create_client, Client

# Read environment variables
try:
    SUPABASE_URL = os.environ["SUPABASE_URL"]
    SUPABASE_KEY = os.environ["SUPABASE_KEY"]
except KeyError as e:
    raise RuntimeError(f"Missing required supabase environment variable: {e.args[0]}")

# Create a global Supabase client
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# FastAPI dependency function
def get_supabase() -> Client:
    return supabase_client