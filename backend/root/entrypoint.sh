#!/bin/sh

echo "Applying database migrations..."
python manage.py migrate --noinput

exec gunicorn \
  --bind 0.0.0.0:8000 \
  root.wsgi:application