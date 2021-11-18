import os
from dotenv import load_dotenv

load_dotenv()

NEO_PASSWORD = os.environ.get("NEO_PASSWORD")
SPOTIFY_CLIENT_SECRET = os.environ.get("SPOTIFY_CLIENT_SECRET")
