from django.db import models

class Gpt_call(models.Model):

    body = models.TextField(blank=False, null=False)

class Question(models.Model):

    body = models.TextField(blank=False, null=False)


class User(models.Model):
    user_id = models.CharField(max_length=255, primary_key=True)
    last_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    birthdate = models.DateField()
    level = models.PositiveIntegerField(default=0)
    exp = models.PositiveIntegerField(default=0)

class Map(models.Model):
    map_id = models.CharField(max_length=255, primary_key=True,default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    theme_name = models.CharField(max_length=255)
    graph_structure = models.TextField(null=True)
    achieve_percentage = models.PositiveIntegerField(default=0)
    total_nodes = models.PositiveIntegerField(default=0)
    cleared_nodes = models.PositiveIntegerField(default=0)

class Node(models.Model):
    node_id = models.CharField(max_length=255, primary_key=True)
    map = models.ForeignKey(Map, on_delete=models.CASCADE, null=True)
    x_coordinate = models.FloatField(default=0.0)
    y_coordinate = models.FloatField(default=0.0)
    title = models.CharField(max_length=255, default="")
    description = models.TextField(null=True)
    example = models.TextField(null=True)
    question = models.TextField(null=True)
    question_a = models.TextField(null=True)
    question_b = models.TextField(null=True)
    question_c = models.TextField(null=True)
    question_d = models.TextField(null=True)
    true_answer = models.CharField(max_length=10, null=True)
    is_cleared = models.BooleanField(default=False)
    is_extra_node = models.BooleanField(default=False)

class Edge(models.Model):
    edge_id = models.CharField(max_length=255, primary_key=True)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    parent_node = models.ForeignKey(Node, related_name='parent_node', on_delete=models.CASCADE)
    child_node = models.ForeignKey(Node, related_name='child_node', on_delete=models.CASCADE)