import os

from django.core.wsgi import get_wsgi_application

settings_module = 'root.deployment_settings' if 'EXTERNAL_HOSTNAME' in os.environ else 'root.settings'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", settings_module)

application = get_wsgi_application()
