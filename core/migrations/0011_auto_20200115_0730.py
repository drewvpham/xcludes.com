# Generated by Django 2.2.4 on 2020-01-15 07:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_auto_20200115_0616'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='entry',
            options={},
        ),
        migrations.RemoveField(
            model_name='entry',
            name='prize',
        ),
    ]
