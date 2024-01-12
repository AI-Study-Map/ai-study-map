from django.urls import path
from .views import ItemListCreate
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]