import requests

class Spotify:
  def get_basic_user_info(self, token):
    # GETS all basic information from user
    basic_info = requests.get('https://api.spotify.com/v1/me', headers={'Authorization': 'Bearer ' + token}).json()
    return {
      'email': basic_info['email'],
      'display_name': basic_info['display_name'],
      'id': basic_info['id']
    }
