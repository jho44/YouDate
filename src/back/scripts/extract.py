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
    '''
    for j in range(len(columns)):
        if j == 1:
            # Name of the top 1000 artist
            print(columns[j])
            paylod = dict(name=columns[j].get_text())
            r = requests.post("https://127.0.0.1:8000/createArtist", data = payload)
        new_table.iat[row_marker,column_marker] = columns[j].get_text()
        column_marker += 1
    '''

print(new_table.shape)
