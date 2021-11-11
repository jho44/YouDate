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

def _exit_application():
    neo_db.close()

atexit.register(_exit_application)

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
    """
    POST route for adding to the Neo4j database an artist a new Datify
    user enjoys.

    Parameters:
        `artist` (Artist): a request body consisting of the name of
        the artist you'd like to add.

    Returns:
        Tuple containing:

        1. Neo4j entry object: corresponding to the newly added artist
        containing the artist's name. This object can be viewed as a
        Python dictionary or Javascript Object.
        2. request status code (e.g. `200` means request went fine)
    """
    result = neo_db.create_artist(artist)
    return result

# TODO: delete Artist

@app.post("/createUserFromAccessToken")
async def create_spotify_user(spotify_req: SpotifyUserRequest):
    """
    POST route for adding to the Neo4j database a user with spotify information
    like top artists and top tracks

    Parameters:
        `spotify_req` (SpotifyUserRequest): a request body consisting of the
        access token and the refresh token of the authenticated spotify user

    Returns:
        Tuple containing:

        1. Neo4j entry object: corresponding to the newly added user
        containing the user's name, email, top artists, and top tracks.
        This object can be viewed as a Python dictionary or Javascript Object.
        2. request status code (e.g. `200` means request went fine)
    """
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

    # Uncomment following line, when ready to test actually adding this new user data to neo4j
    # result = neo_db.create_user(new_spotify_user)

    return new_spotify_user

@app.post("/createUser")
async def create_user(user: User):
    """
    POST route for adding to the Neo4j database a new Datify user.

    Parameters:
        `user` (User) - a request body corresponding to the newly added
        user containing:

        * `str name`
        * `str email`
        * `List[str] top_artists`
        * `List[str] top_songs`

    Returns:
        Tuple containing:

        1. Neo4j entry object: corresponding to the newly added user
        containing the request body's contents. This object can be
        viewed as a Python dictionary or Javascript Object.
        2. request status code (e.g. `200` means request went fine)
    """
    result = neo_db.create_user(user)
    return result

@app.post("/deleteUser")
async def delete_user(email: str = Body(..., embed=True)):
    """
    POST route for deleting from the Neo4j database an existing Datify user.

    Parameters:
        `email` (str) - the email of the user we'd like to delete

    Returns:
        Tuple containing:

        1. Neo4j entry object: corresponding to the newly added user
        containing the request body's contents. This object can be
        viewed as a Python dictionary or Javascript Object.
        2. int: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.delete_user(email)
    return result

@app.post("/dislike")
async def dislike(email_a: str = Body(...), email_b: str = Body(...)):
    """
    POST route for creating a 'DISLIKES` relationship from userA to userB.
    userA will never be able to see userB again on this app.

    Parameters:
        `email_a` (str) - userA's email
        `email_b` (str) - userB's email

    Returns:
        int: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.dislike(email_a, email_b)
    return result

@app.get("/getMatched")
async def get_matched(email):
    """
    GET route for retrieving users a userA mutually liked / swiped
    right on.

    Parameters:
        `email` (str) - userA's email

    Returns:
        Tuple containing:

        1. list: of User objects that userA mutually likes
        2. int: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.get_matched(email)
    return result

@app.get("/getUnmet")
async def get_unmet(email):
    """
    GET route for retrieving 10 users a userA has never liked/disliked
    before.

    Parameters:
        `email` (str) - userA's email

    Returns:
        Tuple containing:

        1. list: of User objects that userA has never liked/disliked
        2. int: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.get_unmet(email)
    return result

@app.post("/like")
async def like(email_a: str = Body(...), email_b: str = Body(...)):
    """
    POST route for creating a 'LIKES` relationship from userA to userB.
    If userB also likes userA, they'll show up on each other's MATCHED pages.
    Parameters:
        `email_a` (str) - userA's email
        `email_b` (str) - userB's email

    Returns:
        int: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.like(email_a, email_b)
    return result
