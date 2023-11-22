from django.urls import path, include
from .views import gpt_calling, test, question, add_description, save_map, save_node, save_edge, load_map, create_newnode, make_map, num_of_map

print("api/urls.py")
app_name = 'api'
urlpatterns = [
    path('gpt_calling/', gpt_calling, name='gpt_calling'),
    path('gpt_calling/question', question, name='question'),
    path('gpt_calling/add_description', add_description, name='add_description'),
    path('gpt_calling/make_map', make_map, name='make_map'),
    path('save/map', save_map, name='save_map'),
    path('save/node', save_node, name='save_node'),
    path('save/edge', save_edge, name='save_edge'),
    path('save/create_newnode', create_newnode, name='create_newnode'),
    path('load/map', load_map, name='load_map'),
    path('load/num_of_map', num_of_map, name='num_of_map'),
    path('test/', test, name='test')
]
