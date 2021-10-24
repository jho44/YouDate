import pandas as pd
from bs4 import BeautifulSoup
from top_artists import *

soup = BeautifulSoup(s, 'lxml') # Parse the HTML as a string

table = soup.find_all('tbody')[0] # Grab the first table

new_table = pd.DataFrame(columns=range(0,10), index = [0]) # I know the size

row_marker = 0
for row in table.find_all('tr'):
    column_marker = 0
    columns = row.find_all('td')
    for column in columns:
        new_table.iat[row_marker,column_marker] = column.get_text()
        column_marker += 1

print(new_table)
