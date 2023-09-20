from django.contrib import admin

from .models import Gpt_call, Question

admin.site.register(Gpt_call)
admin.site.register(Question)