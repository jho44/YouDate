import requests

class Spotify:
  def get_basic_user_info(self, token):
    # GETS all basic information from user
    basic_info = requests.get('https://api.spotify.com/v1/me', headers={'Authorization': 'Bearer ' + token})

    if basic_info.status_code != 200:
    	return None

    basic_info = basic_info.json()

    if "email" not in basic_info or "display_name" not in basic_info or "id" not in basic_info:
    	return None

    return {
      'email': basic_info['email'],
      'display_name': basic_info['display_name'],
      'id': basic_info['id']
    }
