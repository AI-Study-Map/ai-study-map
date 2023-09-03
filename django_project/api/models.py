from django.db import models

class Gpt_call(models.Model):

    author = models.CharField(max_length=50, blank=False)
    body = models.TextField(blank=False)

    def __str__(self):
        return self.author