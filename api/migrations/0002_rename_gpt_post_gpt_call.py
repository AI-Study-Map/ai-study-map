# Generated by Django 4.2.4 on 2023-09-03 15:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Gpt_post',
            new_name='Gpt_call',
        ),
    ]