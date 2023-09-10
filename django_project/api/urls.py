from django.urls import path, include
from .views import gpt_calling, test

print("api/urls.py")
app_name = 'api'
urlpatterns = [
    path('gpt_calling/', gpt_calling, name='gpt_calling'),
    path('test/', test, name='test')
]
