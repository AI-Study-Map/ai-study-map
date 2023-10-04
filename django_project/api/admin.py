from django.contrib import admin

from .models import Gpt_call, Question, User, Map, Node, Edge

admin.site.register(Gpt_call)
admin.site.register(Question)
admin.site.register(User)
admin.site.register(Map)
admin.site.register(Node)
admin.site.register(Edge)