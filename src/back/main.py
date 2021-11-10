from fastapi import Body, FastAPI
from starlette.responses import RedirectResponse
from typing import Any, List, Optional
from pydantic import BaseModel
import neo_config
import match_pool
import atexit
import urllib
import requests
from fastapi.middleware.cors import CORSMiddleware

class SpotifyUserRequest(BaseModel):
    access_token: str
    refresh_token: str

class User(BaseModel):
    name: str
    email: str
    top_artists: List[str]
    top_songs: List[str]

class Artist(BaseModel):
    name: str

uri="neo4j+s://ce94f876.databases.neo4j.io"
user="neo4j"
password=neo_config.NEO_PASSWORD

neo_db = match_pool.MatchPool(uri, user, password)

def exit_application():
    neo_db.close()

atexit.register(exit_application)

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/createArtist")
async def create_artist(artist: Artist):
    result = neo_db.create_artist(artist)
    return result

# TODO: delete Artist

@app.post("/createUserFromAccessToken")
async def create_spotify_user(spotify_req: SpotifyUserRequest):
    # GETS all basic information from user
    basic_info = requests.get('https://api.spotify.com/v1/me', headers={'Authorization': 'Bearer ' + spotify_req.access_token}).json()
    name = basic_info["display_name"]
    email = basic_info["email"]
    top_artists = []
    top_songs = []
    top_artists_req = requests.get('https://api.spotify.com/v1/me/top/artists', headers={'Authorization': 'Bearer ' + spotify_req.access_token}).json()
    for artist in top_artists_req["items"]:
        top_artists.append(artist["name"])
    top_tracks_req = requests.get('https://api.spotify.com/v1/me/top/tracks', headers={'Authorization': 'Bearer ' + spotify_req.access_token}).json()
    for track in top_tracks_req["items"]:
        top_songs.append(track["name"])
    new_spotify_user = User(
        name=name,
        email=email,
        top_artists = top_artists,
        top_songs = top_songs,
    )
    # STATUS 403: Access token does not contain necessary scope
    # TODO: play around with the limit: number of returned results for both top artists and top top tracks
    return new_spotify_user

@app.post("/createUser")
async def create_user(user: User):
    result = neo_db.create_user(user)
    return result

@app.post("/deleteUser")
async def delete_user(email: str = Body(..., embed=True)):
    result = neo_db.delete_user(email)
    return result

@app.post("/dislike")
async def dislike(email_a: str = Body(...), email_b: str = Body(...)):
    result = neo_db.dislike(email_a, email_b)
    return result

@app.get("/getMatched")
async def get_matched(email):
    result = neo_db.get_matched(email)
    return result

@app.get("/getUnmet")
async def get_unmet(email):
    result = neo_db.get_unmet(email)
    return result

@app.post("/like")
async def like(email_a: str = Body(...), email_b: str = Body(...)):
    result = neo_db.like(email_a, email_b)
    return result
