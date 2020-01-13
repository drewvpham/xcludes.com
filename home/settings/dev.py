'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['127.0.0.1', 'localhost']
DEBUG = True

WSGI_APPLICATION = 'home.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

# Stripe

STRIPE_PUBLIC_KEY = 'pk_test_kpmCSJfEkHbexz8iWeycgi3r00zJ9nJEvS'
STRIPE_SECRET_KEY = 'sk_test_r9LR2UyS67S6ETwpI29hxGuL004bTSTel5'
