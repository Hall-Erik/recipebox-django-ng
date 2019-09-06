from .settings import *
import django_heroku

ALLOWED_HOSTS = []

DOMAIN = 'https://drf-recipebox.herokuapp.com'

django_heroku.settings(locals())