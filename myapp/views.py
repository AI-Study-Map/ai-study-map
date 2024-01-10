from django.shortcuts import render
from rest_framework import generics
from .models import Item
from .serializers import ItemSerializer
from django.http import HttpResponse

class ItemListCreate(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

