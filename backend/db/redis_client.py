import os
from redis.asyncio import Redis

# Read environment variables
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))

# Create a global Redis client
redis_client = Redis(
    host=REDIS_HOST,
    port=REDIS_PORT
)

# FastAPI dependency function
async def get_redis() -> Redis:
    return redis_client