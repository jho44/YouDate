from fastapi import Body, FastAPI, HTTPException
from starlette.responses import RedirectResponse
from typing import Any, Optional, Dict, List
from pydantic import BaseModel
import config
import match_pool
import spotify
import atexit
import urllib
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastapi.testclient import TestClient
from datetime import datetime

class SpotifyUserRequest(BaseModel):
    access_token: str
    refresh_token: str
    name: str
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
    refresh_token: str
    user_id: str

class Artist(BaseModel):
    name: str

uri="neo4j+s://ce94f876.databases.neo4j.io"
user="neo4j"
password=config.NEO_PASSWORD


QA_LIST = ["life_goal", "believe_or_not", "life_peaked", "feel_famous", "biggest_risk"]
QA_MAX = 5
TIDBIT_LIST = ["desired_relationship", "education", "occupation", "sexual_orientation", "location", "political_view", "height"]
FACT_LIST = {"life_goal", "believe_or_not", "life_peaked", "feel_famous", "biggest_risk", "desired_relationship", "education", "occupation", "sexual_orientation", "location", "political_view", "height"}

spotify_requester = spotify.Spotify()
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

@app.get('/getUser')
async def get_user(token: str):
    """
    GET route to see if user trying to login has a Datify account.

    Parameters:
        `token` (`str`): Spotify access token

    Returns:
        * Dictionary either containing `User` properties (if user exists)
        or nothing (if user doesn't exist)
        * `int`: request status code (e.g. `200` means request went fine)
    """
    basic_info = spotify_requester.get_basic_user_info(token)
    if basic_info is None:
        raise HTTPException(status_code=404, detail="User not found")
    user = neo_db.get_user(basic_info["id"])
    return user

@app.get('/accessToken')
async def accessToken(code: str, redirect: str):
    """
    GET route for Spotify access token, necessary for getting users' private Spotify info

    Parameters:
        `code` (`str`): the authorization code provided by pinging `https://accounts.spotify.com/authorize`
        `redirect` (`str`): the URI we'd like to redirect to after Spotify gives us our desired tokens

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
    """
    GET route for testing server connection.

    Returns:
        `Object`
    """
    return {"ping": "pong!"}

@app.post("/createArtist")
async def create_artist(artist: Artist):
    """
    POST route for adding to the Neo4j database an artist a new Datify
    user enjoys.

    Parameters:
        `artist` (`Artist`): a request body consisting of the name of
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
        `spotify_req` (SpotifyUserRequest): a request body consisting of the authenticated user's:

        * `str pronouns` - user's preferred pronouns.
        * `datetime birth_month` - month and year user was born in.
        * `str description` - e.g. a short bio about the user.
        * `str pic` - Optional - base64 string of user's profile picture.
        * `Dict[str, str] tidbits` - extra facts about the user (separate from `QAs` because they're presented differently on the frontend):
            * `str desired_relationship` - what kind of relationship the user wants from Datify. One of:
                * `casual`
                * `short-term`
                * `long-term`
                * `other`
            * `str education` - Optional - e.g. highest degree, college, BA vs BS vs Master's vs PhD.
            * `str occupation` - Optional - what job the user has right now.
            * `str sexual_orientation` - Optional - e.g. heterosexual, homosexual, asexual, pansexual.
            * `str location` - Optional - user's general vicinity (e.g. city, neighborhood, etc)
            * `str political_view` - Optional - user's political school of thought. One of:
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
            * `str height` - Optional - user's height.
        * QAs - extra facts about the user (separate from `tidbits` because they're presented differently on the frontend):
            * `str life_goal` - Optional - user's life goal.
            * `str believe_or_not` - Optional - something about the user that's unbelievable.
            * `str life_peaked` - Optional - circumstances of user's life's pinnacle.
            * `str feel_famous` - Optional - circumstances that make the user feel famous.
            * `str biggest_risk` - Optional - biggest risk user has taken.

    Returns:
        Tuple containing:

        * Neo4j entry object: corresponding to the newly added user
        containing the user's name, email, top artists, and top tracks.
        This object can be viewed as a Python dictionary or Javascript Object.
        * `int`: request status code (e.g. `200` means request went fine)
    """
    basic_info = spotify_requester.get_basic_user_info(spotify_req.access_token)
    if basic_info is None:
        raise HTTPException(status_code=404, detail="Spotify information not found")
    top_artists = []
    top_songs = []
    top_artists_req = requests.get('https://api.spotify.com/v1/me/top/artists', headers={'Authorization': 'Bearer ' + spotify_req.access_token}).json()
    for artist in top_artists_req["items"]:
        top_artists.append(artist["name"])
    top_tracks_req = requests.get('https://api.spotify.com/v1/me/top/tracks', headers={'Authorization': 'Bearer ' + spotify_req.access_token}).json()
    for track in top_tracks_req["items"]:
        top_songs.append(track["name"])

    new_spotify_user = User(
        name=spotify_req.name,
        email=basic_info["email"],
        pronouns=spotify_req.pronouns,
        birth_month=spotify_req.birth_month,
        description=spotify_req.description,
        pic=spotify_req.pic,
        tidbits=spotify_req.tidbits,
        qas=spotify_req.qas,
        top_artists = top_artists,
        top_songs = top_songs,
        refresh_token = spotify_req.refresh_token,
        user_id=basic_info["id"]
    )

    # STATUS 403: Access token does not contain necessary scope
    # TODO: play around with the limit: number of returned results for both top artists and top top tracks

    # Uncomment following line, when ready to test actually adding this new user data to neo4j
    result = neo_db.create_user(new_spotify_user)
    return result

@app.post("/deleteUser")
async def delete_user(email: str = Body(..., embed=True)):
    """
    POST route for deleting from the Neo4j database an existing Datify user.

    Parameters:
        `email` (`str`) - the email of the user we'd like to delete

    Returns:
        Tuple containing:

        * Neo4j entry object: corresponding to the newly added user
        containing the request body's contents. This object can be
        viewed as a Python dictionary or Javascript Object.
        * `int`: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.delete_user(email)
    if result is None:
        raise HTTPException(status_code=404, detail="User not found")
    return result

@app.post("/dislike")
async def dislike(userid_a: str = Body(...), userid_b: str = Body(...)):
    """
    POST route for creating a 'DISLIKES` relationship from userA to userB.
    userA will never be able to see userB again on this app.

    Parameters:
        `userid_a` (`str`) - userA's Spotify ID

        `userid_b` (`str`) - userB's Spotify ID

    Returns:
        `int`: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.dislike(userid_a, userid_b)
    return result

@app.get("/getMatched")
async def get_matched(email: str):
    """
    GET route for retrieving users a userA mutually liked / swiped
    right on.

    Parameters:
        `email` (`str`) - userA's email

    Returns:
        Tuple containing:

        * `list`: of `User` objects that userA mutually likes
        * `int`: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.get_matched(email)
    return result

@app.get("/getUnmet")
async def get_unmet(email: str):
    """
    GET route for retrieving 10 users a userA has never liked/disliked
    before.

    Parameters:
        `email` (`str`) - userA's email

    Returns:
        Tuple containing:

        * `list`: of `User` objects that userA has never liked/disliked
        * `int`: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.get_unmet(email)
    return result


@app.post("/like")
async def like(userid_a: str = Body(...), userid_b: str = Body(...)):
    """
    POST route for creating a 'LIKES` relationship from userA to userB.
    If userB also likes userA, they'll show up on each other's MATCHED pages.
    Parameters:
        `userid_a` (`str`) - userA's Spotify ID

        `userid_b` (`str`) - userB's Spotify ID

    Returns:
        `int`: request status code (e.g. `200` means request went fine)
    """
    result = neo_db.like(userid_a, userid_b)
    return result


@app.post("/sharedArtists")
async def get_shared_artists(userid_a: str = Body(...), userid_b: str = Body(...)):
    """
    POST route for getting shared liked artists between userA and userB.
    Parameters:
        `userid_a` (`str`) - userA's Spotify ID

        `userid_b` (`str`) = userB's Spotify ID

    Returns:
        `list`: of Artist names that userA and userB mutually like
    """
    result = neo_db.get_shared_artists(userid_a, userid_b)
    return result


@app.post("/sharedTracks")
async def get_shared_tracks(userid_a: str = Body(...), userid_b: str = Body(...)):
    """
    POST route for getting shared top tracks between userA and userB.
    Parameters:
        `userid_a` (`str`) - userA's Spotify ID

        `userid_b` (`str`) = userB's Spotify ID

    Returns:
        `list`: of Track names that userA and userB mutually like
    """
    result = neo_db.get_shared_tracks(userid_a, userid_b)
    return result


@app.put("/updateUserFacts")
async def updateUserFacts(facts: Dict[str, Optional[str]] = Body(...), email: str = Body(...)):
    """
    PUT route for updating a user's information.

    Parameters:
       * `facts` (`Dict[str, str]`) - dictionary of tidbits and QAs mapped to their values.
        Every single tidbit and QA should be included with a string or null. If a string is null, this fact is deleted from the user's profile.
        The required fields are: "life_goal", "believe_or_not", "life_peaked", "feel_famous", "biggest_risk", "desired_relationship", "education", "occupation", "sexual_orientation", "location", "political_view", "height"
       * `email` (`str`) - user's email

    Returns:
        * Dictionary either containing `User` properties (if user exists)
        or nothing (if user doesn't exist)
        * `int`: request status code (e.g. `200` means request went fine)
    """

    if FACT_LIST != set(facts.keys()):
        raise HTTPException(status_code=400, detail="Bad Request: Invalid Field Name")

    qa_count = 0
    for key in facts:
        if key in QA_LIST and facts[key] is not None:
            qa_count += 1

    if qa_count > QA_MAX:
        raise HTTPException(status_code=400, detail="Bad Request: Too Many QAs")

    result = neo_db.save_facts(facts, email)
    if result is None:
       raise HTTPException(status_code=404, detail="User not found")
    return result
