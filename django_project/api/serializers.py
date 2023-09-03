from rest_framework import serializers
from .models import Gpt_call

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gpt_call
        fields = '__all__'