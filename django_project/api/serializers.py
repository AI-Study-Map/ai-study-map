from rest_framework import serializers
from .models import Gpt_call, Question

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gpt_call
        fields = '__all__'

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'