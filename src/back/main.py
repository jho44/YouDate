from fastapi import Body, FastAPI
from typing import List
from pydantic import BaseModel
import neo_config
import match_pool
import atexit
from fastapi.middleware.cors import CORSMiddleware

class User(BaseModel):
  name: str
  email: str
  top_artists: List[str]
  top_songs: List[str]

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

@app.post("/createUser")
async def create_user(user: User):
  result = neo_db.create_user(user)
  return result

@app.post("/deleteUser")
async def delete_user(email: str = Body(..., embed=True)):
  print(email)
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