# Generated by Django 4.2.4 on 2023-10-17 22:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_alter_edge_child_node_alter_edge_map_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='edge',
            old_name='map',
            new_name='map_id',
        ),
        migrations.RenameField(
            model_name='map',
            old_name='user',
            new_name='user_id',
        ),
        migrations.RenameField(
            model_name='node',
            old_name='map',
            new_name='map_id',
        ),
    ]
