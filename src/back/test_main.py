from fastapi.testclient import TestClient
import requests
import json

def test_ping(test_app):
    response = test_app.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"ping": "pong!"}

def test_create_spotify_user(test_app, test_db, monkeypatch):
    true_get = requests.get

    def patched_get(uri, *args, **kwargs):
        print(uri)
        _, route = uri.split('https://api.spotify.com/v1/', 1)

        json_dict = {
            'me': lambda: {'display_name': 'test-name', 'email': 'test@gmail.com'},
            'me/top/artists': lambda: {'items': [{'name': 'artist1'}, {'name': 'artist2'}]},
            'me/top/tracks': lambda: {'items': [{'name': 'track1'}, {'name': 'track2'}]}
        }

        sel_route = json_dict[route]
 
        mock = type('MockedReq', (), {})()

        mock.json = sel_route
        
        return mock
    
    monkeypatch.setattr(requests, 'get', patched_get)

    response = test_app.post("/createUserFromAccessToken", json={"access_token": "test_access_token", "refresh_token": "test_refresh_token"})
    response = json.loads(response.text)
    print(response.keys())
    assert response['name'] == 'test-name'
    assert response['email'] == 'test@gmail.com'
    assert response['top_artists'] == ["artist1","artist2"]
    assert response['top_songs'] == ["track1", "track2"]
        

def test_user_create(test_app, test_db, monkeypatch):

    async def mock_create_user_does_not_exist():
        return None
    
    monkeypatch.setattr(test_db, "create_user", mock_create_user_does_not_exist)

    response = test_app.post("/createUser", json={"name": "test", "email": "test@gmail.com", "top_artists": [], "top_songs": []})
    
    assert response.status_code == 200

def test_user_delete(test_app, test_db, monkeypatch):

    async def mock_delete_user_exists():
        return None
    
    monkeypatch.setattr(test_db, "delete_user", mock_delete_user_exists)

    response = test_app.post("/deleteUser", json={"email": "test@gmail.com"})
    
    assert response.status_code == 200

def test_user_dislike(test_app, test_db, monkeypatch):

    async def mock_dislike_both_users_exist():
        return None
    
    monkeypatch.setattr(test_db, "dislike", mock_dislike_both_users_exist)

    response = test_app.post("/dislike", json={"email_a": "test@gmail.com", "email_b": "test@gmail.com"})
    
    assert response.status_code == 200

def test_get_matched(test_app, test_db, monkeypatch):

    async def mock_get_matched():
        return []
    
    monkeypatch.setattr(test_db, "get_matched", mock_get_matched)

    email_param = 'test@gmail.com'

    response = test_app.get(f"/getMatched?email={email_param}")
    
    assert response.text == '[[],200]'


    