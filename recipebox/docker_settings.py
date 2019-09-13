from .settings import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': os.getenv('SQL_ENGINE'),
        'NAME': os.getenv('SQL_DATABASE'),
        'USER': os.getenv('SQL_USER'),
        'PASSWORD': os.getenv('SQL_PASSWORD'),
        'HOST': os.getenv('SQL_HOST'),
        'PORT': os.getenv('SQL_PORT'),
    }
}

STATIC_URL = '/staticfiles/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
