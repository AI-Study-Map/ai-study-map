from django.db import models

class Gpt_call(models.Model):

    body = models.TextField(blank=False, null=False)