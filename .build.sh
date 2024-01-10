#!/usr/bin/env bash
# exit on error
set -o errexit

cd django_project

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py superuser
