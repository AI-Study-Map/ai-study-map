from rest_framework import serializers
from .models import Gpt_call, Question, Node, Map, User, Edge

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gpt_call
        fields = '__all__'

class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ['node_id' , 'map_id', 'title', 'description', 'example']

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ['node_id', 'question', 'question_a', 'question_b', 'question_c', 'question_d', 'true_answer']

class SaveMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Map
        fields = ['map_id', 'theme_name', 'graph_structure']

class SaveNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ['node_id', 'map_id', 'idd', 'x_coordinate', 'y_coordinate']

class SaveEdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Edge
        fields = ['edge_id', 'map_id', 'parent_node', 'child_node']

class CreateNewNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = ['node_id', 'map_id', 'idd', 'x_coordinate', 'y_coordinate', 'title']