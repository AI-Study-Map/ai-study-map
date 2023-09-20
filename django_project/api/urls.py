from django.urls import path, include
from .views import gpt_calling, test, question

print("api/urls.py")
app_name = 'api'
urlpatterns = [
    path('gpt_calling/', gpt_calling, name='gpt_calling'),
    path('gpt_calling/question', question, name='question'),
    path('test/', test, name='test')
]
