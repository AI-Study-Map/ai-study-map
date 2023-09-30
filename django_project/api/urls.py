from django.urls import path, include
from .views import gpt_calling, test, question, add_description

print("api/urls.py")
app_name = 'api'
urlpatterns = [
    path('gpt_calling/', gpt_calling, name='gpt_calling'),
    path('gpt_calling/question', question, name='question'),
    path('gpt_calling/add_description', add_description, name='add_description'),
    path('test/', test, name='test')
]
