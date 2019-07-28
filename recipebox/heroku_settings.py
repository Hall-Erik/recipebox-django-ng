from .settings import *
import django_heroku

ALLOWED_HOSTS = []

django_heroku.settings(locals())