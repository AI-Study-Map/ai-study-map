# Generated by Django 4.2.4 on 2023-10-18 03:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_rename_map_edge_map_id_rename_user_map_user_id_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='idd',
            field=models.PositiveIntegerField(null=True),
        ),
    ]