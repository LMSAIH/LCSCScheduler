import os
from redis.asyncio import Redis

# Read environment variables
try:
    REDIS_HOST = os.environ["REDIS_HOST"]
    REDIS_PORT = os.environ["REDIS_PORT"]
except KeyError as e:
    raise RuntimeError(f"Missing required redis environment variable: {e.args[0]}")

# Create a global Redis client
redis_client = Redis(
    host=REDIS_HOST,
    port=REDIS_PORT
)

# FastAPI dependency function
async def get_redis() -> Redis:
    return redis_client