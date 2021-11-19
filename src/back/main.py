from fastapi import Body, FastAPI
from starlette.responses import RedirectResponse
from typing import Any, Optional, Dict, List
from pydantic import BaseModel
import config
import match_pool
import atexit
import urllib
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient
from datetime import datetime

class SpotifyUserRequest(BaseModel):
    access_token: str
    refresh_token: str
    pronouns: str
    birth_month: datetime
    description: str
    pic: Optional[str] = None
    tidbits: Dict[str, Optional[str]]
    qas: Dict[str, Optional[str]]

class User(BaseModel):
    name: str
    email: str
    pronouns: str
    birth_month: datetime
    description: str
    pic: Optional[str] = None
    tidbits: Dict[str, Optional[str]]
    qas: Dict[str, Optional[str]]
    top_artists: Optional[List[str]] = []
    top_songs: Optional[List[str]] = []

class Artist(BaseModel):
    name: str

uri="neo4j+s://ce94f876.databases.neo4j.io"
user="neo4j"
password=config.NEO_PASSWORD

neo_db = match_pool.MatchPool(uri, user, password)

def _exit_application():
    neo_db.close()

atexit.register(_exit_application)

app = FastAPI()
test_client = TestClient(app)

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

CLIENT_ID = '9cf53a8f93444cadac7b3e6d990a9e6d'
CLIENT_SECRET = config.SPOTIFY_CLIENT_SECRET

SCOPES = 'user-top-read'

@app.get('/accessToken')
async def accessToken(code: str, redirect: str):
    """
    GET route for Spotify access token, necessary for getting users' private Spotify info

    Parameters:
        `code` (str): the authorization code provided by pinging `https://accounts.spotify.com/authorize`
        `redirect` (str): the URI we'd like to redirect to after Spotify gives us our desired tokens

    Returns:
        Dictionary containing:
        ```python
        access_token = str # required for getting users' private Spotify info
        refresh_token = str, # for refreshing access_token after it expires
        expires_in = int, # how many seconds until access_token expires
        scope = str, # what permissions we need user to consent to before pulling their private info
        token_type = str, # e.g. Bearer (Authentication)
        ```
    """
    url = "https://accounts.spotify.com/api/token"
    headers = {}
    data = {}

    headers['Content-Type'] = "application/x-www-form-urlencoded"
    data = {
        'grant_type': "authorization_code",
        'code': code,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': redirect
    }

    return requests.post(url, headers=headers, data=data).json()

@app.get("/ping")
def pong():
    return {"ping": "pong!"}

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

        * Neo4j entry object: corresponding to the newly added artist
            containing the artist's name. This object can be viewed as a
            Python dictionary or Javascript Object.
        * `int`: request status code (e.g. `200` means request went fine)
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

        * Neo4j entry object: corresponding to the newly added user
        containing the user's name, email, top artists, and top tracks.
        This object can be viewed as a Python dictionary or Javascript Object.
        * `int`: request status code (e.g. `200` means request went fine)
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
        pronouns=spotify_req.pronouns,
        birth_month=spotify_req.birth_month,
        description=spotify_req.description,
        pic=spotify_req.pic,
        tidbits=spotify_req.tidbits,
        qas=spotify_req.qas,
        top_artists = top_artists,
        top_songs = top_songs,
    )
    # STATUS 403: Access token does not contain necessary scope
    # TODO: play around with the limit: number of returned results for both top artists and top top tracks

    # Uncomment following line, when ready to test actually adding this new user data to neo4j
    result = neo_db.create_user(new_spotify_user)
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
        * `str pronouns`
        * `datetime birth_month`
        * `str description`
        * `str pic` - Optional
        * `Dict[str, str] tidbits`:
            * `str desired_relationship` - one of:
                * `casual`
                * `short-term`
                * `long-term`
                * `other`
            * `str education` - Optional
            * `str occupation` - Optional
            * `str sexual_orientation` - Optional
            * `str location` - Optional
            * `str political_view` - Optional and one of:
                * `anarchism`
                * `communism`
                * `conservatism`
                * `environmentalism`
                * `fascism`
                * `feminism`
                * `liberalism`
                * `nationalism`
                * `populism`
                * `socialism`
                * `other`
            * `str height` - Optional
        * QAs:
            * `str life_goal`
            * `str believe_or_not`
            * `str life_peaked`
            * `str feel_famous`
            * `str biggest_risk`
        * `List[str] top_artists` - to be provided when merged with `createUserFromAccessToken`
        * `List[str] top_songs` - to be provided when merged with `createUserFromAccessToken`

    Returns:
        Tuple containing:

        * Neo4j entry object: corresponding to the newly added user
        containing the request body's contents. This object can be
        viewed as a Python dictionary or Javascript Object.
        * `int`: request status code (e.g. `200` means request went fine)
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

        * Neo4j entry object: corresponding to the newly added user
        containing the request body's contents. This object can be
        viewed as a Python dictionary or Javascript Object.
        * `int`: request status code (e.g. `200` means request went fine)
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
        `int`: request status code (e.g. `200` means request went fine)
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

        * list: of User objects that userA mutually likes
        * `int`: request status code (e.g. `200` means request went fine)
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

        * list: of User objects that userA has never liked/disliked
        * `int`: request status code (e.g. `200` means request went fine)
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
        `int`: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.like(email_a, email_b)
    return result
