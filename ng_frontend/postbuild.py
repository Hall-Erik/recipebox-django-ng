from bs4 import BeautifulSoup
import os

READ_FROM = '../backend/recipes/static/recipes/index.html'
WRITE_TO = '../backend/recipes/templates/recipes/index.html'

# Subdir in static of your django project e.g. static/recipes/
SUB = 'recipes/'

with open(READ_FROM) as index:
    soup = BeautifulSoup(index, 'html.parser')

for el in soup.find_all('link'):
    el['href'] = f'{{% static "{SUB}{el.get("href")}" %}}'

for el in soup.find_all('script'):
    el['src'] = f'{{% static "{SUB}{el.get("src")}" %}}'
    del el['nomodule']
    el['type'] = 'text/javascript'

soup.insert(0,'{% load static %}')
pretty = soup.prettify('utf-8')

with open(WRITE_TO, 'wb') as f:
    f.write(pretty)

os.remove(READ_FROM)
