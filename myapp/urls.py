from django.urls import path
from .views import ItemListCreate
from . import views

urlpatterns = [
    path('items/', ItemListCreate.as_view(), name='item-list-create'),
    path('', views.index, name='index'),
]