from fastapi import Body, FastAPI
from starlette.responses import RedirectResponse
from typing import Any, List, Optional
from pydantic import BaseModel
import neo_config
import match_pool
import atexit
import urllib
from fastapi.middleware.cors import CORSMiddleware

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
