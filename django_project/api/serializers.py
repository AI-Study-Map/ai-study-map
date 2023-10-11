from rest_framework import serializers
from .models import Gpt_call, Question, Node

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gpt_call
        fields = '__all__'

class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ['node_id' , 'title', 'description', 'example']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ['node_id', 'question', 'question_a', 'question_b', 'question_c', 'question_d', 'true_answer']