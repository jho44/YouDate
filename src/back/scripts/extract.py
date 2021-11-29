import pandas as pd
import requests
from bs4 import BeautifulSoup
from top_artists import *

soup = BeautifulSoup(s, 'lxml') # Parse the HTML as a string

table = soup.find_all('tbody')[0] # Grab the first table

new_table = pd.DataFrame(columns=range(0,10), index = [0]) # I know the size

# row_marker = 0
for row in table.find_all('tr'):
    # column_marker = 0
    columns = row.find_all('td')
    payload = dict(name=columns[1].get_text())
    print(payload)
    r = requests.post("http://127.0.0.1:8000/createArtist", json = payload)

print(new_table.shape)
